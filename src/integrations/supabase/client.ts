// Supabase browser client.
//
// Auth notes (read before changing anything here):
//   * `detectSessionInUrl: true` is REQUIRED — the password-recovery mail links
//     back to /auth/reset-password#access_token=… and the client must parse that
//     hash to emit PASSWORD_RECOVERY (see src/pages/auth/ResetPassword.tsx).
//   * Sessions persist to localStorage and auto-refresh.
//   * `flowType: 'pkce'` was tried and reverted — the default implicit flow is
//     fine for this app.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xsyjrijezdajiojxgzzr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_0hOP3uwiK2A5ENf_5s69fA_XY37wfzN";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

/** How long a tab is willing to wait for the shared cross-tab auth lock. */
const LOCK_ACQUIRE_TIMEOUT_MS = 5_000;
/** Hard ceiling on any single Supabase HTTP request (auth, REST, storage). */
const REQUEST_TIMEOUT_MS = 15_000;

/**
 * Cross-tab auth lock with a bounded wait.
 *
 * supabase-js serializes token refreshes across tabs via `navigator.locks`, which
 * is genuinely useful here: the shop and the admin panel share one Supabase project,
 * so two open tabs would otherwise race a refresh-token rotation and invalidate each
 * other's session.
 *
 * The lock was previously replaced by a no-op passthrough because an open admin tab
 * appeared to deadlock the shop. The real cause of that was an `async`
 * onAuthStateChange callback in Header.tsx that wedged the auth client *inside* the
 * lock, so the Web Lock was never released and every other tab blocked on it forever.
 * That bug is fixed — but we do not want a single misbehaving tab (e.g. the admin
 * panel, which we do not control from here) to be able to freeze this app again.
 *
 * So: take the real lock, but never wait on it indefinitely. If it is still held after
 * LOCK_ACQUIRE_TIMEOUT_MS we give up and run unlocked — degrading to the old
 * passthrough behaviour in the pathological case, while keeping real serialization in
 * the normal one. This can never deadlock.
 */
async function boundedCrossTabLock<R>(
  name: string,
  _acquireTimeout: number,
  fn: () => Promise<R>,
): Promise<R> {
  const locks = typeof navigator !== 'undefined' ? navigator.locks : undefined;
  if (!locks) return fn(); // non-browser / unsupported → same as auth-js's own lockNoOp

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), LOCK_ACQUIRE_TIMEOUT_MS);

  try {
    return await locks.request(
      name,
      { mode: 'exclusive', signal: controller.signal },
      async () => fn(),
    );
  } catch (err) {
    // Only an *acquisition* timeout aborts; once granted, the abort is a no-op.
    if (err instanceof DOMException && err.name === 'AbortError') {
      console.warn(
        `[supabase] auth lock "${name}" held by another tab for >${LOCK_ACQUIRE_TIMEOUT_MS}ms — continuing without it.`,
      );
      return fn();
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    lock: boundedCrossTabLock,
  },
  global: {
    // Every REST request waits on auth.getSession() before it is sent, so a request
    // that never settles stalls the whole auth pipeline behind it. Give each request
    // a hard ceiling: a network hang now *rejects* (react-query and our own callers
    // can surface an error) instead of hanging a promise forever.
    fetch: (input, init) =>
      fetch(input, {
        ...init,
        signal: init?.signal ?? AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      }),
  },
});

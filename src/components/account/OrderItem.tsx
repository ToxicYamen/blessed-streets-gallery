import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  MapPin,
  Package,
  RotateCcw,
  Truck,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

import {
  ORDER_STATUS_BADGES,
  ORDER_STATUS_LABELS,
  isOrderStatus,
  type OrderStatus,
} from '@/lib/order-status';
import { CartItem } from '@/lib/store/cart';
import { cn } from '@/lib/utils';

type Carrier = 'dhl' | 'ups' | 'dpd' | 'gls' | 'hermes';

interface OrderProps {
  order: {
    id: string;
    total: number;
    status: string;
    created_at: string;
    items: CartItem[];
    shipping_address: string;
    payment_method: string;
    estimated_delivery: string;
    tracking_number?: string | null;
    shipping_carrier?: Carrier | null;
    shipped_at?: string | null;
  };
  /**
   * @deprecated Direct cancellation was replaced by the manual
   * Storno/Rückgabe request flow (link to /support). The prop is kept
   * optional so existing callers keep compiling; it is intentionally unused.
   */
  onCancelOrder?: (orderId: string) => Promise<void>;
}

// ─── Status meta ────────────────────────────────────────────────────────────
// Labels + Badge-Farben kommen aus der kanonischen Quelle in
// src/lib/order-status.ts (identisch mit dem Admin-Panel). Hier bleibt nur
// die Stepper-Position, weil sie reine Darstellung dieser Komponente ist.

const STATUS_STEP_IDX: Record<OrderStatus, number> = {
  pending: -1,
  confirmed: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
  cancelled: -2,
  refunded: -2,
};

const STEP_KEYS = ['confirmed', 'processing', 'shipped', 'delivered'] as const;

const STEPS: { key: string; label: string }[] = STEP_KEYS.map((key) => ({
  key,
  label: ORDER_STATUS_LABELS[key],
}));

// ─── Carrier meta ───────────────────────────────────────────────────────────

const CARRIER_META: Record<
  Carrier,
  { label: string; trackUrl: (n: string) => string; accent: string }
> = {
  dhl: {
    label: 'DHL',
    trackUrl: (n) =>
      `https://www.dhl.de/de/privatkunden/pakete-empfangen/verfolgen.html?piececode=${encodeURIComponent(n)}`,
    accent: 'bg-[#ffcc00] text-[#d40511]',
  },
  ups: {
    label: 'UPS',
    trackUrl: (n) =>
      `https://www.ups.com/track?tracknum=${encodeURIComponent(n)}&loc=de_DE`,
    accent: 'bg-[#3b2a1a] text-[#ffb500]',
  },
  dpd: {
    label: 'DPD',
    trackUrl: (n) =>
      `https://tracking.dpd.de/parcelstatus?query=${encodeURIComponent(n)}`,
    accent: 'bg-[#dc0032] text-white',
  },
  gls: {
    label: 'GLS',
    trackUrl: (n) =>
      `https://gls-group.com/DE/de/paketverfolgung?match=${encodeURIComponent(n)}`,
    accent: 'bg-[#061ab1] text-[#ffd520]',
  },
  hermes: {
    label: 'Hermes',
    trackUrl: (n) =>
      `https://www.myhermes.de/empfangen/sendungsverfolgung/sendungsinformation/#${encodeURIComponent(n)}`,
    accent: 'bg-[#003d6a] text-white',
  },
};

// ─── Address parsing ────────────────────────────────────────────────────────

// `shipping_address` comes in as a multi-line string from the Stripe verify
// function. We split heuristically into name / line1 / line2 / postal+city /
// country so the UI shows a real postal block instead of one squashed line.
function parseAddress(raw: string): {
  name?: string;
  line1?: string;
  line2?: string;
  cityLine?: string;
  country?: string;
} {
  if (!raw) return {};
  const parts = raw
    .split(/\n|,/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length === 0) return {};
  if (parts.length === 1) return { line1: parts[0] };

  // Heuristic: 5+ lines = name / line1 / line2 / postal+city / country
  if (parts.length >= 5) {
    return {
      name: parts[0],
      line1: parts[1],
      line2: parts[2],
      cityLine: parts[3],
      country: parts[4],
    };
  }
  // 4 lines = name / line1 / postal+city / country
  if (parts.length === 4) {
    return {
      name: parts[0],
      line1: parts[1],
      cityLine: parts[2],
      country: parts[3],
    };
  }
  // 3 lines = line1 / postal+city / country
  if (parts.length === 3) {
    return { line1: parts[0], cityLine: parts[1], country: parts[2] };
  }
  // 2 lines
  return { line1: parts[0], cityLine: parts[1] };
}

// ─── Component ──────────────────────────────────────────────────────────────

export const OrderItem = ({ order }: OrderProps) => {
  const status: OrderStatus = isOrderStatus(order.status)
    ? order.status
    : 'pending';
  const badge = ORDER_STATUS_BADGES[status];
  const stepIdx = STATUS_STEP_IDX[status];
  const addr = parseAddress(order.shipping_address ?? '');
  const carrierKey = (order.shipping_carrier ?? null) as Carrier | null;
  const carrier = carrierKey ? CARRIER_META[carrierKey] : null;
  const isShipped = status === 'shipped' || status === 'delivered';
  const isCancelled = status === 'cancelled';
  const isRefunded = status === 'refunded';
  const isClosed = isCancelled || isRefunded;
  // Short order reference, same form as shown in the header (#XXXXXXXX).
  const shortId = order.id.slice(0, 8).toUpperCase();

  const copyTracking = async () => {
    if (!order.tracking_number) return;
    try {
      await navigator.clipboard.writeText(order.tracking_number);
      toast.success('Tracking-Nummer kopiert');
    } catch {
      toast.error('Konnte nicht kopieren');
    }
  };

  return (
    <article
      className={cn(
        'relative border bg-mono-950/40 backdrop-blur-sm transition-colors',
        isClosed
          ? 'border-mono-100/5 opacity-70'
          : 'border-mono-100/10 hover:border-mono-100/20',
      )}
    >
      {/* ─── Header strip ─────────────────────────────────────── */}
      <header className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 p-6 md:p-8 border-b border-mono-100/10">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5">
            <span className={cn('size-1.5 rounded-full', badge.dot)} />
            <span
              className={cn(
                'font-mono text-[10px] uppercase tracking-[0.25em]',
                badge.text,
              )}
            >
              {ORDER_STATUS_LABELS[status]}
            </span>
          </div>
          <p className="font-mono text-mono-100 mt-2 text-sm">
            #{order.id.slice(0, 8).toUpperCase()}
          </p>
          <p className="text-xs text-mono-500 mt-1">
            Bestellt am{' '}
            {new Date(order.created_at).toLocaleDateString('de-DE', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        <div className="text-left md:text-right shrink-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-mono-500">
            Summe
          </p>
          <p className="font-display text-3xl md:text-4xl text-mono-100 leading-none mt-1">
            {Number(order.total).toFixed(2).replace('.', ',')}
            <span className="text-mono-400 text-xl ml-1">€</span>
          </p>
        </div>
      </header>

      {/* ─── Status stepper ─────────────────────────────────────── */}
      {!isClosed && (
        <div className="px-6 md:px-8 pt-7 pb-6">
          <StatusStepper currentStep={stepIdx} />
        </div>
      )}
      {isClosed && (
        <div className="px-6 md:px-8 py-6 border-b border-mono-100/10">
          <div className="flex items-center gap-3 text-rose-200">
            <X className="size-4 shrink-0" />
            <p className="text-sm">
              {isRefunded
                ? 'Diese Bestellung wurde erstattet.'
                : 'Diese Bestellung wurde storniert.'}
            </p>
          </div>
        </div>
      )}

      {/* ─── Tracking block (shipped/delivered + tracking_number present) ─── */}
      {isShipped && order.tracking_number && (
        <div className="mx-6 md:mx-8 mb-6 border border-mono-100/15">
          <div className="grid grid-cols-1 md:grid-cols-[auto,1fr,auto] gap-5 md:gap-6 p-5 md:p-6">
            {/* Carrier badge */}
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'h-12 px-4 grid place-items-center font-bold text-base tracking-wide rounded-md',
                  carrier ? carrier.accent : 'bg-mono-100 text-mono-950',
                )}
              >
                {carrier?.label ?? 'Versand'}
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-mono-500">
                  Sendung
                </p>
                <p className="text-sm text-mono-100 mt-0.5">
                  {status === 'delivered'
                    ? ORDER_STATUS_LABELS.delivered
                    : 'Unterwegs zu dir'}
                </p>
              </div>
            </div>

            {/* Tracking number + copy */}
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-mono-500">
                Tracking-Nummer
              </p>
              <button
                type="button"
                onClick={copyTracking}
                className="group/copy mt-1 flex items-center gap-2 font-mono text-sm md:text-base text-mono-100 hover:text-mono-300 transition-colors max-w-full"
                title="Kopieren"
              >
                <span className="truncate">{order.tracking_number}</span>
                <Copy className="size-3.5 shrink-0 opacity-0 group-hover/copy:opacity-100 transition-opacity" />
              </button>
              {order.estimated_delivery && status !== 'delivered' && (
                <p className="text-xs text-mono-500 mt-2 flex items-center gap-1.5">
                  <Clock className="size-3" />
                  Geschätzt:{' '}
                  {new Date(order.estimated_delivery).toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: 'long',
                  })}
                </p>
              )}
            </div>

            {/* CTA */}
            {carrier && (
              <a
                href={carrier.trackUrl(order.tracking_number)}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'group/cta self-stretch md:self-center inline-flex items-center justify-center gap-2',
                  'bg-mono-100 text-mono-950 hover:bg-mono-200',
                  'px-5 h-12 text-sm transition-colors whitespace-nowrap',
                )}
              >
                <Truck className="size-4" />
                Bei {carrier.label} verfolgen
                <ExternalLink className="size-3.5 opacity-60 group-hover/cta:translate-x-0.5 transition-transform" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* ─── Items ───────────────────────────────────────────── */}
      <section className="px-6 md:px-8 pb-6">
        <SectionLabel icon={Package}>Artikel</SectionLabel>
        <ul className="mt-4 divide-y divide-mono-100/5">
          {order.items.map((item, idx) => (
            <li
              key={`${item.id}-${item.size}-${idx}`}
              className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
            >
              <div className="size-14 bg-mono-900 shrink-0 overflow-hidden rounded-md">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="size-full grid place-items-center text-mono-700">
                    <Package className="size-5" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-mono-100 truncate">{item.name}</p>
                <p className="text-xs text-mono-500 mt-0.5">
                  Größe {item.size} · Menge {item.quantity}
                </p>
              </div>
              <p className="font-mono text-sm text-mono-200 shrink-0">
                {(item.price * item.quantity).toFixed(2).replace('.', ',')} €
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* ─── Address + meta footer ───────────────────────────── */}
      <footer className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 px-6 md:px-8 py-6 border-t border-mono-100/10">
        <div>
          <SectionLabel icon={MapPin}>Lieferadresse</SectionLabel>
          <address className="not-italic mt-3 text-sm text-mono-200 leading-relaxed">
            {addr.name && <div>{addr.name}</div>}
            {addr.line1 && <div>{addr.line1}</div>}
            {addr.line2 && <div className="text-mono-400">{addr.line2}</div>}
            {addr.cityLine && <div>{addr.cityLine}</div>}
            {addr.country && (
              <div className="text-mono-400 uppercase tracking-wide text-xs mt-1">
                {addr.country}
              </div>
            )}
            {!addr.line1 && !addr.cityLine && (
              <span className="text-mono-500">{order.shipping_address}</span>
            )}
          </address>
        </div>

        <div className="space-y-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-mono-500">
              Zahlungsmethode
            </p>
            <p className="text-sm text-mono-200 capitalize mt-1">
              {order.payment_method || '—'}
            </p>
          </div>
          {order.estimated_delivery && !isClosed && (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-mono-500">
                Voraussichtliche Lieferung
              </p>
              <p className="text-sm text-mono-200 mt-1">
                {new Date(order.estimated_delivery).toLocaleDateString('de-DE', {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          )}
          {!isClosed && (
            <div className="pt-2">
              <Link
                to={`/support?bestellung=${shortId}&typ=rueckgabe`}
                className="inline-flex items-center gap-2 rounded-none border border-mono-100/15 hover:border-mono-100/40 hover:bg-mono-900 text-mono-300 hover:text-mono-100 px-4 h-9 text-xs uppercase tracking-wider transition-colors"
              >
                <RotateCcw className="size-3.5" />
                Storno / Rückgabe anfragen
              </Link>
              <p className="text-xs text-mono-500 mt-2 leading-relaxed max-w-xs">
                Wir prüfen deine Anfrage manuell — das kann 1–3 Werktage
                dauern. Nach Prüfung erhältst du dein Retourenlabel per
                E-Mail.
              </p>
            </div>
          )}
        </div>
      </footer>
    </article>
  );
};

// ─── Sub-components ─────────────────────────────────────────────────────────

function SectionLabel({
  icon: Icon,
  children,
}: {
  icon: typeof Package;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-mono-500">
      <Icon className="size-3" />
      {children}
    </div>
  );
}

function StatusStepper({ currentStep }: { currentStep: number }) {
  return (
    <ol className="flex items-center" aria-label="Bestellstatus">
      {STEPS.map((step, idx) => {
        const isDone = idx < currentStep;
        const isActive = idx === currentStep;
        const isFuture = idx > currentStep;
        const isLast = idx === STEPS.length - 1;

        return (
          <li
            key={step.key}
            className={cn('flex items-center', !isLast && 'flex-1')}
          >
            <div className="flex flex-col items-center gap-2 -ml-px first:ml-0">
              <div
                className={cn(
                  'size-7 rounded-full grid place-items-center border transition-all',
                  isDone &&
                    'bg-mono-100 border-mono-100 text-mono-950',
                  isActive &&
                    'border-mono-100 text-mono-100 bg-mono-950 ring-4 ring-mono-100/10',
                  isFuture &&
                    'border-mono-100/15 text-mono-600 bg-transparent',
                )}
              >
                {isDone ? (
                  <CheckCircle2 className="size-4" />
                ) : (
                  <span
                    className={cn(
                      'size-1.5 rounded-full',
                      isActive ? 'bg-mono-100' : 'bg-mono-600',
                    )}
                  />
                )}
              </div>
              <span
                className={cn(
                  'text-[10px] uppercase tracking-[0.15em] whitespace-nowrap',
                  isDone || isActive ? 'text-mono-100' : 'text-mono-600',
                )}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={cn(
                  'flex-1 h-px mx-2 mb-5 transition-colors',
                  idx < currentStep ? 'bg-mono-100/40' : 'bg-mono-100/10',
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

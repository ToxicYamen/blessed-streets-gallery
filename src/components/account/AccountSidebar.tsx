import { Link } from 'react-router-dom';
import {
  HelpCircle,
  KeyRound,
  LifeBuoy,
  LogOut,
  RotateCcw,
  Truck,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AccountSidebarProps {
  onLogout: () => void;
  stats?: { count: number; total: number };
}

export const AccountSidebar = ({ onLogout, stats }: AccountSidebarProps) => {
  const eur = (n: number) =>
    new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <aside className="md:sticky md:top-28 space-y-6 self-start">
      {/* Stats — big editorial numerals */}
      <section className="border border-mono-100/10 bg-mono-950/40 p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-mono-500">
          Auf einen Blick
        </p>
        <div className="mt-5 grid grid-cols-2 gap-5">
          <div>
            <p className="font-display text-4xl text-mono-100 leading-none tabular-nums">
              {stats?.count ?? 0}
            </p>
            <p className="text-xs text-mono-500 mt-2 uppercase tracking-wider">
              {stats?.count === 1 ? 'Bestellung' : 'Bestellungen'}
            </p>
          </div>
          <div>
            <p className="font-display text-4xl text-mono-100 leading-none tabular-nums whitespace-nowrap">
              {stats ? eur(stats.total) : '—'}
            </p>
            <p className="text-xs text-mono-500 mt-2 uppercase tracking-wider">
              Gesamtwert
            </p>
          </div>
        </div>
      </section>

      {/* Help / quick links */}
      <section className="border border-mono-100/10 bg-mono-950/40 p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-mono-500 flex items-center gap-2">
          <HelpCircle className="size-3" />
          Hilfe
        </p>
        <ul className="mt-5 -mx-2">
          <SidebarLink to="/shipping" icon={Truck} label="Versand & Lieferung" />
          <SidebarLink to="/returns" icon={RotateCcw} label="Rückgabe" />
          <SidebarLink to="/support" icon={LifeBuoy} label="Support kontaktieren" />
        </ul>
      </section>

      {/* Actions */}
      <section className="border border-mono-100/10 bg-mono-950/40 p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-mono-500">
          Konto
        </p>
        <div className="mt-5 space-y-3">
          <Link
            to="/auth/forgot-password"
            className="flex items-center gap-3 text-sm text-mono-200 hover:text-mono-100 transition-colors group"
          >
            <KeyRound className="size-4 text-mono-500 group-hover:text-mono-100 transition-colors" />
            Passwort ändern
          </Link>
          <Button
            variant="ghost"
            onClick={onLogout}
            className={cn(
              'w-full rounded-none border border-mono-100/15 hover:border-rose-400/50 hover:bg-rose-950/30 hover:text-rose-200 text-mono-100',
              'h-11 text-xs uppercase tracking-[0.15em] justify-center mt-2',
            )}
          >
            <LogOut className="size-4 mr-2" />
            Abmelden
          </Button>
        </div>
      </section>
    </aside>
  );
};

function SidebarLink({
  to,
  icon: Icon,
  label,
}: {
  to: string;
  icon: typeof Truck;
  label: string;
}) {
  return (
    <li>
      <Link
        to={to}
        className={cn(
          'flex items-center gap-3 px-2 py-2 text-sm text-mono-300 hover:text-mono-100',
          'border-l border-transparent hover:border-mono-100/40 transition-all',
        )}
      >
        <Icon className="size-4 text-mono-500" />
        {label}
      </Link>
    </li>
  );
}

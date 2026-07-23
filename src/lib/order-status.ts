// Kanonischer Bestellstatus für Blessed Streets.
//
// Diese Datei existiert strukturgleich in beiden Repos
// (blessed-streets-gallery + blessed-admin-panel), damit Kunde und Admin
// überall exakt denselben Status mit demselben deutschen Label sehen
// (Esmas Wunsch). Die Datenbank (orders.status) erlaubt genau diese
// sieben Werte — in Lebenszyklus-Reihenfolge:

export const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** Kanonische deutsche Labels — in Shop und Admin identisch. */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Eingegangen',
  confirmed: 'Bestätigt',
  processing: 'In Bearbeitung',
  shipped: 'Versendet',
  delivered: 'Zugestellt',
  cancelled: 'Storniert',
  refunded: 'Erstattet',
};

/** Farbklassen für die Status-Badge (Punkt + Label + optionaler Rahmen). */
export type OrderStatusBadgeClasses = {
  /** Status-Punkt (bg-*). */
  dot: string;
  /** Textfarbe des Labels. */
  text: string;
  /** Rahmenfarbe, falls der Status umrandet gerendert wird. */
  border: string;
};

// Dezente Weiß/Grau-Töne passend zum Schwarz-Design; shipped/delivered
// leicht positiv (emerald), cancelled gedämpft rot, refunded neutral.
export const ORDER_STATUS_BADGES: Record<OrderStatus, OrderStatusBadgeClasses> = {
  pending: {
    dot: 'bg-mono-400',
    text: 'text-mono-300',
    border: 'border-mono-400/30',
  },
  confirmed: {
    dot: 'bg-mono-200',
    text: 'text-mono-200',
    border: 'border-mono-100/30',
  },
  processing: {
    dot: 'bg-mono-100',
    text: 'text-mono-100',
    border: 'border-mono-100/40',
  },
  shipped: {
    dot: 'bg-emerald-400',
    text: 'text-emerald-200',
    border: 'border-emerald-400/40',
  },
  delivered: {
    dot: 'bg-emerald-400',
    text: 'text-emerald-200',
    border: 'border-emerald-400/40',
  },
  cancelled: {
    dot: 'bg-rose-400/80',
    text: 'text-rose-200/90',
    border: 'border-rose-400/30',
  },
  refunded: {
    dot: 'bg-mono-500',
    text: 'text-mono-400',
    border: 'border-mono-100/20',
  },
};

export function isOrderStatus(value: string): value is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(value);
}

/** Deutsches Label für einen (ggf. unbekannten) Status-String aus der DB. */
export function orderStatusLabel(status: string): string {
  return isOrderStatus(status) ? ORDER_STATUS_LABELS[status] : status;
}

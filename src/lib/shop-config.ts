// Zentrale Geschäftsdaten des Shops — EINE Quelle für Versand-/Zollangaben,
// damit Impressum, Versandseite und (später) Rechnungen/Zolldokumente nie
// auseinanderlaufen. Das Admin-Panel führt dieselben Werte in seiner eigenen
// Kopie (blessed-admin-panel/src/lib/shop-config.ts) — bei Änderungen beide
// Dateien anfassen.
export const SHOP_CONFIG = {
  brandName: 'Blessed Streets',
  foundedYear: 2022,

  // Zoll / Ausfuhr (relevant für Lieferungen in die Schweiz).
  // EORI = Economic Operators Registration and Identification — Pflichtangabe
  // auf Ausfuhr-/Zolldokumenten, vergeben vom deutschen Zoll.
  eori: 'DE553103178418827',
  carrier: 'UPS',

  // Bediente Länder (ISO 3166-1 alpha-2).
  countries: ['DE', 'AT', 'CH'],

  // Anzeige-Kurs EUR→CHF für Schweizer Kund:innen — regelmäßig anpassen!
  // Nur für die Preis-ANZEIGE (src/lib/country.ts → formatPrice);
  // die Abrechnung erfolgt immer in EUR über Stripe.
  chfPerEur: 0.93,

  // PAngV-Hinweis unter Preisangaben. Kleinunternehmerin nach § 19 UStG
  // (vom Betreiber bestätigt) — es wird keine Umsatzsteuer ausgewiesen.
  // Der Zusatz "Zzgl. Versandkosten." bleibt als PAngV-Pflichthinweis.
  vatNotice: 'Gemäß § 19 UStG wird keine Umsatzsteuer ausgewiesen. Zzgl. Versandkosten.',
} as const;

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

  // PAngV-Hinweis unter Preisangaben (Kleinunternehmer-Formulierung).
  // [PLATZHALTER: Betreiber muss den USt-Status bestätigen — gilt NUR bei
  // Kleinunternehmerregelung nach § 19 UStG. Bei Regelbesteuerung stattdessen
  // "inkl. MwSt. zzgl. Versandkosten" verwenden.]
  vatNotice: 'Gemäß § 19 UStG wird keine Umsatzsteuer ausgewiesen. Zzgl. Versandkosten.',
} as const;

// Länderauswahl DE/AT/CH — EINE Quelle der Wahrheit für die gesamte App.
// Persistiert in localStorage ('bs-country'); Erstbesucher werden über die
// Browser-Zeitzone eingeordnet (KEINE externe Geo-API — Datenschutz).
// Abgerechnet wird IMMER in EUR über Stripe; für CH rechnen wir Preise nur
// zur Anzeige in CHF um (Kurs: SHOP_CONFIG.chfPerEur).
import { useEffect, useState } from 'react';
import { SHOP_CONFIG } from '@/lib/shop-config';

export type Country = 'DE' | 'AT' | 'CH';

const STORAGE_KEY = 'bs-country';
const EVENT_NAME = 'bs-country-change';

const isCountry = (value: unknown): value is Country =>
  value === 'DE' || value === 'AT' || value === 'CH';

export function getInitialCountry(): Country {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isCountry(stored)) return stored;
  } catch {
    // localStorage blockiert (Private Mode / Cookie-Einstellungen) — Heuristik nutzen.
  }

  // Zeitzonen-Heuristik statt Geo-API: grob, aber ohne Datenabfluss.
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timeZone === 'Europe/Vienna') return 'AT';
    if (timeZone === 'Europe/Zurich') return 'CH';
  } catch {
    // Intl nicht verfügbar — Standard DE.
  }
  return 'DE';
}

export function setCountry(country: Country): void {
  try {
    localStorage.setItem(STORAGE_KEY, country);
  } catch {
    // Persistenz optional — das Event hält die laufende Session konsistent.
  }
  window.dispatchEvent(new CustomEvent<Country>(EVENT_NAME, { detail: country }));
}

/**
 * React-Hook: liefert das aktuelle Land und den Setter.
 * Hört auf das eigene CustomEvent (gleicher Tab) und auf 'storage'
 * (andere Tabs), damit alle Komponenten synchron bleiben.
 */
export function useCountry(): [Country, (country: Country) => void] {
  const [country, setState] = useState<Country>(getInitialCountry);

  useEffect(() => {
    const onCountryChange = (event: Event) => {
      const detail = (event as CustomEvent<Country>).detail;
      if (isCountry(detail)) setState(detail);
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && isCountry(event.newValue)) {
        setState(event.newValue);
      }
    };
    window.addEventListener(EVENT_NAME, onCountryChange);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(EVENT_NAME, onCountryChange);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return [country, setCountry];
}

/**
 * Zentrale Preisformatierung für alles, was Kund:innen sehen.
 * DE/AT: deutsches Format "79,99 €".
 * CH:    Anzeige in CHF, auf 5 Rappen gerundet, Format "CHF 74.40" (de-CH).
 *        Abrechnung erfolgt trotzdem in EUR — nur Anzeige!
 */
export function formatPrice(eur: number, country: Country): string {
  if (country === 'CH') {
    const chf = Math.round(eur * SHOP_CONFIG.chfPerEur * 20) / 20; // 5-Rappen-Rundung
    return `CHF ${chf.toLocaleString('de-CH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return `${eur.toFixed(2).replace('.', ',')} €`;
}

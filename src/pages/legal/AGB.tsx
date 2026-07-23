import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { PageHeader } from '@/components/ui/PageHeader';
import { SEOHead } from '@/components/seo/SEOHead';
import { SHOP_CONFIG } from '@/lib/shop-config';

const linkClass =
  'underline underline-offset-4 hover:text-mono-900 dark:hover:text-mono-100';

/**
 * Geplante Gliederung der AGB. Die endgültigen Texte sind in rechtlicher
 * Prüfung — bis dahin zeigt die Seite bewusst nur die Struktur
 * (gewollter Zustand, vom Betreiber so gewünscht).
 */
const GLIEDERUNG: { nr: string; titel: string; beschreibung: ReactNode }[] = [
  {
    nr: '§ 1',
    titel: 'Geltungsbereich',
    beschreibung: 'Verträge zwischen ENK.BS Label und Verbrauchern über blessedstreets.de.',
  },
  {
    nr: '§ 2',
    titel: 'Vertragsschluss',
    beschreibung: 'Bestellablauf und Bestellbestätigung per E-Mail.',
  },
  {
    nr: '§ 3',
    titel: 'Preise & Zahlung',
    beschreibung: 'Endpreise ohne USt-Ausweis (§ 19 UStG), Zahlung per Karte über Stripe.',
  },
  {
    nr: '§ 4',
    titel: 'Lieferung & Versand',
    beschreibung: 'Versand nach DE/AT/CH, Versandkosten, Lieferzeiten, Zoll bei CH-Lieferungen.',
  },
  {
    nr: '§ 5',
    titel: 'Eigentumsvorbehalt',
    beschreibung: 'Die Ware bleibt bis zur vollständigen Zahlung unser Eigentum.',
  },
  {
    nr: '§ 6',
    titel: 'Widerrufsrecht',
    beschreibung: (
      <>
        14 Tage Widerrufsrecht — alle Details in der{' '}
        <Link to="/widerruf" className={linkClass}>
          Widerrufsbelehrung
        </Link>
        .
      </>
    ),
  },
  {
    nr: '§ 7',
    titel: 'Gewährleistung',
    beschreibung: 'Es gelten die gesetzlichen Mängelrechte.',
  },
  {
    nr: '§ 8',
    titel: 'Datenschutz',
    beschreibung: (
      <>
        Wie wir mit deinen Daten umgehen, steht in der{' '}
        <Link to="/datenschutz" className={linkClass}>
          Datenschutzerklärung
        </Link>
        .
      </>
    ),
  },
  {
    nr: '§ 9',
    titel: 'Schlussbestimmungen',
    beschreibung: 'Deutsches Recht, salvatorische Klausel.',
  },
];

const AGB = () => {
  return (
    <div className="pt-24">
      <SEOHead
        title="AGB — Allgemeine Geschäftsbedingungen"
        description={`Allgemeine Geschäftsbedingungen von ${SHOP_CONFIG.brandName} — derzeit in rechtlicher Prüfung; bis dahin gelten die gesetzlichen Regelungen.`}
        canonicalPath="/agb"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'AGB', url: '/agb' },
        ]}
      />
      <PageHeader
        title="Allgemeine Geschäftsbedingungen."
        description="Für deine Bestellung bei Blessed Streets."
      />

      <section className="py-16">
        <div className="blesssed-container">
          <div className="max-w-3xl">
            {/* Hinweis-Block: gewollter Zustand, bis die finalen AGB vorliegen */}
            <div className="mb-14 rounded-xl border border-mono-200/60 dark:border-mono-800 bg-white/40 dark:bg-mono-900/40 p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-mono-500 mb-3">
                In rechtlicher Prüfung
              </p>
              <p className="text-mono-600 dark:text-mono-300 leading-relaxed">
                Die endgültige Fassung unserer AGB wird derzeit ausgearbeitet. Bis dahin gelten die
                gesetzlichen Regelungen (BGB, Fernabsatzrecht). Fragen zu deiner Bestellung:{' '}
                <a href="mailto:blessedstreets@icloud.com" className={linkClass}>
                  blessedstreets@icloud.com
                </a>
              </p>
            </div>

            <h2 className="text-2xl font-bold mb-2">Struktur — Was dich erwartet.</h2>
            <p className="text-mono-600 dark:text-mono-300 mb-8">
              So werden unsere AGB gegliedert sein:
            </p>

            <ol className="divide-y divide-mono-200/60 dark:divide-mono-800 border-y border-mono-200/60 dark:border-mono-800">
              {GLIEDERUNG.map((abschnitt) => (
                <li key={abschnitt.nr} className="flex gap-6 py-5">
                  <span className="w-12 shrink-0 font-mono text-sm text-mono-500 pt-0.5">
                    {abschnitt.nr}
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground">{abschnitt.titel}</h3>
                    <p className="text-sm text-mono-600 dark:text-mono-300 mt-1 leading-relaxed">
                      {abschnitt.beschreibung}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <p className="mt-14 text-sm text-mono-500">
              ENK.BS Label · Martin-Luther-Str. 64 · 32756 Detmold ·{' '}
              <a href="mailto:blessedstreets@icloud.com" className={linkClass}>
                blessedstreets@icloud.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AGB;

import type { ReactNode } from 'react';

import { PageHeader } from '@/components/ui/PageHeader';
import { SEOHead } from '@/components/seo/SEOHead';
import { SHOP_CONFIG } from '@/lib/shop-config';

/**
 * Deutlich sichtbarer Platzhalter-Block für Angaben, die nur der Betreiber
 * liefern kann. Bewusst auffällig (amber), damit niemand die Seite für
 * fertig hält, solange diese Blöcke existieren.
 */
const Platzhalter = ({ children }: { children: ReactNode }) => (
  <div
    role="note"
    className="my-3 rounded-lg border-2 border-amber-400 bg-amber-400/10 px-4 py-3 text-sm font-semibold text-amber-700 dark:text-amber-300"
  >
    [PLATZHALTER: {children}]
  </div>
);

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="mb-10">
    <h2 className="text-2xl font-bold mb-4">{title}</h2>
    <div className="space-y-4 text-mono-600 dark:text-mono-300 leading-relaxed">{children}</div>
  </section>
);

const Impressum = () => {
  return (
    <div className="pt-24">
      <SEOHead
        title="Impressum"
        description={`Impressum von ${SHOP_CONFIG.brandName} — Angaben gemäß § 5 DDG, Kontakt und Hinweise zur Online-Streitbeilegung.`}
        canonicalPath="/impressum"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Impressum', url: '/impressum' },
        ]}
      />
      <PageHeader title="IMPRESSUM" description="Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz)." />

      <section className="py-16">
        <div className="blesssed-container">
          <div className="max-w-3xl">
            <Section title="Anbieter">
              <Platzhalter>Vor- und Nachname des Betreibers</Platzhalter>
              <Platzhalter>
                Ladungsfähige Anschrift (Straße und Hausnummer, Postleitzahl, Ort) — ein Postfach
                genügt nicht
              </Platzhalter>
              <p>
                {SHOP_CONFIG.brandName} — Streetwear aus Deutschland, gegründet{' '}
                {SHOP_CONFIG.foundedYear}.
              </p>
            </Section>

            <Section title="Kontakt">
              <p>
                E-Mail:{' '}
                <a
                  href="mailto:support@blessedstreets.de"
                  className="underline underline-offset-4 hover:text-mono-900 dark:hover:text-mono-100"
                >
                  support@blessedstreets.de
                </a>
              </p>
            </Section>

            <Section title="Umsatzsteuer">
              <p>
                Gemäß § 19 UStG (Kleinunternehmerregelung) wird keine Umsatzsteuer erhoben und
                ausgewiesen.
              </p>
              <Platzhalter>
                Kleinunternehmer-Status nach § 19 UStG durch den Betreiber bestätigen — falls nicht
                zutreffend, stattdessen USt-IdNr. angeben
              </Platzhalter>
            </Section>

            <Section title="Zoll / Ausfuhr (Schweiz)">
              <p>
                EORI-Nummer (Economic Operators Registration and Identification):{' '}
                <span className="font-mono">{SHOP_CONFIG.eori}</span>
              </p>
              <p>
                Sendungen in die Schweiz werden mit {SHOP_CONFIG.carrier} versendet und
                ordnungsgemäß zur Ausfuhr angemeldet.
              </p>
            </Section>

            <Section title="Streitbeilegung">
              <p>
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS)
                bereit:{' '}
                <a
                  href="https://ec.europa.eu/consumers/odr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-mono-900 dark:hover:text-mono-100"
                >
                  https://ec.europa.eu/consumers/odr
                </a>
              </p>
              <p>
                Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
              <Platzhalter>
                Nichtteilnahme am Verbraucherschlichtungsverfahren durch den Betreiber bestätigen
              </Platzhalter>
            </Section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Impressum;

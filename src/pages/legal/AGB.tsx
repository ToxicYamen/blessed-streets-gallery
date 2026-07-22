import type { ReactNode } from 'react';

import { PageHeader } from '@/components/ui/PageHeader';
import { SEOHead } from '@/components/seo/SEOHead';
import { SHOP_CONFIG } from '@/lib/shop-config';

/**
 * Deutlich sichtbarer Platzhalter-Block für Texte, die der Betreiber über
 * einen AGB-Generator erzeugen muss. Bewusst auffällig (amber), damit niemand
 * die Seite für fertig hält, solange diese Blöcke existieren.
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

const AGB = () => {
  return (
    <div className="pt-24">
      <SEOHead
        title="AGB — Allgemeine Geschäftsbedingungen"
        description={`Allgemeine Geschäftsbedingungen von ${SHOP_CONFIG.brandName} — Vertragsschluss, Preise, Versand nach DE/AT/CH, Zahlung und Gewährleistung.`}
        canonicalPath="/agb"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'AGB', url: '/agb' },
        ]}
      />
      <PageHeader
        title="AGB"
        description="Allgemeine Geschäftsbedingungen für Bestellungen in unserem Online-Shop."
      />

      <section className="py-16">
        <div className="blesssed-container">
          <div className="max-w-3xl">
            <Section title="§ 1 Geltungsbereich">
              <p>
                Diese Allgemeinen Geschäftsbedingungen gelten für alle Bestellungen über den
                Online-Shop von {SHOP_CONFIG.brandName} durch Verbraucher mit Lieferadresse in
                Deutschland, Österreich oder der Schweiz.
              </p>
              <Platzhalter>Generator-Text zu § 1 Geltungsbereich einfügen</Platzhalter>
            </Section>

            <Section title="§ 2 Vertragsschluss">
              <p>
                Die Darstellung der Produkte im Shop stellt kein bindendes Angebot dar. Mit dem
                Abschluss des Bestellvorgangs gibst du ein verbindliches Angebot ab; der Vertrag
                kommt mit unserer Bestellbestätigung bzw. dem Versand der Ware zustande. Eine
                Bestellung ist auch als Gast ohne Kundenkonto möglich.
              </p>
              <Platzhalter>Generator-Text zu § 2 Vertragsschluss einfügen</Platzhalter>
            </Section>

            <Section title="§ 3 Preise und Versandkosten">
              <p>
                Alle Preise sind Endpreise in Euro. Gemäß § 19 UStG (Kleinunternehmerregelung) wird
                keine Umsatzsteuer erhoben und ausgewiesen. Zusätzlich fallen folgende Versandkosten
                an:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Deutschland: 4,99 € — versandkostenfrei ab 50 € Bestellwert (nur DE)</li>
                <li>Österreich: 7,99 €</li>
                <li>Schweiz: 12,99 €</li>
              </ul>
              <Platzhalter>Generator-Text zu § 3 Preise und Versandkosten einfügen</Platzhalter>
            </Section>

            <Section title="§ 4 Zahlung">
              <p>
                Die Zahlung erfolgt über den Zahlungsdienstleister Stripe. Verfügbare Zahlarten
                werden im Checkout angezeigt.
              </p>
              <Platzhalter>Generator-Text zu § 4 Zahlung (Stripe, Fälligkeit) einfügen</Platzhalter>
            </Section>

            <Section title="§ 5 Lieferung">
              <p>
                Wir liefern nach Deutschland, Österreich und in die Schweiz. Bei Lieferungen in die
                Schweiz erfolgt die Ausfuhr mit {SHOP_CONFIG.carrier} unter unserer EORI-Nummer{' '}
                <span className="font-mono">{SHOP_CONFIG.eori}</span>. Eventuelle Schweizer
                Einfuhrabgaben (Zoll, Einfuhrsteuer) trägt der Empfänger.
              </p>
              <Platzhalter>Generator-Text zu § 5 Lieferung und Lieferzeiten einfügen</Platzhalter>
            </Section>

            <Section title="§ 6 Eigentumsvorbehalt">
              <p>Die Ware bleibt bis zur vollständigen Bezahlung unser Eigentum.</p>
              <Platzhalter>Generator-Text zu § 6 Eigentumsvorbehalt einfügen</Platzhalter>
            </Section>

            <Section title="§ 7 Gewährleistung">
              <p>Es gilt das gesetzliche Mängelhaftungsrecht.</p>
              <Platzhalter>Generator-Text zu § 7 Gewährleistung einfügen</Platzhalter>
            </Section>

            <Section title="§ 8 Schlussbestimmungen">
              <Platzhalter>
                Generator-Text zu § 8 Schlussbestimmungen (anwendbares Recht, salvatorische Klausel)
                einfügen
              </Platzhalter>
            </Section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AGB;

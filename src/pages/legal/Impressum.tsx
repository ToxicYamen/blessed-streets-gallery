import type { ReactNode } from 'react';

import { PageHeader } from '@/components/ui/PageHeader';
import { SEOHead } from '@/components/seo/SEOHead';
import { SHOP_CONFIG } from '@/lib/shop-config';

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
            <Section title="Angaben gemäß § 5 DDG">
              <p className="font-semibold text-foreground">ENK.BS Label</p>
              <p>Inhaberin: Esma Nur Kaya</p>
              <p>
                Martin-Luther-Str. 64
                <br />
                32756 Detmold
                <br />
                Deutschland
              </p>
              <p>
                {SHOP_CONFIG.brandName} — Streetwear aus Deutschland, gegründet{' '}
                {SHOP_CONFIG.foundedYear}.
              </p>
            </Section>

            <Section title="Kontakt">
              <p>
                E-Mail:{' '}
                <a
                  href="mailto:blessedstreets@icloud.com"
                  className="underline underline-offset-4 hover:text-mono-900 dark:hover:text-mono-100"
                >
                  blessedstreets@icloud.com
                </a>
              </p>
            </Section>

            <Section title="Umsatzsteuer">
              <p>
                Kleinunternehmerin gemäß § 19 UStG — Umsatzsteuer wird nicht ausgewiesen.
              </p>
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
                Zur Teilnahme an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
                sind wir nicht bereit und nicht verpflichtet.
              </p>
            </Section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Impressum;

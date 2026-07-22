import { Truck, PackageCheck, Globe2, Clock4, Mail, FileCheck2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { SEOHead } from '@/components/seo/SEOHead';
import { SHOP_CONFIG } from '@/lib/shop-config';

const sections = [
  {
    icon: Globe2,
    title: 'Versand nach DE / AT / CH',
    body: 'Wir versenden in ganz Deutschland, Österreich und in die Schweiz. Sendungen außerhalb dieser Länder bitte vorab per E-Mail anfragen.',
  },
  {
    icon: Clock4,
    title: 'Lieferzeiten',
    body: 'Deutschland: 2–4 Werktage. Österreich: 3–5 Werktage. Schweiz: 4–7 Werktage (inkl. Zollabwicklung). Bestellungen werden Mo.–Fr. innerhalb von 24 Stunden bearbeitet.',
  },
  {
    icon: Truck,
    title: 'Versandkosten',
    body: 'Innerhalb Deutschlands ab einem Bestellwert von €50 versandkostenfrei, sonst pauschal €4,99. Österreich €7,99. Schweiz €12,99 (zzgl. eventueller Zollgebühren).',
  },
  {
    icon: PackageCheck,
    title: 'Sendungsverfolgung',
    body: 'Sobald deine Bestellung das Lager verlässt, erhältst du eine E-Mail mit der Tracking-Nummer, mit der du das Paket jederzeit verfolgen kannst.',
  },
  {
    icon: FileCheck2,
    title: 'Zollabwicklung Schweiz',
    body: `Lieferungen in die Schweiz versenden wir mit ${SHOP_CONFIG.carrier}. Die Ausfuhr erfolgt ordnungsgemäß mit Zollinhaltserklärung unter unserer EORI-Nummer ${SHOP_CONFIG.eori}. Eventuelle Schweizer Einfuhrabgaben (MwSt./Zoll) trägt der Empfänger.`,
  },
];

const Shipping = () => {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: sections.map((s) => ({
      '@type': 'Question',
      name: s.title,
      acceptedAnswer: { '@type': 'Answer', text: s.body },
    })),
  };
  return (
    <div className="pt-24">
      <SEOHead
        title="Versand DE / AT / CH — Lieferzeiten & Versandkosten"
        description="Versand nach Deutschland, Österreich und Schweiz. Lieferzeit 2–4 Werktage in DE, versandkostenfrei ab €50. Tracking per E-Mail."
        canonicalPath="/shipping"
        jsonLd={faqSchema}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Versand', url: '/shipping' },
        ]}
      />
      <PageHeader
        title="VERSAND"
        description="Alles, was du zu Lieferung und Versand wissen musst."
      />

      <section className="py-16">
        <div className="blesssed-container max-w-4xl">
          <div className="grid gap-6 md:grid-cols-2">
            {sections.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-mono-200/60 dark:border-mono-800 bg-white/40 dark:bg-mono-900/40 backdrop-blur p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="grid place-items-center size-10 rounded-full bg-mono-100 dark:bg-mono-800">
                    <Icon className="size-5" />
                  </div>
                  <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
                </div>
                <p className="text-mono-600 dark:text-mono-300 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-mono-200/60 dark:border-mono-800 p-8 text-center">
            <Mail className="mx-auto size-6 mb-3 text-mono-500" />
            <h3 className="text-xl font-semibold mb-2">Noch Fragen?</h3>
            <p className="text-mono-500 mb-5 max-w-md mx-auto">
              Wenn etwas nicht ankommt oder du Hilfe zum Versand brauchst, meld dich bei Esma.
            </p>
            <Button asChild>
              <Link to="/support">Zum Support</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shipping;

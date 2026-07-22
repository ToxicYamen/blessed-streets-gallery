import { Undo2, ShieldCheck, CalendarClock, Wallet, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { SEOHead } from '@/components/seo/SEOHead';

const sections = [
  {
    icon: CalendarClock,
    title: '14-Tage-Widerrufsrecht',
    body: 'Du kannst deine Bestellung innerhalb von 14 Tagen ab Erhalt der Ware ohne Angabe von Gründen widerrufen. Die Frist beginnt mit dem Tag, an dem du die Ware erhalten hast.',
  },
  {
    icon: ShieldCheck,
    title: 'Bedingungen',
    body: 'Artikel müssen ungetragen, ungewaschen und im Originalzustand mit allen Etiketten zurückgesendet werden. Aus hygienischen Gründen sind getragene Artikel von der Rücknahme ausgeschlossen.',
  },
  {
    icon: Undo2,
    title: 'So sendest du zurück',
    body: 'Melde dich kurz beim Support — Esma schickt dir innerhalb von 1 Werktag ein Retourenlabel per E-Mail. Pack den Artikel sicher ein, klebe das Label auf und gib das Paket bei DHL ab.',
  },
  {
    icon: Wallet,
    title: 'Rückerstattung',
    body: 'Sobald deine Rücksendung bei uns eingegangen und geprüft ist, erstatten wir den Kaufpreis innerhalb von 14 Tagen auf dasselbe Zahlungsmittel zurück, mit dem du bezahlt hast.',
  },
];

const Returns = () => {
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
        title="Rückgabe & 14-Tage-Widerrufsrecht"
        description="14 Tage Widerrufsrecht nach EU-Recht. Ungetragene Artikel im Originalzustand zurücksenden — Esma kümmert sich um Retourenlabel und Erstattung."
        canonicalPath="/returns"
        jsonLd={faqSchema}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Rückgabe', url: '/returns' },
        ]}
      />
      <PageHeader
        title="RÜCKGABE"
        description="Dein Widerrufsrecht und wie du Artikel an uns zurückschickst."
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

          <div className="mt-12 rounded-2xl border border-mono-200/60 dark:border-mono-800 p-8">
            <h3 className="text-xl font-semibold mb-3">Widerrufsbelehrung (Kurzfassung)</h3>
            <p className="text-mono-600 dark:text-mono-300 leading-relaxed">
              Sie haben das Recht, binnen 14 Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt 14 Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die Waren in Besitz genommen haben. Um Ihr Widerrufsrecht auszuüben, müssen Sie uns mittels einer eindeutigen Erklärung (z. B. ein per Post versandter Brief oder eine E-Mail) über Ihren Entschluss informieren.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-mono-200/60 dark:border-mono-800 p-8 text-center">
            <Mail className="mx-auto size-6 mb-3 text-mono-500" />
            <h3 className="text-xl font-semibold mb-2">Bereit zur Rücksendung?</h3>
            <p className="text-mono-500 mb-5 max-w-md mx-auto">
              Schreib Esma kurz mit Bestellnummer und Grund — sie kümmert sich um Retourenlabel und Erstattung.
            </p>
            <Button asChild>
              <Link to="/support">Rücksendung anfordern</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Returns;

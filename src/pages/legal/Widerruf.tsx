import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { PageHeader } from '@/components/ui/PageHeader';
import { SEOHead } from '@/components/seo/SEOHead';

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

const Widerruf = () => {
  return (
    <div className="pt-24">
      <SEOHead
        title="Widerrufsbelehrung"
        description="Widerrufsbelehrung von Blessed Streets — 14 Tage Widerrufsrecht, Muster-Widerrufsformular und Infos zur bequemen Rückgabe über unser Support-Formular."
        canonicalPath="/widerruf"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Widerruf', url: '/widerruf' },
        ]}
      />
      <PageHeader
        title="WIDERRUF"
        description="Dein 14-tägiges Widerrufsrecht und wie du es ausübst."
      />

      <section className="py-16">
        <div className="blesssed-container">
          <div className="max-w-3xl">
            <Section title="Widerrufsbelehrung">
              <h3 className="text-lg font-semibold text-foreground">Widerrufsrecht</h3>
              <p>
                Du hast das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu
                widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem du oder ein
                von dir benannter Dritter, der nicht der Beförderer ist, die Waren in Besitz
                genommen hast bzw. hat.
              </p>
              <Platzhalter>
                Vollständige Widerrufsbelehrung aus Generator (eRecht24 o.ä.) einfügen — inkl.
                Name/Anschrift des Unternehmers, Erklärungswege und Fristwahrung
              </Platzhalter>

              <h3 className="text-lg font-semibold text-foreground">Folgen des Widerrufs</h3>
              <p>
                Wenn du diesen Vertrag widerrufst, erstatten wir dir alle Zahlungen, die wir von dir
                erhalten haben, einschließlich der Lieferkosten (mit Ausnahme zusätzlicher Kosten
                für eine andere Lieferart als die günstigste Standardlieferung), unverzüglich und
                spätestens binnen vierzehn Tagen ab Eingang deines Widerrufs.
              </p>
              <Platzhalter>
                Generator-Text zu den Widerrufsfolgen einfügen — inkl. Regelung, wer die Kosten der
                Rücksendung trägt
              </Platzhalter>
            </Section>

            <Section title="Muster-Widerrufsformular">
              <p>
                (Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus
                und senden Sie es zurück.)
              </p>
              <div className="rounded-xl border border-mono-200/60 dark:border-mono-800 bg-white/40 dark:bg-mono-900/40 p-6 space-y-3">
                <p>— An:</p>
                <Platzhalter>Name und Anschrift des Unternehmers</Platzhalter>
                <p>E-Mail: support@blessedstreets.de</p>
                <p>
                  — Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag
                  über den Kauf der folgenden Waren (*)/die Erbringung der folgenden Dienstleistung
                  (*)
                </p>
                <p>— Bestellt am (*)/erhalten am (*)</p>
                <p>— Name des/der Verbraucher(s)</p>
                <p>— Anschrift des/der Verbraucher(s)</p>
                <p>— Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)</p>
                <p>— Datum</p>
                <p className="text-sm text-mono-500">(*) Unzutreffendes streichen.</p>
              </div>
            </Section>

            <Section title="Rückgabe ganz einfach über unser Support-Formular">
              <p>
                Am schnellsten geht deine Rückgabe über unser{' '}
                <Link
                  to="/support"
                  className="underline underline-offset-4 hover:text-mono-900 dark:hover:text-mono-100"
                >
                  Support-Formular
                </Link>
                : Gib bitte den Grund deiner Rückgabe an — optionale Fotos beschleunigen die
                Bearbeitung, sind aber keine Voraussetzung für dein Widerrufsrecht.
              </p>
              <p>
                Die Bearbeitung kann 1–3 Werktage dauern, wir kümmern uns schnellstmöglich. Nach der
                Prüfung erhältst du dein Retourenlabel bequem per E-Mail.
              </p>
            </Section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Widerruf;

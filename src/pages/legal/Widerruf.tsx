import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { PageHeader } from '@/components/ui/PageHeader';
import { SEOHead } from '@/components/seo/SEOHead';

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
              <p>
                Um dein Widerrufsrecht auszuüben, musst du uns (ENK.BS Label, Martin-Luther-Str.
                64, 32756 Detmold, Deutschland, E-Mail:{' '}
                <a
                  href="mailto:blessedstreets@icloud.com"
                  className="underline underline-offset-4 hover:text-mono-900 dark:hover:text-mono-100"
                >
                  blessedstreets@icloud.com
                </a>
                ) mittels einer eindeutigen Erklärung (z.B. ein mit der Post versandter Brief oder
                eine E-Mail) über deinen Entschluss, diesen Vertrag zu widerrufen, informieren. Du
                kannst dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht
                vorgeschrieben ist.
              </p>
              <p>
                Zur Wahrung der Widerrufsfrist reicht es aus, dass du die Mitteilung über die
                Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absendest.
              </p>

              <h3 className="text-lg font-semibold text-foreground">Folgen des Widerrufs</h3>
              <p>
                Wenn du diesen Vertrag widerrufst, erstatten wir dir alle Zahlungen, die wir von dir
                erhalten haben, einschließlich der Lieferkosten (mit Ausnahme zusätzlicher Kosten
                für eine andere Lieferart als die günstigste Standardlieferung), unverzüglich und
                spätestens binnen vierzehn Tagen ab dem Tag, an dem die Mitteilung über deinen
                Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden
                wir dasselbe Zahlungsmittel, das du bei der ursprünglichen Transaktion eingesetzt
                hast, es sei denn, mit dir wurde ausdrücklich etwas anderes vereinbart; in keinem
                Fall werden dir wegen dieser Rückzahlung Entgelte berechnet.
              </p>
              <p>
                Wir können die Rückzahlung verweigern, bis wir die Waren wieder zurückerhalten
                haben oder bis du den Nachweis erbracht hast, dass du die Waren zurückgesandt hast,
                je nachdem, welches der frühere Zeitpunkt ist.
              </p>
              <p>
                Du hast die Waren unverzüglich und in jedem Fall spätestens binnen vierzehn Tagen
                ab dem Tag, an dem du uns über den Widerruf dieses Vertrags unterrichtest, an uns
                zurückzusenden oder zu übergeben. Die Frist ist gewahrt, wenn du die Waren vor
                Ablauf der Frist von vierzehn Tagen absendest.
              </p>
              <p>Du trägst die unmittelbaren Kosten der Rücksendung der Waren.</p>
              <p>
                Du musst für einen etwaigen Wertverlust der Waren nur aufkommen, wenn dieser
                Wertverlust auf einen zur Prüfung der Beschaffenheit, Eigenschaften und
                Funktionsweise der Waren nicht notwendigen Umgang mit ihnen zurückzuführen ist.
              </p>
            </Section>

            <Section title="Muster-Widerrufsformular">
              <p>
                (Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus
                und senden Sie es zurück.)
              </p>
              <div className="rounded-xl border border-mono-200/60 dark:border-mono-800 bg-white/40 dark:bg-mono-900/40 p-6 space-y-3">
                <p>
                  — An: ENK.BS Label, Martin-Luther-Str. 64, 32756 Detmold, Deutschland
                  <br />
                  E-Mail: blessedstreets@icloud.com
                </p>
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

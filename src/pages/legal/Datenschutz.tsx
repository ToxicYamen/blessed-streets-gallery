import type { ReactNode } from 'react';

import { PageHeader } from '@/components/ui/PageHeader';
import { SEOHead } from '@/components/seo/SEOHead';

const Section = ({ id, title, children }: { id: string; title: string; children: ReactNode }) => (
  <section id={id} className="mb-10 scroll-mt-28">
    <h2 className="text-2xl font-bold mb-4">{title}</h2>
    <div className="space-y-4 text-mono-600 dark:text-mono-300 leading-relaxed">{children}</div>
  </section>
);

const INHALT = [
  { id: 'verantwortliche', titel: '1. Verantwortliche' },
  { id: 'hosting', titel: '2. Hosting & Server-Logs' },
  { id: 'kundenkonto', titel: '3. Datenbank & Kundenkonto (Supabase)' },
  { id: 'bestellungen', titel: '4. Bestellungen & Zahlung (Stripe, UPS)' },
  { id: 'emails', titel: '5. Transaktions-E-Mails (Resend)' },
  { id: 'cookies', titel: '6. Cookies & lokaler Speicher' },
  { id: 'support', titel: '7. Support-Anfragen' },
  { id: 'rechte', titel: '8. Deine Rechte' },
  { id: 'aufsicht', titel: '9. Aufsichtsbehörde' },
] as const;

const Datenschutz = () => {
  return (
    <div className="pt-24">
      <SEOHead
        title="Datenschutzerklärung"
        description="Datenschutzerklärung von Blessed Streets — Informationen zur Verarbeitung personenbezogener Daten beim Besuch und Einkauf in unserem Shop."
        canonicalPath="/datenschutz"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Datenschutz', url: '/datenschutz' },
        ]}
      />
      <PageHeader
        title="DATENSCHUTZ"
        description="Informationen zur Verarbeitung deiner personenbezogenen Daten nach Art. 13/14 DSGVO."
      />

      <section className="py-16">
        <div className="blesssed-container">
          <div className="max-w-3xl">
            {/* Inhalts-Übersicht */}
            <nav
              aria-label="Inhaltsübersicht"
              className="mb-12 rounded-xl border border-mono-200/60 dark:border-mono-800 bg-white/40 dark:bg-mono-900/40 p-6"
            >
              <h2 className="text-lg font-bold mb-4">Inhalt</h2>
              <ol className="space-y-2 text-mono-600 dark:text-mono-300">
                {INHALT.map((eintrag) => (
                  <li key={eintrag.id}>
                    <a
                      href={`#${eintrag.id}`}
                      className="underline underline-offset-4 hover:text-mono-900 dark:hover:text-mono-100"
                    >
                      {eintrag.titel}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <Section id="verantwortliche" title="1. Verantwortliche">
              <p>Verantwortliche im Sinne der DSGVO ist:</p>
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
                E-Mail:{' '}
                <a
                  href="mailto:blessedstreets@icloud.com"
                  className="underline underline-offset-4 hover:text-mono-900 dark:hover:text-mono-100"
                >
                  blessedstreets@icloud.com
                </a>
              </p>
            </Section>

            <Section id="hosting" title="2. Hosting & Server-Logs">
              <p>
                Wenn du unsere Website aufrufst, verarbeitet der Server automatisch technische
                Zugriffsdaten in sogenannten Server-Logs: deine IP-Adresse, Browsertyp und
                -version, Betriebssystem, die aufgerufene Seite sowie Datum und Uhrzeit des
                Zugriffs.
              </p>
              <p>
                Diese Daten sind technisch erforderlich, um dir die Website anzuzeigen und um
                Stabilität und Sicherheit des Betriebs zu gewährleisten. Rechtsgrundlage ist unser
                berechtigtes Interesse an einem sicheren und funktionierenden Betrieb der Website
                (Art. 6 Abs. 1 lit. f DSGVO). Die Logs werden nicht mit anderen Datenquellen
                zusammengeführt und nach kurzer Zeit gelöscht.
              </p>
            </Section>

            <Section id="kundenkonto" title="3. Datenbank & Kundenkonto (Supabase)">
              <p>
                Für Datenbank, Benutzerkonten und Authentifizierung nutzen wir Supabase als
                Auftragsverarbeiter (Art. 28 DSGVO). Unser Supabase-Projekt wird in der EU-Region
                Frankfurt (Deutschland) betrieben — deine Daten verlassen die EU dabei nicht.
              </p>
              <p>
                Wenn du ein Kundenkonto anlegst, speichern wir deine E-Mail-Adresse und deine
                Bestellhistorie, bis du dein Konto löschst. Rechtsgrundlage ist die Erfüllung des
                Nutzungsvertrags über dein Konto (Art. 6 Abs. 1 lit. b DSGVO).
              </p>
              <p>
                Ein Konto ist keine Pflicht: Du kannst auch als Gast ohne Kundenkonto bestellen.
              </p>
            </Section>

            <Section id="bestellungen" title="4. Bestellungen & Zahlung (Stripe, UPS)">
              <p>
                Wenn du bestellst, verarbeiten wir die für die Abwicklung notwendigen Daten (Name,
                Lieferadresse, E-Mail-Adresse, bestellte Artikel). Rechtsgrundlage ist die
                Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO).
              </p>
              <p>
                Die Zahlung wickelt unser Zahlungsdienstleister Stripe Payments Europe Ltd.
                (Dublin, Irland) ab. Deine Kartendaten gibst du direkt bei Stripe ein — sie gehen
                ausschließlich an Stripe und erreichen unsere Server zu keinem Zeitpunkt.
              </p>
              <p>
                Bestell- und Rechnungsdaten müssen wir aufgrund handels- und steuerrechtlicher
                Vorgaben 10 Jahre aufbewahren (§ 147 AO; Rechtsgrundlage Art. 6 Abs. 1 lit. c
                DSGVO).
              </p>
              <p>
                Zur Zustellung deiner Bestellung geben wir deine Lieferadresse an unseren
                Versanddienstleister UPS weiter (Art. 6 Abs. 1 lit. b DSGVO).
              </p>
            </Section>

            <Section id="emails" title="5. Transaktions-E-Mails (Resend)">
              <p>
                Für Transaktionsmails — also Bestell- und Versandbestätigungen — nutzen wir den
                Versanddienst Resend (EU-Region). Diese E-Mails sind Teil der Vertragsabwicklung;
                Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO. Werbe-Mails oder einen Newsletter
                versenden wir nicht.
              </p>
            </Section>

            <Section id="cookies" title="6. Cookies & lokaler Speicher">
              <p>
                Wir verwenden ausschließlich technisch notwendige Speicherungen in deinem Browser:
                die Login-Session, deinen Warenkorb und deine Länderwahl (localStorage). Diese
                Speicherungen sind für den Betrieb des Shops unbedingt erforderlich (§ 25 Abs. 2
                TDDDG) — eine Einwilligung ist dafür nicht nötig, deshalb siehst du bei uns auch
                kein Cookie-Banner.
              </p>
              <p>
                Es gibt kein Tracking, keine Werbung und keine Analyse-Tools. Unsere Schriftarten
                hosten wir lokal — beim Seitenaufruf wird keine Verbindung zu Google-Servern
                aufgebaut.
              </p>
            </Section>

            <Section id="support" title="7. Support-Anfragen">
              <p>
                Wenn du uns über das Support-Formular kontaktierst, verarbeiten wir die von dir
                übermittelten Daten (z.B. Name, E-Mail-Adresse, Nachricht) ausschließlich zur
                Bearbeitung deiner Anfrage. Bei Retouren kannst du optional Fotos hochladen — auch
                diese verwenden wir nur zur Bearbeitung deines Anliegens.
              </p>
              <p>
                Rechtsgrundlage ist die Vertragserfüllung bzw. Vertragsanbahnung (Art. 6 Abs. 1
                lit. b DSGVO) sowie unser berechtigtes Interesse an der Beantwortung allgemeiner
                Anfragen (Art. 6 Abs. 1 lit. f DSGVO). Nach abschließender Bearbeitung löschen wir
                die Daten, soweit keine gesetzlichen Aufbewahrungspflichten bestehen.
              </p>
            </Section>

            <Section id="rechte" title="8. Deine Rechte">
              <p>Du hast uns gegenüber folgende Rechte hinsichtlich deiner Daten:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Auskunft über die verarbeiteten Daten (Art. 15 DSGVO)</li>
                <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
                <li>Löschung (Art. 17 DSGVO)</li>
                <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
                <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
              </ul>
              <p>
                Schreib uns dazu einfach an{' '}
                <a
                  href="mailto:blessedstreets@icloud.com"
                  className="underline underline-offset-4 hover:text-mono-900 dark:hover:text-mono-100"
                >
                  blessedstreets@icloud.com
                </a>
                . Außerdem hast du das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu
                beschweren.
              </p>
            </Section>

            <Section id="aufsicht" title="9. Aufsichtsbehörde">
              <p>Die für uns zuständige Aufsichtsbehörde ist:</p>
              <p>
                Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen
                <br />
                Kavalleriestraße 2–4
                <br />
                40213 Düsseldorf
                <br />
                <a
                  href="https://www.ldi.nrw.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-mono-900 dark:hover:text-mono-100"
                >
                  www.ldi.nrw.de
                </a>
              </p>
            </Section>

            <p className="text-sm text-mono-500">Stand: Juli 2026</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Datenschutz;

import type { ReactNode } from 'react';

import { PageHeader } from '@/components/ui/PageHeader';
import { SEOHead } from '@/components/seo/SEOHead';

/**
 * Deutlich sichtbarer Platzhalter-Block für Texte, die der Betreiber über
 * einen Generator (z.B. eRecht24) erzeugen muss. Bewusst auffällig (amber),
 * damit niemand die Seite für fertig hält, solange diese Blöcke existieren.
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
            <Section title="1. Verantwortlicher">
              <Platzhalter>
                Name und ladungsfähige Anschrift des Verantwortlichen (identisch mit dem Impressum)
                sowie E-Mail-Kontakt — eRecht24-Text einfügen
              </Platzhalter>
            </Section>

            <Section title="2. Allgemeine Hinweise zur Datenverarbeitung">
              <p>
                Diese Datenschutzerklärung informiert über Art, Umfang und Zweck der Verarbeitung
                personenbezogener Daten beim Besuch dieser Website und bei Bestellungen in unserem
                Shop.
              </p>
              <Platzhalter>
                Allgemeiner Einleitungstext (Rechtsgrundlagen, Speicherdauer, Empfängerkategorien) —
                eRecht24-Text einfügen
              </Platzhalter>
            </Section>

            <Section title="3. Hosting, Datenbank und Authentifizierung (Supabase)">
              <p>
                Für Hosting der Shop-Daten, Benutzerkonten (Authentifizierung) und Datenbank nutzen
                wir Supabase. Unser Supabase-Projekt wird in einer EU-Region betrieben.
              </p>
              <Platzhalter>
                eRecht24-Text zu Supabase (Auftragsverarbeitung, Rechtsgrundlage Art. 6 Abs. 1 lit. b
                und f DSGVO, EU-Hosting) einfügen
              </Platzhalter>
            </Section>

            <Section title="4. Zahlungsabwicklung (Stripe)">
              <p>
                Die Bezahlung im Shop wird über den Zahlungsdienstleister Stripe abgewickelt. Beim
                Checkout wirst du zu Stripe weitergeleitet; Zahlungsdaten (z.B. Kartendaten) werden
                direkt von Stripe verarbeitet und erreichen unsere Server nicht.
              </p>
              <Platzhalter>
                eRecht24-Text zu Stripe (Stripe Payments Europe Ltd., Rechtsgrundlage,
                Drittlandübermittlung/SCC) einfügen
              </Platzhalter>
            </Section>

            <Section title="5. Google Fonts">
              <p>
                Diese Website bindet Schriftarten von Google Fonts ein, die derzeit von
                Google-Servern geladen werden. Dabei wird deine IP-Adresse an Google übertragen.
              </p>
              <Platzhalter>
                eRecht24-Text zu Google Fonts einfügen — Hinweis: Das Laden von Google-Servern ist
                ein Abmahnrisiko (LG München I, 3 O 17493/20); empfohlen wird die Umstellung auf
                lokales Self-Hosting der Fonts
              </Platzhalter>
            </Section>

            <Section title="6. Cookies und localStorage">
              <p>
                Wir verwenden technisch notwendige Speicherungen im Browser (localStorage/Cookies),
                z.B. für den Warenkorb, die Login-Session und die Theme-Einstellung. Es findet kein
                Tracking zu Werbezwecken statt.
              </p>
              <Platzhalter>
                eRecht24-Text zu Cookies/localStorage (technisch notwendige Speicherung, § 25 Abs. 2
                TDDDG, Rechtsgrundlage) einfügen
              </Platzhalter>
            </Section>

            <Section title="7. Newsletter">
              <p>
                Wenn du dich für unseren Newsletter anmeldest, verwenden wir deine E-Mail-Adresse,
                um dir Informationen zu neuen Drops und Angeboten zu senden. Die Abmeldung ist
                jederzeit möglich.
              </p>
              <Platzhalter>
                eRecht24-Text zum Newsletter (Double-Opt-in, Einwilligung Art. 6 Abs. 1 lit. a DSGVO,
                Widerruf, eingesetzter Versanddienst — Resend) einfügen
              </Platzhalter>
            </Section>

            <Section title="8. Kontaktformular und Support (inkl. Foto-Upload)">
              <p>
                Über unser Support-Formular kannst du uns Anfragen inkl. optionaler Fotos (z.B. bei
                Reklamationen oder Rückgaben) senden. Die übermittelten Daten verwenden wir
                ausschließlich zur Bearbeitung deiner Anfrage.
              </p>
              <Platzhalter>
                eRecht24-Text zum Kontaktformular (Rechtsgrundlage, Speicherdauer der Anfragen und
                hochgeladenen Fotos) einfügen
              </Platzhalter>
            </Section>

            <Section title="9. Deine Rechte">
              <p>
                Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der
                Verarbeitung, Datenübertragbarkeit sowie Widerspruch. Außerdem besteht ein
                Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde.
              </p>
              <Platzhalter>
                eRecht24-Text zu den Betroffenenrechten (Art. 15–21 DSGVO) und zur zuständigen
                Aufsichtsbehörde einfügen
              </Platzhalter>
            </Section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Datenschutz;

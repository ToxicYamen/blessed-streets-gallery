# Blessed Streets — Launch-Plan

Stand: 15.07.2026 · Basis: 7-Agenten-Audit über beide Apps (Kundenreise, Zahlung,
Versand/Zoll, E-Mails, Recht, Admin-Betrieb, Betrieb/Deployment), dedupliziert.

## Phase 1 — BLOCKER (ohne die kein Launch)

| # | Problem | Fix | Aufwand | Brauche von Yamen/Esma |
|---|---------|-----|---------|------------------------|
| 1 | **Shop zeigt Mock-Produkte** (Revert-Schaden): Admin-Preis/Lager-Änderungen erreichen den Kunden nie; angezeigter Preis ≠ Stripe-Abbuchung (PAngV-Risiko). ProductDetail fragt per UUID ab, bekommt nie einen Treffer, fällt still auf Mock zurück. | Seiten auf vorhandene Supabase-Hooks umstellen (`useProducts`, `useProductBySlug`), Mock-Fallbacks raus | 3–4 Std | — |
| 2 | **Gast-Checkout crasht NACH Zahlung**: `orders.user_id` ist NOT NULL → Insert scheitert → Kunde zahlt, sieht Fehlerseite, keine Order in DB | Migration `user_id` nullable + `customer_email`-Spalte aus Stripe-Session befüllen | 1 Std | Entscheidung: Gast-Checkout behalten? |
| 3 | **Kein Stripe-Webhook**: Tab zu nach Zahlung = Geld kassiert, Bestellung existiert nicht | Edge Function `stripe-webhook` (checkout.session.completed, Signaturprüfung); Idempotenz über stripe_session_id existiert schon | 2–3 Std | Webhook im Stripe-Dashboard anlegen → Signing Secret |
| 4 | **Null Kunden-E-Mails**: keine Bestellbestätigung (§312f BGB Pflicht!), keine Versandmail, Support-Antworten erreichen Kunden nie | Resend-Edge-Functions: order-confirmation, shipping-notice, support-reply | 4–6 Std | **Resend-Account + Domain blessedstreets.de verifizieren** |
| 5 | **Rechtsseiten fehlen komplett**: Impressum (§5 DDG), Datenschutz (Art. 13 DSGVO), AGB (Checkout behauptet Akzeptanz!), Widerruf + Muster-Formular | 4 Seiten + Footer-Links + Checkout-Checkbox | 2–3 Std Code | **Texte aus eRecht24-Generator (~30 €) + Impressum-Daten (Name, ladungsfähige Anschrift)** |
| 6 | **Versandkosten falsch**: Checkout kassiert pauschal 4,90 € für DE **und** AT **und** CH — widerspricht 3 öffentlichen Angaben (4,99/7,99/12,99, frei ab 50 €) | Versandoptionen pro Land in der Edge Function + Frei-ab-Schwelle | 2–3 Std | Finale Raten bestätigen |
| 7 | **Tracking-Eingabe fehlt**: Admin kann Tracking-Nummer/Carrier nirgends setzen → der schöne Kunden-Tracking-Block ist toter Code | UI im Admin-Order-Dialog (Carrier-Select + Nummer + „Als versendet markieren") | 2–3 Std | — |
| 8 | **Kein Refund-Weg**: Kunden-„Storno" setzt nur ein DB-Feld — kein Stripe-Refund, kein Lager-Restock | Refund-Edge-Function + Admin-Button; Kunden-Storno je nach Entscheidung | 4–6 Std | Entscheidung: dürfen Kunden bezahlte Orders selbst stornieren? |
| 9 | **Repo un-pushbar**: 842 MB Rohmedien in ungepushten Commits (3 Dateien > GitHub-100-MB-Limit) → GitHub-Backup + Keepalive-Action laufen nie | Commits neu schreiben (noch nicht gepusht → gefahrlos), BlessedStreetsResource in .gitignore | 1–2 Std | OK dass Rohmedien nur lokal bleiben |
| 10 | **Supabase-Keepalive läuft nirgends** (Free-Tier pausiert nach 7 Tagen Inaktivität) | Nach #9 pushen → GitHub Action aktiv | 15 Min | — |

**Phase 1 gesamt: ~3 Arbeitstage.**

## Phase 2 — WICHTIG (Woche 1 nach Launch-Vorbereitung)

- **Coming-Soon-Gate mit E-Mail-Capture** (Wunsch): Vollbild-Gate vor der Seite, E-Mail → `newsletter_subscribers`; Achtung: Newsletter-Insert ist durch Revert kaputt (Formular ohne onSubmit) → zuerst fixen. robots.txt/sitemap laden derzeit ALLE Crawler ein — fürs Gate drosseln.
- **Cookie-Consent-Banner** (DSGVO) + Google Fonts lokal hosten (Abmahnklassiker).
- **Packzettel-/Adresslabel-Druck** (Wunsch, Etikettendrucker vorhanden): Print-CSS im Admin — funktioniert mit jedem Drucker, ohne UPS-API (0,5 Tag). Echte UPS-Label-API später (braucht UPS-Konto + Shipper-Nummer + Developer-Credentials, 1–2 Tage).
- **Zoll Schweiz**: CH-Orders im Admin markieren, Handelsrechnung/CN22-Daten am Packzettel (EORI DE553103178418827 ist hinterlegt ✓). HS-Code braucht Materialzusammensetzung der Hoodies.
- **Admin-Alert bei neuer Bestellung/Support-Anfrage** (Mail an Esma) — sonst erfährt sie nichts ohne offenen Tab.
- **Admin-Order-Detail**: Kundenname/E-Mail/Telefon + sauber formatierte Lieferadresse.
- **Tote Links**: Footer „Sale" → 404, Collections-Kacheln → 404. Wishlist-Seite zeigt Mock statt echte Merkliste.
- **Klarna/PayPal/Apple Pay** über Stripe aktivieren (Dashboard + `payment_method_types` erweitern).
- **PAngV**: „inkl. MwSt., zzgl. Versand"-Hinweis an jedem Preis (+ Kleinunternehmer-Formulierung §19 UStG).
- **LUCID/Verpackungsgesetz**: Registrierung verpackungsregister.org (kostenlos, Pflicht).
- **Deployment**: Hosting (Vercel), Domain-DNS, Env-Vars, CORS der Edge Functions um Prod-Admin-Domain erweitern, Supabase-Auth-Redirect-URLs, Admin-Zugriffsschutz (aktuell für jeden eingeloggten Kunden erreichbar), `cdn.gpteng.co`-Fremdscript aus Admin-index.html entfernen.
- **Betrieb**: DB-Backups (pg_dump-Cron oder Supabase Pro), Fehler-Monitoring, OG-Image + echtes Favicon (Logo liegt jetzt als SVG vor), Lager-Dekrement atomar machen.
- **CSV-Export Bestellungen** (Steuer).

## Phase 3 — SPÄTER

- CHF-Preise für die Schweiz (Entscheidung von früher steht noch), Länderumschalter DE/AT/CH mit Geo-Detect
- Einheitlicher Bestellstatus in allen Ansichten
- UPS-Label-API-Vollintegration
- Newsletter-Versand (Kampagnen) + Double-Opt-In
- Test→Live-Umstellung Stripe (sk_live als Supabase-Secret, Redeploy, Zahlarten-Freischaltung)

## Bereits erledigt (heute)

- Logo-SVG integriert: Mobile-Header exakt nach Kampagnen-Referenz (☰ + Suche | Logo zentriert | Konto + Warenkorb), Desktop-Header + Mobile-Menü ebenfalls mit Logo
- EORI DE553103178418827: Shop-Versandseite (Zoll-Sektion Schweiz) + Admin-Logistics-Karte mit Copy-Button, zentrale Config in beiden Apps (`src/lib/shop-config.ts`)
- Kampagnen-Material live: Hero-Video (echtes Footage, 0,7 MB), Bento-Grid + Lookbook auf optimierte Kampagnenfotos umgestellt
- Offen: die 4 neuen Fotos (Sturmhauben-Shooting, Plattenladen, Teppich-Flatlay, Kofferraum) liegen **noch nicht als Dateien** in BlessedStreetsResource — bitte reinkopieren, dann optimiere ich sie und binde sie ein

import { useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { CheckCircle2, Info, Loader2, Paperclip, Send, X } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SEOHead } from "@/components/seo/SEOHead";

const MAX_FILE_MB = 10;
const ACCEPTED = ["image/png", "image/jpeg", "image/webp", "image/gif", "application/pdf"];

export default function Support() {
  // Deep-link support: /support?bestellung=<kurz-id>&typ=rueckgabe
  // (linked from the order history "Storno / Rückgabe anfragen" button).
  const [searchParams] = useSearchParams();
  const orderRef = searchParams.get("bestellung");
  const isReturnRequest = searchParams.get("typ") === "rueckgabe";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(() =>
    isReturnRequest
      ? `Rückgabe/Storno zu Bestellung${orderRef ? ` #${orderRef}` : ""}`
      : "",
  );
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pickFile = (f: File | null) => {
    if (!f) {
      setFile(null);
      return;
    }
    if (!ACCEPTED.includes(f.type)) {
      toast.error("Nur Bilder (PNG/JPG/WebP/GIF) oder PDF erlaubt.");
      return;
    }
    if (f.size > MAX_FILE_MB * 1024 * 1024) {
      toast.error(`Datei zu groß (max. ${MAX_FILE_MB} MB).`);
      return;
    }
    setFile(f);
  };

  // Race any async call against a hard timeout so the submit button can never
  // sit forever. Takes PromiseLike, not Promise: supabase query builders are
  // thenables, not real Promises (no .catch/.finally), so `Promise<T>` would
  // reject them at the type level.
  const withTimeout = <T,>(p: PromiseLike<T>, ms = 20000, label = "Anfrage"): Promise<T> =>
    new Promise<T>((resolve, reject) => {
      const t = setTimeout(
        () => reject(new Error(`${label} hat zu lange gebraucht — bitte erneut versuchen.`)),
        ms,
      );
      p.then(
        (v) => { clearTimeout(t); resolve(v); },
        (e) => { clearTimeout(t); reject(e); },
      );
    });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Bitte Name, E-Mail und Nachricht ausfüllen.");
      return;
    }
    setSubmitting(true);
    try {
      let attachment_url: string | null = null;
      let attachment_name: string | null = null;

      if (file) {
        const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await withTimeout(
          supabase.storage
            .from("support-attachments")
            .upload(path, file, { cacheControl: "3600", upsert: false }),
          30000,
          "Datei-Upload",
        );
        if (upErr) throw upErr;
        const { data } = supabase.storage.from("support-attachments").getPublicUrl(path);
        attachment_url = data.publicUrl;
        attachment_name = file.name;
      }

      const { error } = await withTimeout(
        supabase.from("support_messages").insert({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim() || null,
          message: message.trim(),
          attachment_url,
          attachment_name,
        }),
        15000,
        "Nachricht senden",
      );
      if (error) throw error;

      setSent(true);
      toast.success("Nachricht gesendet — Esma meldet sich bald bei dir!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Senden fehlgeschlagen.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-16 sm:py-24">
      <SEOHead
        title="Hilfe & Support — Kontaktiere Esma"
        description="Frage zur Bestellung, Versand oder einem Produkt? Schreib Esma — sie antwortet per E-Mail innerhalb von 24 Stunden. Versand DE / AT / CH."
        canonicalPath="/support"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Support', url: '/support' },
        ]}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            url: 'https://blessedstreets.de/support',
            inLanguage: 'de-DE',
            mainEntity: {
              '@type': 'Organization',
              name: 'Blesssed Streets',
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Customer Support',
                email: 'blessedstreets@icloud.com',
                availableLanguage: ['de', 'en'],
                areaServed: ['DE', 'AT', 'CH'],
              },
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'Wie schnell antwortet ihr?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Esma antwortet in der Regel innerhalb von 24 Stunden (Mo.–Fr.) per E-Mail an die Adresse, mit der du das Formular abgeschickt hast.',
                },
              },
              {
                '@type': 'Question',
                name: 'Welche Dateien kann ich anhängen?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Du kannst Bilder (PNG, JPG, WebP, GIF) oder PDF-Dokumente mit bis zu 10 MB anhängen — z. B. ein Foto eines Defekts oder eine Bestellbestätigung.',
                },
              },
              {
                '@type': 'Question',
                name: 'Wie sende ich einen Artikel zurück?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Schreib uns kurz mit Bestellnummer und Grund. Wir senden dir innerhalb von 1 Werktag ein Retourenlabel per E-Mail. Mehr Infos findest du unter "Rückgabe".',
                },
              },
            ],
          },
        ]}
      />
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Hilfe &amp; Support</h1>
        <p className="text-muted-foreground mt-3">
          Du brauchst Hilfe oder hast eine Frage zu deiner Bestellung? Schreib uns — wir antworten per E-Mail.
        </p>
      </div>

      {isReturnRequest && !sent && (
        <Card className="mb-6 border-primary/30 bg-primary/5">
          <CardContent className="flex gap-3 pt-6">
            <Info className="text-primary mt-0.5 size-5 shrink-0" />
            <div className="space-y-2 text-sm">
              <p className="font-medium">
                Storno / Rückgabe{orderRef ? ` zu Bestellung #${orderRef}` : ""}
              </p>
              <ul className="text-muted-foreground list-disc space-y-1 pl-4">
                <li>
                  Bitte gib in deiner Nachricht kurz den{" "}
                  <span className="text-foreground font-medium">Grund</span> für Storno
                  bzw. Rückgabe an.
                </li>
                <li>
                  Fotos sind{" "}
                  <span className="text-foreground font-medium">optional</span> — sie
                  beschleunigen aber die Bearbeitung (z.&nbsp;B. bei einem Defekt).
                </li>
                <li>
                  Wir prüfen deine Anfrage manuell — die Bearbeitung kann etwas dauern
                  (in der Regel 1–3 Werktage), wir kümmern uns schnellstmöglich. Nach
                  Prüfung erhältst du dein Retourenlabel per E-Mail.
                </li>
              </ul>
              <p className="text-muted-foreground">
                Dein gesetzliches{" "}
                <Link
                  to="/widerruf"
                  className="hover:text-foreground underline underline-offset-2"
                >
                  Widerrufsrecht
                </Link>{" "}
                bleibt davon unberührt.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {sent ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <div className="grid size-14 place-items-center rounded-full bg-green-500/10 text-green-500">
              <CheckCircle2 className="size-7" />
            </div>
            <h2 className="text-xl font-medium">Danke, {name.split(" ")[0] || "dir"}!</h2>
            <p className="text-muted-foreground max-w-sm">
              Deine Nachricht ist bei uns eingegangen. Esma meldet sich so schnell wie möglich an{" "}
              <span className="text-foreground font-medium">{email}</span>.
            </p>
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => {
                setSent(false);
                setName("");
                setEmail("");
                setSubject("");
                setMessage("");
                setFile(null);
              }}
            >
              Weitere Nachricht senden
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Nachricht an den Support</CardTitle>
            <CardDescription>Wir melden uns per E-Mail zurück.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="flex flex-col gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="s-name">Name</Label>
                  <Input id="s-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Dein Name" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="s-email">E-Mail</Label>
                  <Input
                    id="s-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="du@beispiel.de"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="s-subject">Betreff (optional)</Label>
                <Input
                  id="s-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Worum geht es?"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="s-message">Nachricht</Label>
                <Textarea
                  id="s-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Wie können wir helfen?"
                  rows={6}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Anhang (Bild oder PDF, optional)</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
                />
                {file ? (
                  <div className="flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm">
                    <span className="flex min-w-0 items-center gap-2">
                      <Paperclip className="size-4 shrink-0" />
                      <span className="truncate">{file.name}</span>
                      <span className="text-muted-foreground shrink-0">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => pickFile(null)}
                      className="text-muted-foreground hover:text-foreground shrink-0"
                      aria-label="Anhang entfernen"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ) : (
                  <Button type="button" variant="outline" className="justify-start" onClick={() => fileInputRef.current?.click()}>
                    <Paperclip className="mr-2 size-4" />
                    Datei auswählen
                  </Button>
                )}
              </div>

              <Button type="submit" disabled={submitting} className="mt-1">
                {submitting ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Send className="mr-2 size-4" />}
                Nachricht senden
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

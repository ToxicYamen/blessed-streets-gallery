import { useEffect, useState, type CSSProperties } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BlurText from '@/components/BlurText';
import ScrollReveal from '@/components/ScrollReveal';

interface LookbookItem {
  id: string;
  title: string;
  description: string;
  alt: string;
  image: string;
  type: 'image' | 'video';
  season: 'winter' | 'essentials' | 'limited';
}

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
};

// Kuratierte Galerie: die vier neuen Kampagnen-Motive (campaign-*) plus die
// Brand-Sets aus dem Shooting, die sonst nirgends auf der Seite laufen.
// Alle Assets weboptimiert in public/brand (scripts/optimize-campaign.mjs).
const lookbookItems: LookbookItem[] = [
  {
    id: 'look1',
    title: 'Vinyl Session',
    description: 'Der Hoodie im Flatlay auf dem Perserteppich, zwischen Vinyl und Kassetten.',
    alt: 'Schwarzer Blessed-Streets-Hoodie als Flatlay auf einem Perserteppich mit Schallplatten und Kassetten',
    image: '/brand/campaign-flatlay-1080.webp',
    type: 'image',
    season: 'limited',
  },
  {
    id: 'look2',
    title: 'Record Store',
    description: 'Zwischen den Plattenkisten: der schwarze Hoodie im Record Store.',
    alt: 'Model im schwarzen Blessed-Streets-Hoodie zwischen Plattenregalen in einem Plattenladen',
    image: '/brand/campaign-recordstore-1080.webp',
    type: 'image',
    season: 'essentials',
  },
  {
    id: 'look3',
    title: 'Graffiti Tunnel',
    description: 'Zwei Looks im Graffiti-Tunnel — Streetwear in ihrem Element.',
    alt: 'Zwei Models in schwarzen Blessed-Streets-Hoodies in einem mit Graffiti besprühten Tunnel',
    image: '/brand/campaign-tunnel-1080.webp',
    type: 'image',
    season: 'limited',
  },
  {
    id: 'look4',
    title: 'Open Skies',
    description: 'Golden Hour am Kofferraum — zwei Hoodies vor offenem Himmel.',
    alt: 'Zwei Models in Blessed-Streets-Hoodies am offenen Kofferraum vor blauem Himmel',
    image: '/brand/campaign-trunk-1080.webp',
    type: 'image',
    season: 'essentials',
  },
  {
    id: 'look5',
    title: 'Black Colourway',
    description: 'Der schwarze Hoodie frontal — kompromisslos reduziert.',
    alt: 'Model im schwarzen Blessed-Streets-Hoodie vor einer Graffiti-Wand',
    image: '/brand/black-04-1080.webp',
    type: 'image',
    season: 'winter',
  },
  {
    id: 'look6',
    title: 'Sage Colourway',
    description: 'Der Sage-Hoodie an der Graffiti-Wand — Ton in Ton mit der Stadt.',
    alt: 'Model im salbeigrünen Blessed-Streets-Hoodie vor einer Graffiti-Wand',
    image: '/brand/sage-04-1080.webp',
    type: 'image',
    season: 'winter',
  },
  {
    id: 'look7',
    title: 'Stairwell',
    description: 'Am Geländer im Foyer — der schwarze Hoodie im Alltag.',
    alt: 'Model im schwarzen Blessed-Streets-Hoodie an einem Treppengeländer im Kino-Foyer',
    image: '/brand/life-04-1080.webp',
    type: 'image',
    season: 'essentials',
  },
  {
    id: 'look8',
    title: 'Front Row',
    description: 'Kurz durchatmen — auf den Stufen im Kino-Foyer.',
    alt: 'Model im schwarzen Blessed-Streets-Hoodie sitzt auf den Stufen einer Treppe im Kino-Foyer',
    image: '/brand/life-05-1080.webp',
    type: 'image',
    season: 'winter',
  },
  {
    id: 'look9',
    title: 'Take a Seat',
    description: 'Ruhige Silhouette, klarer Schnitt — der weite Blick über die Treppe.',
    alt: 'Model im schwarzen Blessed-Streets-Hoodie sitzt mittig auf einer breiten Treppe',
    image: '/brand/life-06-1080.webp',
    type: 'image',
    season: 'essentials',
  },
  {
    id: 'look10',
    title: 'Full Fit',
    description: 'Der komplette Look in voller Länge auf der Treppe.',
    alt: 'Model im schwarzen Blessed-Streets-Hoodie in Ganzkörperansicht auf einer Treppe',
    image: '/brand/life-07-1080.webp',
    type: 'image',
    season: 'limited',
  },
  {
    id: 'look11',
    title: 'Eye Level',
    description: 'Frontal am Geländer — schwerer Stoff, klare Linien.',
    alt: 'Model im schwarzen Blessed-Streets-Hoodie lehnt an einem Treppengeländer',
    image: '/brand/life-08-1080.webp',
    type: 'image',
    season: 'winter',
  },
  {
    id: 'look12',
    title: 'After Hours',
    description: 'Abendlicht im Foyer — der Hoodie im warmen Braunton.',
    alt: 'Model im braunen Blessed-Streets-Hoodie lehnt an einem Geländer und blickt nach oben',
    image: '/brand/life-09-1080.webp',
    type: 'image',
    season: 'limited',
  },
];

// Wechselnde Seitenverhältnisse geben der CSS-Columns-Strecke den
// Masonry-Rhythmus, ohne Layout-Shift (feste aspect-Klassen).
const ASPECTS = [
  'aspect-[3/4]',
  'aspect-square',
  'aspect-[4/5]',
  'aspect-[3/4]',
  'aspect-[4/3]',
  'aspect-square',
];

const aspectFor = (index: number) => ASPECTS[index % ASPECTS.length];

// Alle Motive liegen als -640/-1080-Varianten vor; die Kampagnen-Motive
// zusätzlich als -blur.webp (LQIP) für einen weichen Ladeübergang.
const smallSrc = (image: string) => image.replace('-1080.webp', '-640.webp');

const lqipStyle = (image: string): CSSProperties | undefined =>
  image.startsWith('/brand/campaign-')
    ? {
        backgroundImage: `url(${image.replace('-1080.webp', '-blur.webp')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : undefined;

const INTRO_TEXT =
  'Zwei Hoodies, eine Stadt. Schwerer Stoff, klare Linien — Streetwear ohne Kompromisse.';

const Lookbook = () => {
  const reduceMotion = usePrefersReducedMotion();

  // Das erste Motiv läuft groß als Opener, der Rest als Editorial-Strecke.
  const opener = lookbookItems[0];
  const gridItems = lookbookItems.slice(1);

  const renderMasonry = (items: LookbookItem[]) => (
    <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
      {items.map(item => {
        const originalIndex = lookbookItems.indexOf(item);
        return (
          <figure key={item.id} className="group mb-6 break-inside-avoid">
            <div className="relative overflow-hidden rounded-xl">
              <img
                src={item.image}
                srcSet={`${smallSrc(item.image)} 640w, ${item.image} 1080w`}
                sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                alt={item.alt}
                loading="lazy"
                style={lqipStyle(item.image)}
                className={`w-full ${aspectFor(originalIndex)} object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]`}
              />
            </div>
            <figcaption className="mt-3">
              <p className="font-mono text-[11px] uppercase tracking-widest text-mono-500">
                {String(originalIndex + 1).padStart(2, '0')} — {item.title}
              </p>
              <p className="mt-1 text-sm text-mono-400">{item.description}</p>
            </figcaption>
          </figure>
        );
      })}
    </div>
  );

  return (
    <div className="pt-24">
      {/* Editorial-Opener: erstes Motiv groß, Titel als BlurText */}
      <section className="blesssed-container">
        <div className="relative overflow-hidden rounded-xl">
          <img
            src={opener.image}
            srcSet={`${opener.image} 1080w, ${opener.image.replace('-1080.webp', '-1600.webp')} 1600w`}
            sizes="(min-width: 1280px) 1232px, 100vw"
            alt={opener.alt}
            style={lqipStyle(opener.image)}
            className="aspect-[4/3] w-full object-cover md:aspect-[21/9]"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10"
            aria-hidden="true"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
            <h1 className="sr-only">Lookbook</h1>
            {reduceMotion ? (
              <p
                aria-hidden="true"
                className="font-display text-5xl tracking-tight text-white md:text-7xl"
              >
                LOOKBOOK
              </p>
            ) : (
              <div aria-hidden="true">
                <BlurText
                  text="LOOKBOOK"
                  animateBy="letters"
                  delay={40}
                  stepDuration={0.15}
                  className="font-display text-5xl tracking-tight text-white md:text-7xl"
                />
              </div>
            )}
            <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-mono-400">
              01 — {opener.title} · Kampagne Blessed Streets
            </p>
          </div>
        </div>
      </section>

      {/* Editorial-Intro mit ScrollReveal */}
      <section className="blesssed-container py-10 md:py-14">
        {reduceMotion ? (
          <h2 className="my-5 max-w-3xl font-display text-[clamp(1.6rem,4vw,3rem)] font-medium leading-[1.4] text-white">
            {INTRO_TEXT}
          </h2>
        ) : (
          <ScrollReveal
            containerClassName="max-w-3xl"
            textClassName="font-display font-medium text-white"
            baseOpacity={0.15}
            baseRotation={2}
            blurStrength={3}
          >
            {INTRO_TEXT}
          </ScrollReveal>
        )}
      </section>

      {/* Lookbook-Strecke */}
      <section className="pb-16">
        <div className="blesssed-container">
          <Tabs defaultValue="all" className="mb-10 w-full">
            <TabsList className="mb-8 grid w-full grid-cols-4 md:w-auto">
              <TabsTrigger value="all" className="font-mono text-[11px] uppercase tracking-widest">
                Alle
              </TabsTrigger>
              <TabsTrigger
                value="essentials"
                className="font-mono text-[11px] uppercase tracking-widest"
              >
                Essentials
              </TabsTrigger>
              <TabsTrigger
                value="winter"
                className="font-mono text-[11px] uppercase tracking-widest"
              >
                Winter
              </TabsTrigger>
              <TabsTrigger
                value="limited"
                className="font-mono text-[11px] uppercase tracking-widest"
              >
                Limited
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              {renderMasonry(gridItems)}
            </TabsContent>

            <TabsContent value="essentials" className="mt-0">
              {renderMasonry(gridItems.filter(item => item.season === 'essentials'))}
            </TabsContent>

            <TabsContent value="winter" className="mt-0">
              {renderMasonry(gridItems.filter(item => item.season === 'winter'))}
            </TabsContent>

            <TabsContent value="limited" className="mt-0">
              {renderMasonry(gridItems.filter(item => item.season === 'limited'))}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Lookbook;

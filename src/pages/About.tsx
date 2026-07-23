import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AnimatedImage from '@/components/ui/AnimatedImage';
import { PageHeader } from '@/components/ui/PageHeader';
import BlurText from '@/components/BlurText';
import ScrollReveal from '@/components/ScrollReveal';
import { scrollRevealStagger } from '@/lib/transitions';
import usePrefersReducedMotion from '@/components/home/usePrefersReducedMotion';

const values = [
  {
    title: 'Qualität ohne Kompromisse',
    text: 'Schwere Stoffe, saubere Verarbeitung, Details, die halten. Wir machen Teile, die sich so gut anfühlen, wie sie aussehen — und lange bleiben.'
  },
  {
    title: 'Reduziertes Design',
    text: 'Jedes Teil ist bewusst gestaltet: klare Linien, dezente Details und zeitlose Silhouetten statt kurzlebiger Trends.'
  },
  {
    title: 'Faire Produktion',
    text: 'Wir arbeiten mit Partnern, die Verantwortung für Mensch und Umwelt übernehmen — bei jedem Schritt, vom Stoff bis zum fertigen Hoodie.'
  }
];

const timeline = [
  {
    year: '2022',
    title: 'Der Anfang',
    text: 'Blessed Streets entsteht in einem kleinen Studio — mit großen Plänen und einem klaren Anspruch an Qualität und Design.'
  },
  {
    year: '2023',
    title: 'Feinschliff',
    text: 'Schnitt, Stoff und Details werden so lange überarbeitet, bis jedes Teil unserem Anspruch gerecht wird.'
  },
  {
    year: 'Heute',
    title: 'Zwei Hoodies, ein Anspruch',
    text: 'Schwarz und Salbei. Zwei Farben, ein Standard: Streetwear, die bleibt.'
  }
];

const About = () => {
  const reducedMotion = usePrefersReducedMotion();
  const valuesRef = useRef<HTMLDivElement[]>([]);
  const timelineRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (reducedMotion) return;
    if (valuesRef.current.length > 0) {
      scrollRevealStagger(valuesRef.current, { y: 30, duration: 0.5, stagger: 0.05 });
    }
    if (timelineRef.current.length > 0) {
      scrollRevealStagger(timelineRef.current, { y: 24, duration: 0.5, stagger: 0.05 });
    }
  }, [reducedMotion]);

  return (
    <div className="pt-24">
      <PageHeader
        title="Über uns"
        description="Die Geschichte hinter Blessed Streets"
      />

      {/* Brand Story */}
      <section className="py-16">
        <div className="blesssed-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Unsere Geschichte</h2>
              <p className="text-mono-600 dark:text-mono-300 mb-4">
                Blessed Streets ist 2022 entstanden — aus der Idee, Kleidung zu machen, die urbane Ästhetik mit Premium-Qualität und reduziertem Design verbindet. Angefangen hat alles in einem kleinen Studio, mit großen Plänen und einem klaren Anspruch an Handwerk.
              </p>
              <p className="text-mono-600 dark:text-mono-300 mb-4">
                Wir glauben, dass Mode beides sein kann: zugänglich und besonders. Jedes Teil unserer Kollektion ist mit Absicht gestaltet — klare Linien, dezente Details, vielseitig kombinierbar und unabhängig von Saisontrends.
              </p>
              <p className="text-mono-600 dark:text-mono-300">
                Nachhaltigkeit und faire Produktion prägen jede unserer Entscheidungen — von der Stoffauswahl bis zu den Produktionspartnern. Wir bauen eine Marke, die Mensch und Umwelt respektiert.
              </p>
            </div>
            <div className="order-first lg:order-last">
              <div className="rounded-xl overflow-hidden">
                <AnimatedImage
                  src="/brand/campaign-flatlay-1080.webp"
                  alt="Blessed-Streets-Hoodie als Flatlay auf einem Perserteppich mit Schallplatten und Kassetten"
                  className="w-full"
                  aspectRatio="square"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kampagnen-Sektion: Recordstore (BlurText-Überschrift) */}
      <section className="py-16 bg-black">
        <div className="blesssed-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div
              className="relative rounded-xl overflow-hidden aspect-[4/5]"
              style={{
                backgroundImage: "url('/brand/campaign-recordstore-blur.webp')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <img
                src="/brand/campaign-recordstore-1080.webp"
                srcSet="/brand/campaign-recordstore-640.webp 640w, /brand/campaign-recordstore-1080.webp 1080w, /brand/campaign-recordstore-1600.webp 1600w"
                sizes="(min-width: 1024px) 50vw, 100vw"
                alt="Blessed-Streets-Hoodie im Plattenladen zwischen Vinyl-Regalen"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div>
              {reducedMotion ? (
                <p className="text-3xl md:text-4xl font-display font-medium mb-6 text-white">
                  Zwischen Vinyl und Beton.
                </p>
              ) : (
                <BlurText
                  text="Zwischen Vinyl und Beton."
                  animateBy="words"
                  delay={80}
                  stepDuration={0.25}
                  direction="top"
                  className="text-3xl md:text-4xl font-display font-medium mb-6 text-white"
                />
              )}
              <p className="text-mono-300 mb-4">
                Unsere Kampagnen entstehen dort, wo die Marke zuhause ist: im Plattenladen, im Tunnel, auf der Straße. Keine Studios, kein Hochglanz — echte Orte, echtes Licht.
              </p>
              <p className="text-mono-400">
                Musik, Beton und Understatement prägen unsere Bildsprache genauso wie unsere Schnitte. Was nicht dazugehört, fliegt raus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Unser Weg — Timeline mit ScrollReveal */}
      <section className="py-16">
        <div className="blesssed-container">
          {reducedMotion ? (
            <h2 className="text-[clamp(1.6rem,4vw,3rem)] leading-[1.4] font-semibold font-display max-w-3xl">
              Von der ersten Skizze bis auf die Straße.
            </h2>
          ) : (
            <ScrollReveal
              containerClassName="max-w-3xl"
              textClassName="font-display"
              baseOpacity={0.1}
              baseRotation={2}
              blurStrength={3}
            >
              Von der ersten Skizze bis auf die Straße.
            </ScrollReveal>
          )}
          <div className="mt-12 border-l border-mono-700 space-y-12">
            {timeline.map((step, i) => (
              <div
                key={step.year}
                ref={el => {
                  if (el) timelineRef.current[i] = el;
                }}
                className="relative pl-8"
              >
                <span
                  className="absolute left-0 top-2 h-2 w-2 -translate-x-1/2 rounded-full bg-black dark:bg-white"
                  aria-hidden="true"
                />
                <p className="font-mono text-sm tracking-[0.25em] uppercase text-mono-500 dark:text-mono-400 mb-1">{step.year}</p>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-mono-600 dark:text-mono-400 max-w-xl">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Unsere Werte */}
      <section className="py-16 bg-mono-800">
        <div className="blesssed-container">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center text-white">Unsere Werte</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <div
                key={value.title}
                ref={el => {
                  if (el) valuesRef.current[i] = el;
                }}
                className="p-6"
              >
                <h3 className="text-xl font-bold mb-4 text-white">{value.title}</h3>
                <p className="text-mono-400">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="blesssed-container">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">Unser Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <div className="mb-4 rounded-xl overflow-hidden">
                <AnimatedImage
                  src="/lovable-uploads/ae0b165b-1ee3-42d3-b7b6-ef45f7449951.png"
                  alt="Teammitglied Alex Chen"
                  aspectRatio="square"
                />
              </div>
              <h3 className="text-lg font-bold">Alex Chen</h3>
              <p className="text-mono-500 dark:text-mono-400">Gründer & Kreativdirektor</p>
            </div>
            <div>
              <div className="mb-4 rounded-xl overflow-hidden">
                <AnimatedImage
                  src="/lovable-uploads/68bd47c8-4553-4f02-8047-e01949d85881.png"
                  alt="Teammitglied Jordan Taylor"
                  aspectRatio="square"
                />
              </div>
              <h3 className="text-lg font-bold">Jordan Taylor</h3>
              <p className="text-mono-500 dark:text-mono-400">Design Lead</p>
            </div>
            <div>
              <div className="mb-4 rounded-xl overflow-hidden">
                <AnimatedImage
                  src="/lovable-uploads/aedc4690-8ddc-49e3-a7a6-605988064d17.png"
                  alt="Teammitglied Morgan Kim"
                  aspectRatio="square"
                />
              </div>
              <h3 className="text-lg font-bold">Morgan Kim</h3>
              <p className="text-mono-500 dark:text-mono-400">Produktionsleitung</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-mono-800">
        <div className="blesssed-container text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">Werde Teil der Reise</h2>
          <p className="text-mono-400 max-w-xl mx-auto mb-8">
            Erlebe, wie wir Streetwear neu denken — mit Fokus auf Qualität, Design und Nachhaltigkeit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop">
              <Button className="min-w-40 min-h-[44px]">
                Zur Kollektion <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="min-w-40 min-h-[44px]">Kontakt aufnehmen</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

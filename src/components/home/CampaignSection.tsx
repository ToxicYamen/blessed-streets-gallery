import ScrollReveal from '@/components/ScrollReveal';
import ShinyText from '@/components/ShinyText';
import usePrefersReducedMotion from './usePrefersReducedMotion';

/**
 * Editoriale Kampagnen-Sektion: großformatiges Tunnel-Motiv mit
 * überlagertem Playfair-Claim, der beim Reinscrollen aufgedeckt wird.
 * Rein monochrom, LQIP als CSS-Hintergrund gegen Layout-/Lade-Flackern.
 */
const CampaignSection = () => {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section aria-label="Blessed Streets Kampagne" className="relative overflow-hidden bg-black">
      <div
        className="relative w-full aspect-[3/4] sm:aspect-[16/9] max-h-[85vh]"
        style={{
          backgroundImage: "url('/brand/campaign-tunnel-blur.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <img
          src="/brand/campaign-tunnel-1080.webp"
          srcSet="/brand/campaign-tunnel-640.webp 640w, /brand/campaign-tunnel-1080.webp 1080w, /brand/campaign-tunnel-1600.webp 1600w"
          sizes="100vw"
          alt="Blessed-Streets-Hoodie in einem Tunnel — urbane Kampagnenaufnahme bei Nacht"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Abdunklung für Textkontrast (>= 4.5:1 auf dem Claim) */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20"
          aria-hidden="true"
        />

        <div className="absolute inset-0 flex items-end">
          <div className="blesssed-container w-full pb-10 md:pb-16">
            <ShinyText
              text="BLESSED STREETS — EST. 2022"
              disabled={reducedMotion}
              speed={4}
              delay={2}
              className="font-mono text-xs md:text-sm uppercase tracking-[0.35em]"
            />
            {reducedMotion ? (
              <h2 className="mt-4 max-w-3xl font-display text-[clamp(1.8rem,5vw,3.5rem)] leading-[1.2] text-white">
                Für die Straße gemacht. Aus Überzeugung getragen.
              </h2>
            ) : (
              <ScrollReveal
                containerClassName="mt-1 max-w-3xl !my-4"
                textClassName="font-display !font-medium text-white !leading-[1.3]"
                baseOpacity={0.1}
                baseRotation={2}
                blurStrength={3}
              >
                Für die Straße gemacht. Aus Überzeugung getragen.
              </ScrollReveal>
            )}
            <p className="mt-2 max-w-xl text-sm md:text-base text-mono-300">
              Keine Studios, kein Hochglanz — echte Orte, echtes Licht.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CampaignSection;

import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SpotlightCard from '@/components/SpotlightCard';
import { PageHeader } from '@/components/ui/PageHeader';

interface Collection {
  id: string;
  name: string;
  description: string;
  image640: string;
  image1080: string;
  alt: string;
}

// Kacheln laufen über die Kampagnen-Assets aus public/brand
// (640er als Basis, 1080er für größere Viewports via srcSet).
const collections: Collection[] = [
  {
    id: 'essentials',
    name: 'ESSENTIALS',
    description: 'Zeitlose Basics, die die Blessed-Streets-Ästhetik definieren.',
    image640: '/brand/campaign-recordstore-640.webp',
    image1080: '/brand/campaign-recordstore-1080.webp',
    alt: 'Model im schwarzen Blessed-Streets-Hoodie zwischen Plattenregalen in einem Plattenladen',
  },
  {
    id: 'winter',
    name: 'WINTER 2024',
    description: 'Schwere Lagen für kalte Tage — reduziert und kompromisslos.',
    image640: '/brand/campaign-tunnel-640.webp',
    image1080: '/brand/campaign-tunnel-1080.webp',
    alt: 'Zwei Models in schwarzen Blessed-Streets-Hoodies in einem mit Graffiti besprühten Tunnel',
  },
  {
    id: 'limited',
    name: 'LIMITED DROPS',
    description: 'Exklusive Designs in streng limitierter Auflage.',
    image640: '/brand/campaign-flatlay-640.webp',
    image1080: '/brand/campaign-flatlay-1080.webp',
    alt: 'Schwarzer Blessed-Streets-Hoodie als Flatlay auf einem Perserteppich mit Schallplatten und Kassetten',
  },
];

const Collections = () => {
  const navigate = useNavigate();

  // Es gibt (noch) keine Collection-Detailseiten — /collections/{id} wäre ein 404.
  // Bis dahin führen alle Kacheln in den Shop.
  const handleCollectionClick = (_collectionId: string) => {
    navigate('/shop');
  };

  return (
    <div className="pt-24">
      <PageHeader
        title="COLLECTIONS"
        description="Drei Kapitel einer Vision — jede Kollektion zeigt eine andere Facette von Blessed Streets."
      />

      {/* Collections Grid */}
      <section className="py-16">
        <div className="blesssed-container">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {collections.map(collection => (
              <div
                key={collection.id}
                role="button"
                tabIndex={0}
                aria-label={`Kollektion ${collection.name} ansehen`}
                onClick={() => handleCollectionClick(collection.id)}
                onKeyDown={event => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleCollectionClick(collection.id);
                  }
                }}
                className="group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                {/* Kampagnen-Bild als Hintergrund mit Hover-Zoom */}
                <img
                  src={collection.image640}
                  srcSet={`${collection.image640} 640w, ${collection.image1080} 1080w`}
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  alt={collection.alt}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                />

                {/* Dunkles Gradient-Overlay für Textlesbarkeit */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent"
                  aria-hidden="true"
                />

                {/* Spotlight-Behandlung als transparente Ebene über dem Bild */}
                <SpotlightCard
                  className="absolute inset-0 flex flex-col justify-end !rounded-none !border-0 !bg-transparent !p-6 md:!p-8"
                  spotlightColor="rgba(255, 255, 255, 0.12)"
                >
                  <h2 className="mb-2 font-display text-2xl text-white md:text-3xl">
                    {collection.name}
                  </h2>
                  <p className="mb-4 max-w-[36ch] text-sm text-mono-300">
                    {collection.description}
                  </p>
                  <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-mono-300 transition-colors duration-200 group-hover:text-white">
                    Zur Kollektion
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-200 ease-out group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </SpotlightCard>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Collections;

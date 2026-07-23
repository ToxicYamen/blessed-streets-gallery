import { useState } from 'react';
import AnimatedImage from '@/components/ui/AnimatedImage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from '@/components/ui/PageHeader';

interface LookbookItem {
  id: string;
  title: string;
  description: string;
  alt: string;
  image: string;
  type: 'image' | 'video';
  season: 'winter' | 'essentials' | 'limited';
}

const Lookbook = () => {
  // Kuratierte Galerie: die vier neuen Kampagnen-Motive (campaign-*) plus die
  // Brand-Sets aus dem Shooting, die sonst nirgends auf der Seite laufen.
  // Alle Assets weboptimiert in public/brand (scripts/optimize-campaign.mjs).
  const [lookbookItems] = useState<LookbookItem[]>([
    {
      id: 'look1',
      title: 'Vinyl Session',
      description: 'Der Hoodie im Flatlay auf dem Perserteppich, zwischen Vinyl und Kassetten.',
      alt: 'Schwarzer Blessed-Streets-Hoodie als Flatlay auf einem Perserteppich mit Schallplatten und Kassetten',
      image: '/brand/campaign-flatlay-1080.webp',
      type: 'image',
      season: 'limited'
    },
    {
      id: 'look2',
      title: 'Record Store',
      description: 'Zwischen den Plattenkisten: der schwarze Hoodie im Record Store.',
      alt: 'Model im schwarzen Blessed-Streets-Hoodie zwischen Plattenregalen in einem Plattenladen',
      image: '/brand/campaign-recordstore-1080.webp',
      type: 'image',
      season: 'essentials'
    },
    {
      id: 'look3',
      title: 'Graffiti Tunnel',
      description: 'Zwei Looks im Graffiti-Tunnel — Streetwear in ihrem Element.',
      alt: 'Zwei Models in schwarzen Blessed-Streets-Hoodies in einem mit Graffiti besprühten Tunnel',
      image: '/brand/campaign-tunnel-1080.webp',
      type: 'image',
      season: 'limited'
    },
    {
      id: 'look4',
      title: 'Open Skies',
      description: 'Golden Hour am Kofferraum — zwei Hoodies vor offenem Himmel.',
      alt: 'Zwei Models in Blessed-Streets-Hoodies am offenen Kofferraum vor blauem Himmel',
      image: '/brand/campaign-trunk-1080.webp',
      type: 'image',
      season: 'essentials'
    },
    {
      id: 'look5',
      title: 'Black Colourway',
      description: 'Der schwarze Hoodie frontal — kompromisslos reduziert.',
      alt: 'Model im schwarzen Blessed-Streets-Hoodie vor einer Graffiti-Wand',
      image: '/brand/black-04-1080.webp',
      type: 'image',
      season: 'winter'
    },
    {
      id: 'look6',
      title: 'Sage Colourway',
      description: 'Der Sage-Hoodie an der Graffiti-Wand — Ton in Ton mit der Stadt.',
      alt: 'Model im salbeigrünen Blessed-Streets-Hoodie vor einer Graffiti-Wand',
      image: '/brand/sage-04-1080.webp',
      type: 'image',
      season: 'winter'
    },
    {
      id: 'look7',
      title: 'Stairwell',
      description: 'Am Geländer im Foyer — der schwarze Hoodie im Alltag.',
      alt: 'Model im schwarzen Blessed-Streets-Hoodie an einem Treppengeländer im Kino-Foyer',
      image: '/brand/life-04-1080.webp',
      type: 'image',
      season: 'essentials'
    },
    {
      id: 'look8',
      title: 'Front Row',
      description: 'Kurz durchatmen — auf den Stufen im Kino-Foyer.',
      alt: 'Model im schwarzen Blessed-Streets-Hoodie sitzt auf den Stufen einer Treppe im Kino-Foyer',
      image: '/brand/life-05-1080.webp',
      type: 'image',
      season: 'winter'
    },
    {
      id: 'look9',
      title: 'Take a Seat',
      description: 'Ruhige Silhouette, klarer Schnitt — der weite Blick über die Treppe.',
      alt: 'Model im schwarzen Blessed-Streets-Hoodie sitzt mittig auf einer breiten Treppe',
      image: '/brand/life-06-1080.webp',
      type: 'image',
      season: 'essentials'
    },
    {
      id: 'look10',
      title: 'Full Fit',
      description: 'Der komplette Look in voller Länge auf der Treppe.',
      alt: 'Model im schwarzen Blessed-Streets-Hoodie in Ganzkörperansicht auf einer Treppe',
      image: '/brand/life-07-1080.webp',
      type: 'image',
      season: 'limited'
    },
    {
      id: 'look11',
      title: 'Eye Level',
      description: 'Frontal am Geländer — schwerer Stoff, klare Linien.',
      alt: 'Model im schwarzen Blessed-Streets-Hoodie lehnt an einem Treppengeländer',
      image: '/brand/life-08-1080.webp',
      type: 'image',
      season: 'winter'
    },
    {
      id: 'look12',
      title: 'After Hours',
      description: 'Abendlicht im Foyer — der Hoodie im warmen Braunton.',
      alt: 'Model im braunen Blessed-Streets-Hoodie lehnt an einem Geländer und blickt nach oben',
      image: '/brand/life-09-1080.webp',
      type: 'image',
      season: 'limited'
    }
  ]);

  return (
    <div className="pt-24">
      <PageHeader
        title="LOOKBOOK"
        description="Explore our visual narrative, capturing the essence of blesssed streets across different environments and seasons."
      />

      {/* Lookbook Content */}
      <section className="py-16">
        <div className="blesssed-container">
          <Tabs defaultValue="all" className="w-full mb-10">
            <TabsList className="grid w-full md:w-auto grid-cols-4 mb-8">
              <TabsTrigger value="all">ALL</TabsTrigger>
              <TabsTrigger value="essentials">ESSENTIALS</TabsTrigger>
              <TabsTrigger value="winter">WINTER</TabsTrigger>
              <TabsTrigger value="limited">LIMITED</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {lookbookItems.map((item) => (
                  <div key={item.id} className="group">
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <AnimatedImage
                        src={item.image}
                        alt={item.alt}
                        className="w-full hover-scale"
                        aspectRatio="square"
                      />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                    <p className="text-mono-400 text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="essentials" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {lookbookItems
                  .filter((item) => item.season === 'essentials')
                  .map((item) => (
                    <div key={item.id} className="group">
                      <div className="relative overflow-hidden rounded-xl mb-4">
                        <AnimatedImage
                          src={item.image}
                          alt={item.alt}
                          className="w-full hover-scale"
                          aspectRatio="square"
                        />
                      </div>
                      <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                      <p className="text-mono-400 text-sm">{item.description}</p>
                    </div>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="winter" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {lookbookItems
                  .filter((item) => item.season === 'winter')
                  .map((item) => (
                    <div key={item.id} className="group">
                      <div className="relative overflow-hidden rounded-xl mb-4">
                        <AnimatedImage
                          src={item.image}
                          alt={item.alt}
                          className="w-full hover-scale"
                          aspectRatio="square"
                        />
                      </div>
                      <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                      <p className="text-mono-400 text-sm">{item.description}</p>
                    </div>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="limited" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {lookbookItems
                  .filter((item) => item.season === 'limited')
                  .map((item) => (
                    <div key={item.id} className="group">
                      <div className="relative overflow-hidden rounded-xl mb-4">
                        <AnimatedImage
                          src={item.image}
                          alt={item.alt}
                          className="w-full hover-scale"
                          aspectRatio="square"
                        />
                      </div>
                      <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                      <p className="text-mono-400 text-sm">{item.description}</p>
                    </div>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Lookbook;

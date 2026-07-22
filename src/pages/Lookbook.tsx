import { useState } from 'react';
import AnimatedImage from '@/components/ui/AnimatedImage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from '@/components/ui/PageHeader';

interface LookbookItem {
  id: string;
  title: string;
  description: string;
  image: string;
  type: 'image' | 'video';
  season: 'winter' | 'essentials' | 'limited';
}

const Lookbook = () => {
  // Kampagnen-Fotos aus BlessedStreetsResource (weboptimiert in public/brand).
  const [lookbookItems] = useState<LookbookItem[]>([
    {
      id: 'look1',
      title: 'Urban Essentials',
      description: 'Minimal streetwear for the modern wardrobe.',
      image: '/brand/black-02-1080.webp',
      type: 'image',
      season: 'essentials'
    },
    {
      id: 'look2',
      title: 'Winter Layers',
      description: 'Premium layering pieces for the cold season.',
      image: '/brand/sage-02-1080.webp',
      type: 'image',
      season: 'winter'
    },
    {
      id: 'look3',
      title: 'Limited Edition',
      description: 'Exclusive drops with limited availability.',
      image: '/brand/life-02-1080.webp',
      type: 'image',
      season: 'limited'
    },
    {
      id: 'look4',
      title: 'Street Couture',
      description: 'Elevated basics with a distinctive edge.',
      image: '/brand/life-03-1080.webp',
      type: 'image',
      season: 'essentials'
    },
    {
      id: 'look5',
      title: 'Winter Statement',
      description: 'Bold statement pieces for winter.',
      image: '/brand/black-03-1080.webp',
      type: 'image',
      season: 'winter'
    },
    {
      id: 'look6',
      title: 'Essential Minimalism',
      description: 'Refined minimalist approach to everyday wear.',
      image: '/brand/sage-03-1080.webp',
      type: 'image',
      season: 'essentials'
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
                        alt={item.title}
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
                          alt={item.title}
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
                          alt={item.title}
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
                          alt={item.title}
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

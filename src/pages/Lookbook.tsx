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
  // Mock lookbook data - in a real app, this would come from an API
  const [lookbookItems] = useState<LookbookItem[]>([
    {
      id: 'look1',
      title: 'Urban Essentials',
      description: 'Minimal streetwear for the modern wardrobe.',
      image: '/lovable-uploads/ae0b165b-1ee3-42d3-b7b6-ef45f7449951.png',
      type: 'image',
      season: 'essentials'
    },
    {
      id: 'look2',
      title: 'Winter Layers',
      description: 'Premium layering pieces for the cold season.',
      image: '/lovable-uploads/68bd47c8-4553-4f02-8047-e01949d85881.png',
      type: 'image',
      season: 'winter'
    },
    {
      id: 'look3',
      title: 'Limited Edition',
      description: 'Exclusive drops with limited availability.',
      image: '/lovable-uploads/aedc4690-8ddc-49e3-a7a6-605988064d17.png',
      type: 'image',
      season: 'limited'
    },
    {
      id: 'look4',
      title: 'Street Couture',
      description: 'Elevated basics with a distinctive edge.',
      image: '/lovable-uploads/14cc0786-37aa-4471-8f05-f800b6420083.png',
      type: 'image',
      season: 'essentials'
    },
    {
      id: 'look5',
      title: 'Winter Statement',
      description: 'Bold statement pieces for winter.',
      image: '/lovable-uploads/bc7f81ea-fb32-4ff2-915a-b8a677272b83.png',
      type: 'image',
      season: 'winter'
    },
    {
      id: 'look6',
      title: 'Essential Minimalism',
      description: 'Refined minimalist approach to everyday wear.',
      image: '/lovable-uploads/17f078c8-2f1a-4e2e-8f56-39cc379c263c.png',
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

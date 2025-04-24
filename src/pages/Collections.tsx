
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import AnimatedImage from '@/components/ui/AnimatedImage';

interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

const Collections = () => {
  // Mock collections data - in a real app, this would come from an API
  const [collections] = useState<Collection[]>([
    {
      id: 'essentials',
      name: 'ESSENTIALS',
      description: 'Timeless staples that define the blesssed streets aesthetic.',
      image: '/lovable-uploads/17f078c8-2f1a-4e2e-8f56-39cc379c263c.png',
      productCount: 12
    },
    {
      id: 'winter',
      name: 'WINTER 2024',
      description: 'Cold-weather layers with premium minimalist design.',
      image: '/lovable-uploads/aedc4690-8ddc-49e3-a7a6-605988064d17.png',
      productCount: 8
    },
    {
      id: 'limited',
      name: 'LIMITED DROPS',
      description: 'Exclusive designs with limited availability.',
      image: '/lovable-uploads/68bd47c8-4553-4f02-8047-e01949d85881.png',
      productCount: 5
    }
  ]);

  return (
    <div className="pt-24">
      {/* Page Header */}
      <section className="py-16 bg-mono-800">
        <div className="blesssed-container">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">COLLECTIONS</h1>
          <p className="text-mono-400 max-w-2xl">
            Explore our carefully curated collections, each representing a different facet of the blesssed streets vision.
          </p>
        </div>
      </section>
      
      {/* Collections Grid */}
      <section className="py-16">
        <div className="blesssed-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((collection) => (
              <Link 
                to={`/collections/${collection.id}`} 
                key={collection.id}
                className="group"
              >
                <div className="mb-4 overflow-hidden rounded-xl">
                  <AnimatedImage
                    src={collection.image}
                    alt={collection.name}
                    aspectRatio="portrait"
                    className="w-full hover-scale"
                  />
                </div>
                <h2 className="text-xl font-bold mb-2">{collection.name}</h2>
                <p className="text-mono-400 mb-2">{collection.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-mono-500">{collection.productCount} products</span>
                  <span className="text-mono-300 group-hover:text-mono-100 flex items-center transition-colors">
                    View Collection <ArrowRight size={16} className="ml-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Collections;

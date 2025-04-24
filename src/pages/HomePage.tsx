
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import AnimatedImage from '@/components/ui/AnimatedImage';
import ProductGrid from '@/components/product/ProductGrid';
import { getFeaturedProducts, getNewArrivals } from '@/data/products';

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const featuredProducts = getFeaturedProducts();
  const newArrivals = getNewArrivals();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <AnimatedImage
            src="/lovable-uploads/91f8cccd-1e38-4174-a2f4-fe931df3bdd0.png"
            alt="Blesssed Streets Khaki Hoodie"
            aspectRatio="portrait md:auto"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-mono-900/60"></div>
        </div>
        
        <div className="blesssed-container relative z-10 mt-24">
          <div className="max-w-2xl">
            <h1 
              className={`text-oversized mb-6 transition-all duration-1000 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}
            >
              ELEVATED STREET FASHION
            </h1>
            <p 
              className={`text-mono-300 text-lg mb-8 max-w-lg transition-all duration-1000 delay-300 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}
            >
              Premium quality. Minimalist design. Urban style. Blesssed Streets embodies the spirit of contemporary street culture.
            </p>
            <Link 
              to="/shop"
              className={`inline-flex items-center bg-mono-100 text-mono-900 px-8 py-3 text-sm font-medium transition-all duration-1000 delay-500 hover:bg-mono-200 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}
            >
              SHOP NOW <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Bento Grid Section */}
      <section className="py-24">
        <div className="blesssed-container">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Collection</h2>
            <Link to="/collections" className="text-mono-400 hover:text-mono-100 transition-colors flex items-center">
              View all <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 md:gap-6">
            <div className="md:col-span-6 lg:col-span-8 bg-mono-800 rounded-md overflow-hidden aspect-square md:aspect-[4/3]">
              <AnimatedImage
                src="/lovable-uploads/17f078c8-2f1a-4e2e-8f56-39cc379c263c.png"
                alt="Blesssed Streets Collection"
                aspectRatio="auto"
                className="w-full h-full hover-scale"
              />
            </div>
            
            <div className="md:col-span-3 lg:col-span-4 bg-mono-800 rounded-md overflow-hidden">
              <AnimatedImage
                src="/lovable-uploads/aedc4690-8ddc-49e3-a7a6-605988064d17.png"
                alt="Blesssed Streets Black Hoodie"
                aspectRatio="portrait"
                className="w-full h-full hover-scale"
              />
            </div>
            
            <div className="md:col-span-3 lg:col-span-4 bg-mono-800 rounded-md overflow-hidden">
              <AnimatedImage
                src="/lovable-uploads/68bd47c8-4553-4f02-8047-e01949d85881.png"
                alt="Blesssed Streets Khaki Hoodie"
                aspectRatio="portrait"
                className="w-full h-full hover-scale"
              />
            </div>
            
            <div className="md:col-span-6 lg:col-span-8 bg-mono-800 rounded-md overflow-hidden">
              <div className="h-full flex flex-col justify-center p-8 md:p-12">
                <h3 className="text-3xl md:text-4xl font-bold mb-4">BLESSSED STREETS Est. 2022</h3>
                <p className="text-mono-400 mb-6">Premium streetwear for those who appreciate quality, minimalism, and urban style.</p>
                <Link 
                  to="/about"
                  className="inline-flex items-center border border-mono-400 text-mono-100 px-6 py-2 text-sm hover:bg-mono-100 hover:text-mono-900 transition-colors"
                >
                  EXPLORE BRAND <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-24 bg-mono-800">
        <div className="blesssed-container">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold">New Arrivals</h2>
            <Link to="/shop/new-arrivals" className="text-mono-400 hover:text-mono-100 transition-colors flex items-center">
              View all <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <ProductGrid products={newArrivals} />
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24">
        <div className="blesssed-container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">JOIN THE MOVEMENT</h2>
            <p className="text-mono-400 mb-8">
              Subscribe to our newsletter for exclusive offers, early access to new drops, and updates from the streets.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-mono-800 border border-mono-700 px-4 py-3 focus:outline-none focus:ring-1 focus:ring-mono-100"
              />
              <button className="bg-mono-100 text-mono-900 px-8 py-3 font-medium hover:bg-mono-200 transition-colors">
                SUBSCRIBE
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

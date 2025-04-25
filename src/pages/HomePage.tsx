import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import AnimatedImage from '@/components/ui/AnimatedImage';
import ProductGrid from '@/components/product/ProductGrid';
import { getFeaturedProducts, getNewArrivals } from '@/data/products';
import { scrollReveal, scrollRevealStagger } from '@/lib/transitions';
import LampDemo from '@/components/lamp-demo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const featuredProducts = getFeaturedProducts();
  const newArrivals = getNewArrivals();
  const heroRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const productCardsRef = useRef<HTMLDivElement[]>([]);
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsVisible(true);

    if (heroRef.current) {
      scrollReveal(heroRef.current, {
        y: 100,
        duration: 0.8,
        delay: 0.2
      });
    }

    if (productsRef.current) {
      scrollReveal(productsRef.current, {
        y: 50,
        duration: 0.6,
        delay: 0.4
      });
    }

    if (productCardsRef.current.length > 0) {
      scrollRevealStagger(productCardsRef.current, {
        y: 30,
        duration: 0.5,
        delay: 0.2,
        stagger: 0.1
      });
    }

    // Video load handler
    if (videoRef.current) {
      videoRef.current.onloadeddata = () => {
        setIsVideoLoaded(true);
      };
    }
  }, []);

  return <div className="min-h-screen bg-mono-50 dark:bg-mono-950">
    {/* Hero Section */}
    <section ref={heroRef} className="min-h-screen flex flex-col justify-center relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className={`w-full h-full object-cover transition-opacity duration-1000 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ aspectRatio: 'portrait' }}
        >
          <source src="/lovable-uploads/video1.mp4" type="video/mp4" />
        </video>
        <div className={`absolute inset-0 bg-mono-900 transition-opacity duration-1000 ${isVideoLoaded ? 'opacity-60' : 'opacity-100'}`}></div>
      </div>

      <div className="blesssed-container relative z-10 mt-24">
        <div className="max-w-2xl">
          <h1 className={`text-oversized mb-6 text-white transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            ELEVATED STREET FASHION
          </h1>
          <p className={`text-mono-300 text-lg mb-8 max-w-lg transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            Premium quality. Minimalist design. Urban style. Blesssed Streets embodies the spirit of contemporary street culture.
          </p>
          <Link to="/shop" className="inline-flex items-center bg-mono-100 text-mono-900 px-8 py-3 text-sm font-medium">
            Shop Now
          </Link>
        </div>
      </div>
    </section>

    {/* Bento Grid Section */}
    <section ref={productsRef} className="py-12">
      <div className="blesssed-container">
        {/* Mobile Version - Simple Text */}
        <div className="block md:hidden text-center mb-8">
          <h2 className="text-3xl font-bold">FEATURED COLLECTION</h2>
        </div>

        {/* Lamp Section - Only visible in dark mode on larger screens */}
        <div className="hidden md:dark:block">
          <LampDemo />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 md:gap-6">
          <div className="md:col-span-6 lg:col-span-8 bg-mono-800 rounded-md overflow-hidden aspect-square md:aspect-[4/3] group">
            <AnimatedImage src="/lovable-uploads/17f078c8-2f1a-4e2e-8f56-39cc379c263c.png" alt="Blesssed Streets Collection" aspectRatio="auto" className="w-full h-full transition-transform duration-500 group-hover:scale-105" />
          </div>

          <div className="md:col-span-3 lg:col-span-4 bg-mono-800 rounded-md overflow-hidden group">
            <AnimatedImage src="/lovable-uploads/aedc4690-8ddc-49e3-a7a6-605988064d17.png" alt="Blesssed Streets Black Hoodie" aspectRatio="portrait" className="w-full h-full transition-transform duration-500 group-hover:scale-105" />
          </div>

          <div className="md:col-span-3 lg:col-span-4 bg-mono-800 rounded-md overflow-hidden group">
            <AnimatedImage src="/lovable-uploads/68bd47c8-4553-4f02-8047-e01949d85881.png" alt="Blesssed Streets Khaki Hoodie" aspectRatio="portrait" className="w-full h-full transition-transform duration-500 group-hover:scale-105" />
          </div>

          <div className="md:col-span-6 lg:col-span-8 bg-mono-800 rounded-md overflow-hidden">
            <div className="h-full flex flex-col justify-center p-8 md:p-12 bg-[#455b57]">
              <h3 className="text-3xl md:text-4xl font-bold mb-4 text-slate-50">BLESSSED STREETS Est. 2022</h3>
              <p className="mb-6 text-slate-50">Premium streetwear for those who appreciate quality, minimalism, and urban style.</p>
              <Link to="/about" className="inline-flex items-center border border-mono-400 text-mono-100 px-6 py-2 text-sm">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* New Arrivals Section */}
    <section className="py-24 bg-mono-950">
      <div className="blesssed-container">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white">New Arrivals</h2>
          <Link to="/shop/new-arrivals" className="text-black dark:text-white flex items-center">
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <ProductGrid products={newArrivals} />
      </div>
    </section>

    {/* Newsletter Section */}
    <section className="py-24 border-t border-mono-800 dark:border-mono-800">
      <div className="blesssed-container">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-black dark:text-white">
              Subscribe to our newsletter
            </h2>
            <p className="text-mono-600 dark:text-mono-400 text-center">
              Get the latest updates and exclusive offers directly to your inbox.
            </p>
            <div className="w-full max-w-sm space-y-2">
              <form className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="max-w-lg flex-1 bg-white dark:bg-mono-800/50 border-black dark:border-mono-700"
                />
                <Button type="submit" className="bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90">
                  Subscribe
                </Button>
              </form>
              <p className="text-xs text-mono-600 dark:text-mono-400">
                By subscribing, you agree to our terms and privacy policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>;
};
export default HomePage;
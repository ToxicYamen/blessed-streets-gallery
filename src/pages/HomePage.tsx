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
import { useTranslation } from 'react-i18next';
import { SparklesCore } from "@/components/ui/sparkles";

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
  const { t } = useTranslation();

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
            {t('home.heroTitle')}
          </h1>
          <p className={`text-mono-300 text-lg mb-8 max-w-lg transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            {t('home.heroSubtitle')}
          </p>
          <Button asChild>
            <Link to="/shop" data-navigation="true" className="inline-flex items-center bg-mono-100 text-mono-900 px-8 py-3 text-sm font-medium">
              {t('home.shopNow')}
            </Link>
          </Button>
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
          <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white">
            {t('home.newArrivals')}
          </h2>
          <Button variant="outline" asChild>
            <Link to="/shop" data-navigation="true" className="text-black dark:text-white flex items-center">
              {t('home.viewAll')}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>

        <ProductGrid products={newArrivals} />
      </div>
    </section>

    {/* Sparkles Section */}
    <div className="h-[40rem] w-full bg-[#455B57] dark:bg-black flex flex-col items-center justify-center overflow-hidden">
      <h1 className="md:text-7xl text-3xl lg:text-9xl font-bold text-center text-white relative z-20">
        Blessed Streets
      </h1>
      <div className="w-[40rem] h-40 relative">
        {/* Gradients */}
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

        {/* Core component */}
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={1200}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />

        {/* Radial Gradient to prevent sharp edges */}
        <div className="absolute inset-0 w-full h-full bg-[#455B57] dark:bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
      </div>
    </div>

    {/* Newsletter Section */}
    <section className="py-24 border-t border-mono-800 dark:border-mono-800">
      <div className="blesssed-container">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col items-center gap-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black dark:text-white">
              {t('home.newsletter.title')}
            </h2>
            <p className="text-mono-600 dark:text-mono-400 text-center max-w-lg">
              {t('home.newsletter.subtitle')}
            </p>
            <div className="w-full max-w-md space-y-4">
              <form className="flex w-full max-w-md items-center space-x-2">
                <div className="flex-1 relative">
                  <div className="relative">
                    <Input
                      type="email"
                      id="newsletter"
                      name="newsletter"
                      placeholder=""
                      className="w-full pl-4 pr-32 py-6 bg-white/5 border-white/10 text-white placeholder:text-white/50 rounded-full peer"
                    />
                    <label
                      htmlFor="newsletter"
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-mono-500 dark:text-mono-400 transition-all duration-200 peer-focus:-translate-y-9 peer-focus:text-xs peer-focus:text-black dark:peer-focus:text-white peer-[:not(:placeholder-shown)]:-translate-y-9 peer-[:not(:placeholder-shown)]:text-xs"
                    >
                      {t('home.newsletter.placeholder')}
                    </label>
                    <button
                      type="submit"
                      className="absolute right-1 top-[50%] -translate-y-1/2 px-6 py-2 bg-black text-white dark:bg-white dark:text-black rounded-full"
                    >
                      {t('home.newsletter.button')}
                    </button>
                  </div>
                </div>
              </form>
              <p className="text-xs text-mono-600 dark:text-mono-400 max-w-md mx-auto">
                {t('home.newsletter.terms')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>;
};
export default HomePage;
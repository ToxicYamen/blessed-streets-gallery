
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AnimatedImage from '@/components/ui/AnimatedImage';

const About = () => {
  return (
    <div className="pt-24">
      {/* Page Header */}
      <section className="py-16 bg-mono-800">
        <div className="blesssed-container">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">ABOUT US</h1>
          <p className="text-mono-400 max-w-2xl">
            The story behind blesssed streets and our mission to elevate street fashion.
          </p>
        </div>
      </section>
      
      {/* Brand Story */}
      <section className="py-16">
        <div className="blesssed-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-mono-300 mb-4">
                Founded in 2022, blesssed streets emerged from a vision to create clothing that balances urban aesthetics with premium quality and minimalist design. Our journey began in a small studio with big dreams and a commitment to craftsmanship.
              </p>
              <p className="text-mono-300 mb-4">
                We believe that fashion should be both accessible and exceptional. Each piece in our collection is designed with intention, focusing on clean lines, subtle details, and versatile styling that transcends seasonal trends.
              </p>
              <p className="text-mono-300">
                Our commitment to sustainability and ethical production informs every decision we make, from material selection to manufacturing partnerships. We're building a brand that respects both people and planet.
              </p>
            </div>
            <div className="order-first lg:order-last">
              <div className="rounded-xl overflow-hidden">
                <AnimatedImage
                  src="/lovable-uploads/17f078c8-2f1a-4e2e-8f56-39cc379c263c.png"
                  alt="Our Story"
                  className="w-full"
                  aspectRatio="square"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Values */}
      <section className="py-16 bg-mono-800">
        <div className="blesssed-container">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Quality Obsessed</h3>
              <p className="text-mono-400">
                We're relentless about using the finest materials and production techniques to create garments that feel as good as they look and stand the test of time.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Mindful Design</h3>
              <p className="text-mono-400">
                Each piece is thoughtfully designed with attention to detail, focusing on clean aesthetics that emphasize versatility and timeless appeal.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Ethical Production</h3>
              <p className="text-mono-400">
                We partner with factories that prioritize worker welfare and environmental responsibility, ensuring our products have a positive impact.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-16">
        <div className="blesssed-container">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <div className="mb-4 rounded-xl overflow-hidden">
                <AnimatedImage
                  src="/lovable-uploads/ae0b165b-1ee3-42d3-b7b6-ef45f7449951.png"
                  alt="Team Member"
                  aspectRatio="square"
                />
              </div>
              <h3 className="text-lg font-bold">Alex Chen</h3>
              <p className="text-mono-400">Founder & Creative Director</p>
            </div>
            <div>
              <div className="mb-4 rounded-xl overflow-hidden">
                <AnimatedImage
                  src="/lovable-uploads/68bd47c8-4553-4f02-8047-e01949d85881.png"
                  alt="Team Member"
                  aspectRatio="square"
                />
              </div>
              <h3 className="text-lg font-bold">Jordan Taylor</h3>
              <p className="text-mono-400">Design Lead</p>
            </div>
            <div>
              <div className="mb-4 rounded-xl overflow-hidden">
                <AnimatedImage
                  src="/lovable-uploads/aedc4690-8ddc-49e3-a7a6-605988064d17.png"
                  alt="Team Member"
                  aspectRatio="square"
                />
              </div>
              <h3 className="text-lg font-bold">Morgan Kim</h3>
              <p className="text-mono-400">Production Manager</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-mono-800">
        <div className="blesssed-container text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Join Our Journey</h2>
          <p className="text-mono-400 max-w-xl mx-auto mb-8">
            Discover how we're redefining street fashion with a focus on quality, design, and sustainability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop">
              <Button className="min-w-40">
                Shop Collection <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="min-w-40">Contact Us</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

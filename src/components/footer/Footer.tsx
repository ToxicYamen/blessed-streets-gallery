
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-mono-900 border-t border-mono-800 pt-16 pb-8">
      <div className="blesssed-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h4 className="text-xl font-bold mb-6">blesssed streets</h4>
            <p className="text-mono-400 mb-6 max-w-xs">
              Elevating street fashion with premium quality and minimalist design since 2022.
            </p>
          </div>
          
          <div>
            <h5 className="text-sm uppercase tracking-wider mb-6">Shop</h5>
            <ul className="space-y-3">
              <li><Link to="/shop" className="text-mono-300 hover:text-mono-100 transition-colors">All Products</Link></li>
              <li><Link to="/collections" className="text-mono-300 hover:text-mono-100 transition-colors">Collections</Link></li>
              <li><Link to="/shop/new-arrivals" className="text-mono-300 hover:text-mono-100 transition-colors">New Arrivals</Link></li>
              <li><Link to="/shop/sale" className="text-mono-300 hover:text-mono-100 transition-colors">Sale</Link></li>
            </ul>
          </div>
          
          <div>
            <h5 className="text-sm uppercase tracking-wider mb-6">Info</h5>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-mono-300 hover:text-mono-100 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-mono-300 hover:text-mono-100 transition-colors">Contact</Link></li>
              <li><Link to="/shipping-returns" className="text-mono-300 hover:text-mono-100 transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/size-guide" className="text-mono-300 hover:text-mono-100 transition-colors">Size Guide</Link></li>
              <li><Link to="/faq" className="text-mono-300 hover:text-mono-100 transition-colors">FAQs</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-mono-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-mono-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} blesssed streets. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link to="/terms" className="text-mono-500 text-sm hover:text-mono-100 transition-colors">Terms & Conditions</Link>
            <Link to="/privacy" className="text-mono-500 text-sm hover:text-mono-100 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

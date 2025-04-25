import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-mono-900 border-t border-mono-800 pt-16 pb-8">
      <div className="blesssed-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h4 className="text-xl font-bold mb-6 text-white">blesssed streets</h4>
            <p className="text-mono-400 mb-6 max-w-xs">
              Elevating street fashion with premium quality and minimalist design since 2022.
            </p>
          </div>

          <div>
            <h5 className="text-sm uppercase tracking-wider mb-6 text-white">Shop</h5>
            <ul className="space-y-2">
              <li><Link to="/shop" className="text-mono-300">All Products</Link></li>
              <li><Link to="/collections" className="text-mono-300">Collections</Link></li>
              <li><Link to="/shop/new-arrivals" className="text-mono-300">New Arrivals</Link></li>
              <li><Link to="/shop/sale" className="text-mono-300">Sale</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-sm uppercase tracking-wider mb-6 text-white">Info</h5>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-mono-300">About</Link></li>
              <li><Link to="/contact" className="text-mono-300">Contact</Link></li>
              <li><Link to="/shipping" className="text-mono-300">Shipping</Link></li>
              <li><Link to="/returns" className="text-mono-300">Returns</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-mono-800">
          <p className="text-mono-400 text-sm text-center">
            © {new Date().getFullYear()} blesssed streets. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

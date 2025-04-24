
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, Heart, User, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Close search input
    setIsSearchOpen(false);
    
    // Navigate to search results page with the query
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
    
    // Reset search input
    setSearchQuery('');
  };
  
  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'py-3 bg-mono-900/90 backdrop-blur-md border-b border-mono-800' : 'py-5'
        }`}
      >
        <div className="blesssed-container flex items-center justify-between">
          <Link to="/" className="text-xl md:text-2xl font-bold tracking-tighter">
            blesssed streets
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8 text-sm">
            <Link to="/shop" className="hover-underline">SHOP</Link>
            <Link to="/collections" className="hover-underline">COLLECTIONS</Link>
            <Link to="/lookbook" className="hover-underline">LOOKBOOK</Link>
            <Link to="/about" className="hover-underline">ABOUT</Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="relative">
                <Input 
                  type="search"
                  placeholder="Search..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-8 w-[200px]"
                  autoFocus
                  onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  <Search size={18} className="text-mono-400" />
                </button>
              </form>
            ) : (
              <button 
                className="p-1" 
                aria-label="Search" 
                onClick={() => setIsSearchOpen(true)}
              >
                <Search size={20} className="text-mono-100" />
              </button>
            )}
            <Link to="/wishlist" className="p-1" aria-label="Wishlist">
              <Heart size={20} className="text-mono-100" />
            </Link>
            <Link to="/cart" className="p-1" aria-label="Cart">
              <ShoppingBag size={20} className="text-mono-100" />
            </Link>
            <Link to="/login" className="p-1 hidden md:block" aria-label="Account">
              <User size={20} className="text-mono-100" />
            </Link>
            <button 
              className="p-1 md:hidden" 
              onClick={toggleMenu}
              aria-label="Menu"
            >
              <Menu size={24} className="text-mono-100" />
            </button>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-mono-900 z-50 transition-all duration-500 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="blesssed-container h-full flex flex-col">
          <div className="flex justify-between items-center py-5">
            <Link to="/" className="text-xl md:text-2xl font-bold tracking-tighter" onClick={toggleMenu}>
              blesssed streets
            </Link>
            <button onClick={toggleMenu}>
              <X size={24} className="text-mono-100" />
            </button>
          </div>
          
          <nav className="flex flex-col space-y-8 mt-16 text-2xl font-medium">
            <Link 
              to="/shop" 
              className="hover:text-mono-300 transition-colors"
              onClick={toggleMenu}
            >
              SHOP
            </Link>
            <Link 
              to="/collections" 
              className="hover:text-mono-300 transition-colors"
              onClick={toggleMenu}
            >
              COLLECTIONS
            </Link>
            <Link 
              to="/lookbook" 
              className="hover:text-mono-300 transition-colors"
              onClick={toggleMenu}
            >
              LOOKBOOK
            </Link>
            <Link 
              to="/about" 
              className="hover:text-mono-300 transition-colors"
              onClick={toggleMenu}
            >
              ABOUT
            </Link>
            <Link 
              to="/cart" 
              className="hover:text-mono-300 transition-colors"
              onClick={toggleMenu}
            >
              CART
            </Link>
            <Link 
              to="/wishlist" 
              className="hover:text-mono-300 transition-colors"
              onClick={toggleMenu}
            >
              WISHLIST
            </Link>
            <Link 
              to="/login" 
              className="hover:text-mono-300 transition-colors"
              onClick={toggleMenu}
            >
              ACCOUNT
            </Link>
          </nav>
          
          <div className="mt-auto pb-8 text-sm text-mono-500">
            © {new Date().getFullYear()} blesssed streets
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;

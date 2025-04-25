import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, Heart, User, Search } from 'lucide-react';
import { SearchInput } from '@/components/ui/search-input';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { cartIconAnimation, pageTransition } from '@/lib/transitions';
import { useCart } from '@/context/CartContext';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);
  const cartIconRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.documentElement.classList.contains('dark'));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const toggleMenu = () => {
    if (isMenuOpen) {
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
    }
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (path: string) => {
    document.body.style.overflow = 'auto';
    setIsMenuOpen(false);
    pageTransition(() => {
      navigate(path);
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchExpanded(false);
    }
  };

  const handleHeartClick = () => {
    if (!isHeartAnimating) {
      setIsHeartAnimating(true);
      setTimeout(() => setIsHeartAnimating(false), 1000);
      navigate('/wishlist');
    }
  };

  const handleCartClick = () => {
    if (cartIconRef.current) {
      cartIconAnimation(cartIconRef.current);
    }
    pageTransition(() => {
      navigate('/cart');
    });
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 py-4",
          isDarkMode
            ? isScrolled
              ? "bg-mono-950/90 backdrop-blur-sm border-b border-white/10" // Dark Mode + Scroll
              : "bg-transparent" // Dark Mode ohne Scroll
            : "bg-black/40 backdrop-blur-md border-b border-black/10" // Light Mode: Dunkler schwarzer Blur
        )}
      >
        <div className="blesssed-container flex items-center justify-between mt-2">
          <Link to="/" className="text-xl md:text-2xl font-bold tracking-tighter text-white" data-navigation="true">
            Blessed streets
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-sm">
            <Link to="/shop" className="text-white" onClick={toggleMenu} data-navigation="true">SHOP</Link>
            <Link to="/collections" className="text-white" onClick={toggleMenu} data-navigation="true">COLLECTIONS</Link>
            <Link to="/lookbook" className="text-white" onClick={toggleMenu} data-navigation="true">LOOKBOOK</Link>
            <Link to="/about" className="text-white" onClick={toggleMenu} data-navigation="true">ABOUT</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {/* Search Bar */}
            <div className="hidden md:block relative">
              <form onSubmit={handleSearch} className="flex items-center">
                <div className="flex items-center w-64">
                  <SearchInput
                    type="search"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/50 w-full pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 text-white"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>

            {/* Wishlist Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleHeartClick}
              className={cn(
                "text-white transition-colors duration-300",
                isHeartAnimating && "text-red-500"
              )}
              data-navigation="true"
            >
              <Heart className={cn(
                "h-4 w-4 transition-all duration-300",
                isHeartAnimating && "animate-[pulse_1s_ease-in-out] scale-125 fill-red-500"
              )} />
            </Button>

            {/* Cart Icon */}
            <div
              ref={cartIconRef}
              className="relative cursor-pointer cart-icon rounded-md p-2"
              onClick={handleCartClick}
              data-navigation="true"
            >
              <ShoppingBag className="w-5 h-5 text-white" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {cartItems.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </div>

            {/* User Button */}
            <Link to="/auth/login" className="hidden md:block" data-navigation="true">
              <Button
                variant="ghost"
                size="icon"
                className="text-white"
                data-navigation="true"
              >
                <User className="h-4 w-4" />
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="p-1 lg:hidden md:hidden"
              onClick={toggleMenu}
              aria-label="Menu"
            >
              <Menu size={24} className="text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black z-50 lg:hidden md:hidden">
          <div className="blesssed-container h-full flex flex-col">
            <div className="flex justify-between items-center py-5">
              <span className="text-xl md:text-2xl font-bold tracking-tighter text-white">
                Blessed streets
              </span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-white"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex flex-col space-y-8 mt-16 text-2xl font-medium">
              <button
                className="text-white text-left"
                onClick={() => handleNavClick('/shop')}
              >
                SHOP
              </button>
              <button
                className="text-white text-left"
                onClick={() => handleNavClick('/collections')}
              >
                COLLECTIONS
              </button>
              <button
                className="text-white text-left"
                onClick={() => handleNavClick('/lookbook')}
              >
                LOOKBOOK
              </button>
              <button
                className="text-white text-left"
                onClick={() => handleNavClick('/about')}
              >
                ABOUT
              </button>
              <button
                className="text-white text-left"
                onClick={() => handleNavClick('/cart')}
              >
                CART
              </button>
              <button
                className="text-white text-left"
                onClick={() => handleNavClick('/wishlist')}
              >
                WISHLIST
              </button>
              <button
                className="text-white text-left"
                onClick={() => handleNavClick('/auth/login')}
              >
                LOGIN
              </button>
            </nav>

            <div className="mt-auto pb-8 text-sm text-white/50">
              © {new Date().getFullYear()} blessed streets
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;

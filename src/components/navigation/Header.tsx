import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, Heart, User, Search, ChevronDown } from 'lucide-react';
import ReactCountryFlag from "react-country-flag";
import { useTranslation } from 'react-i18next';
import { SearchInput } from '@/components/ui/search-input';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { cartIconAnimation, pageTransition } from '@/lib/transitions';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import '@/i18n/config';
import { useTheme } from '@/components/theme/ThemeProvider';

export const Header = () => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'DE' | 'US'>(
    localStorage.getItem('i18nextLng')?.startsWith('de') ? 'DE' : 'US'
  );
  const [user, setUser] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const cartIconRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { theme } = useTheme();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('first_name, last_name, avatar_url')
          .eq('id', session.user.id)
          .single();
        
        setAvatarUrl(data?.avatar_url || null);
        if (data?.first_name || data?.last_name) {
          setUserName(`${data.first_name || ''} ${data.last_name || ''}`.trim());
        }
      }
    };
    
    getUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);
      
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('first_name, last_name, avatar_url')
          .eq('id', session.user.id)
          .single();
        
        setAvatarUrl(data?.avatar_url || null);
        if (data?.first_name || data?.last_name) {
          setUserName(`${data.first_name || ''} ${data.last_name || ''}`.trim());
        } else {
          setUserName('');
        }
      } else {
        setAvatarUrl(null);
        setUserName('');
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

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
    const handleClickOutside = (event: MouseEvent) => {
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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

  const handleUserClick = () => {
    if (user) {
      pageTransition(() => {
        navigate('/account');
      });
    } else {
      pageTransition(() => {
        navigate('/auth/login');
      });
    }
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 py-4",
          theme === "dark"
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
            <Link to="/shop" className="text-white" data-navigation="true">{t('navigation.shop')}</Link>
            <Link to="/collections" className="text-white" data-navigation="true">{t('navigation.collections')}</Link>
            <Link to="/lookbook" className="text-white" data-navigation="true">{t('navigation.lookbook')}</Link>
            <Link to="/about" className="text-white" data-navigation="true">{t('navigation.about')}</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <ThemeToggle />

            <div className="relative hidden lg:block" ref={languageRef}>
              <Button
                variant="ghost"
                size="icon"
                className="text-white flex items-center gap-2 [&:hover]:bg-transparent"
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              >
                <ReactCountryFlag
                  countryCode={currentLanguage}
                  svg
                  style={{
                    width: '1.5em',
                    height: '1.5em',
                  }}
                  title={currentLanguage}
                />
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isLanguageOpen ? "rotate-180" : ""
                )} />
              </Button>

              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-black/90 backdrop-blur-sm ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    <button
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 text-sm text-white w-full",
                        currentLanguage === 'DE' && "bg-white/5"
                      )}
                      onClick={() => {
                        setCurrentLanguage('DE');
                        i18n.changeLanguage('de');
                        localStorage.setItem('i18nextLng', 'de');
                        setIsLanguageOpen(false);
                      }}
                    >
                      <ReactCountryFlag
                        countryCode="DE"
                        svg
                        style={{
                          width: '1.5em',
                          height: '1.5em',
                        }}
                        title="DE"
                      />
                      Deutsch
                    </button>
                    <button
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 text-sm text-white w-full",
                        currentLanguage === 'US' && "bg-white/5"
                      )}
                      onClick={() => {
                        setCurrentLanguage('US');
                        i18n.changeLanguage('en');
                        localStorage.setItem('i18nextLng', 'en');
                        setIsLanguageOpen(false);
                      }}
                    >
                      <ReactCountryFlag
                        countryCode="US"
                        svg
                        style={{
                          width: '1.5em',
                          height: '1.5em',
                        }}
                        title="US"
                      />
                      English
                    </button>
                  </div>
                </div>
              )}
            </div>

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

            <button
              onClick={handleUserClick}
              className="hidden md:block"
            >
              {user && avatarUrl ? (
                <Avatar className="w-8 h-8 border border-white/20">
                  <AvatarImage src={avatarUrl} alt="User" />
                  <AvatarFallback className="text-xs text-white bg-primary/80">
                    {user.email?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white"
                >
                  <User className="h-4 w-4" />
                </Button>
              )}
            </button>

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
                {t('navigation.shop')}
              </button>
              <button
                className="text-white text-left"
                onClick={() => handleNavClick('/collections')}
              >
                {t('navigation.collections')}
              </button>
              <button
                className="text-white text-left"
                onClick={() => handleNavClick('/lookbook')}
              >
                {t('navigation.lookbook')}
              </button>
              <button
                className="text-white text-left"
                onClick={() => handleNavClick('/about')}
              >
                {t('navigation.about')}
              </button>
              <button
                className="text-white text-left"
                onClick={() => handleNavClick('/cart')}
              >
                {t('navigation.cart')}
              </button>
              <button
                className="text-white text-left"
                onClick={() => handleNavClick('/wishlist')}
              >
                {t('navigation.wishlist')}
              </button>
              <button
                className="text-white text-left"
                onClick={() => handleNavClick(user ? '/account' : '/auth/login')}
              >
                {user ? (userName || t('navigation.account')) : t('navigation.login')}
              </button>
            </nav>

            <div className="mt-auto pb-8 text-sm text-white/50">
              {t('footer.copyright', { year: new Date().getFullYear() })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;

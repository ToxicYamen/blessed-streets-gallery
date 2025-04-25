import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Header } from "@/components/navigation/Header";
import Footer from "@/components/footer/Footer";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { useEffect, useRef, useState } from "react";
import { pageTransition } from "@/lib/transitions";
import { CartProvider } from '@/context/CartContext';
import './i18n/config';

// Pages
import HomePage from "./pages/HomePage";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Collections from "./pages/Collections";
import NotFound from "./pages/NotFound";
import Lookbook from "./pages/Lookbook";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import About from "./pages/About";
import SearchResults from "./pages/SearchResults";

// Auth Pages
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mainRef = useRef<HTMLElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll nach oben bei Routenwechsel
  }, [location.pathname]); // Wird ausgelöst wenn sich die URL ändert

  useEffect(() => {
    const handleNavigation = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[data-navigation="true"]') as HTMLAnchorElement;

      if (link && link.href && !link.href.includes('#') && !isTransitioning) {
        e.preventDefault();
        e.stopPropagation();
        const href = link.getAttribute('href');
        if (href) {
          setIsTransitioning(true);
          try {
            const links = document.querySelectorAll('a[data-navigation="true"]') as NodeListOf<HTMLAnchorElement>;
            links.forEach(link => {
              link.style.pointerEvents = 'none';
            });

            await pageTransition(() => {
              navigate(href);
            });
          } finally {
            const links = document.querySelectorAll('a[data-navigation="true"]') as NodeListOf<HTMLAnchorElement>;
            links.forEach(link => {
              link.style.pointerEvents = 'auto';
            });
            setIsTransitioning(false);
          }
        }
      }
    };

    document.addEventListener('click', handleNavigation, true);
    return () => {
      document.removeEventListener('click', handleNavigation, true);
    };
  }, [navigate, isTransitioning]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main ref={mainRef} className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/lookbook" element={<Lookbook />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="/search" element={<SearchResults />} />

          {/* Auth Routes */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="blesssed-theme">
        <TooltipProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <AppContent />
          </CartProvider>
        </TooltipProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;

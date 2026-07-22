import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Header } from "@/components/navigation/Header";
import Footer from "@/components/footer/Footer";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Suspense, lazy, useEffect, useRef } from "react";
import { pageTransition } from "@/lib/transitions";
import { CartProvider } from '@/context/CartContext';
import { BackgroundGrid } from "@/components/ui/background-grid";
import CookieConsent from "@/components/CookieConsent";
import ComingSoonGate from "@/components/ComingSoonGate";
import './i18n/config';

// The landing page is eager so the first paint never shows a loading fallback.
import HomePage from "./pages/HomePage";

// Every other route is code-split: a 2-hoodie shop should not ship 18 pages of JS
// on the first load. The chunk for the next page is fetched *while the page
// transition overlay covers the screen*, so the split is invisible to the user.
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Collections = lazy(() => import("./pages/Collections"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Lookbook = lazy(() => import("./pages/Lookbook"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Cart = lazy(() => import("./pages/Cart"));
const About = lazy(() => import("./pages/About"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const CheckoutSuccess = lazy(() => import("./pages/CheckoutSuccess"));
const Account = lazy(() => import("./pages/Account"));
const Shipping = lazy(() => import("./pages/Shipping"));
const Returns = lazy(() => import("./pages/Returns"));
const Support = lazy(() => import("./pages/Support"));

// Rechtsseiten (Impressum, Datenschutz, AGB, Widerruf)
import Impressum from "./pages/legal/Impressum";
import Datenschutz from "./pages/legal/Datenschutz";
import AGB from "./pages/legal/AGB";
import Widerruf from "./pages/legal/Widerruf";

// Auth Pages
const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/auth/ResetPassword"));

// react-query v5 defaults are tuned for large, highly dynamic apps and are a bad fit
// for a 2-product catalogue: staleTime 0 + refetchOnMount + refetchOnWindowFocus means
// the products are re-fetched on every page mount and every alt-tab back from the admin
// panel, and each refetch pays a full auth.getSession() round-trip. retry: 3 with
// exponential backoff also means a real error takes ~7s to surface.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60_000,       // catalogue barely changes — 5 min is plenty
      gcTime: 30 * 60_000,
      refetchOnWindowFocus: false, // no refetch storm when tabbing back and forth
      refetchOnMount: false,       // reuse fresh cache across route changes
      retry: 1,                    // surface real failures quickly
    },
  },
});

const RouteFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center" role="status" aria-live="polite">
    <span className="sr-only">Lädt…</span>
    <div className="h-6 w-6 rounded-full border-2 border-current border-t-transparent animate-spin opacity-40" />
  </div>
);

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mainRef = useRef<HTMLElement>(null);
  // A ref, not state: the listener must not be torn down and re-registered on every
  // transition, and re-entrancy must be guarded synchronously inside the handler.
  const isTransitioning = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll nach oben bei Routenwechsel
  }, [location.pathname]); // Wird ausgelöst wenn sich die URL ändert

  useEffect(() => {
    const handleNavigation = (e: MouseEvent) => {
      // Let the browser handle modified clicks (new tab / new window / download).
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const target = e.target as HTMLElement;
      const link = target.closest('a[data-navigation="true"]') as HTMLAnchorElement | null;
      if (!link || !link.href || link.href.includes('#') || link.target === '_blank') return;
      if (isTransitioning.current) return;

      const href = link.getAttribute('href');
      if (!href) return;

      e.preventDefault();
      isTransitioning.current = true;

      // The re-entrancy guard above is what prevents double navigation. We deliberately
      // no longer set `pointer-events: none` on every nav link: if the transition ever
      // failed to settle, that left the entire navigation dead until a hard refresh.
      // pageTransition() navigates while the overlay covers the screen and always
      // settles (its cleanup is in a finally), so the guard is released either way.
      void pageTransition(() => navigate(href)).finally(() => {
        isTransitioning.current = false;
      });
    };

    document.addEventListener('click', handleNavigation, true);
    return () => {
      document.removeEventListener('click', handleNavigation, true);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col relative">
      <BackgroundGrid />
      <div className="relative z-10">
        <Header />
        <main ref={mainRef} className="flex-1">
          <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/new-arrivals" element={<Shop />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/lookbook" element={<Lookbook />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/about" element={<About />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/account" element={<Account />} />
            <Route path="/support" element={<Support />} />
            <Route path="/contact" element={<Support />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/returns" element={<Returns />} />

            {/* Rechtsseiten */}
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/datenschutz" element={<Datenschutz />} />
            <Route path="/agb" element={<AGB />} />
            <Route path="/widerruf" element={<Widerruf />} />

            {/* Auth Routes */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </div>
  );
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="dark" storageKey="blesssed-theme">
          <TooltipProvider>
            <CartProvider>
              <Toaster />
              <Sonner />
              <AppContent />
              {/* Info-Banner zu technisch notwendigen Cookies — global, außerhalb der Routes */}
              <CookieConsent />
              {/* Coming-Soon-Gate: deckt bei VITE_COMING_SOON=true die ganze App ab (z-[100]) */}
              <ComingSoonGate />
            </CartProvider>
          </TooltipProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;

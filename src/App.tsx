
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';

// Pages
import HomePage from './pages/HomePage';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import About from './pages/About';
import Collections from './pages/Collections';
import Lookbook from './pages/Lookbook';
import SearchResults from './pages/SearchResults';
import NotFound from './pages/NotFound';
import CheckoutPage from './pages/CheckoutPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import AuthCallback from './pages/auth/AuthCallback';
import Account from './pages/Account';

// Providers
import { CartProvider } from './context/CartContext';

const App = () => {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/shop" element={<Layout><Shop /></Layout>} />
          <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />
          <Route path="/cart" element={<Layout><Cart /></Layout>} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/wishlist" element={<Layout><Wishlist /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/collections" element={<Layout><Collections /></Layout>} />
          <Route path="/lookbook" element={<Layout><Lookbook /></Layout>} />
          <Route path="/search" element={<Layout><SearchResults /></Layout>} />
          <Route path="/account" element={<Layout><Account /></Layout>} />
          
          {/* Auth Routes */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;

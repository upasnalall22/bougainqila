import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import WhatsAppButton from "@/components/WhatsAppButton";
import { CartProvider } from "@/hooks/useCart";
import { AuthProvider } from "@/hooks/useAuth";
import CartDrawer from "@/components/CartDrawer";
import CookieConsent from "@/components/CookieConsent";
import AdminRoute from "@/components/AdminRoute";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index.tsx";
import ShopAll from "./pages/ShopAll.tsx";
import HomeLiving from "./pages/HomeLiving.tsx";
import GiftShop from "./pages/GiftShop.tsx";
import Journal from "./pages/Journal.tsx";
import JournalPost from "./pages/JournalPost.tsx";
import InstaFeed from "./pages/InstaFeed.tsx";
import OurStory from "./pages/OurStory.tsx";
import Connect from "./pages/Connect.tsx";
import RefundPolicy from "./pages/RefundPolicy.tsx";
import Terms from "./pages/Terms.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import Checkout from "./pages/Checkout.tsx";
import ThankYou from "./pages/ThankYou.tsx";
import Cart from "./pages/Cart.tsx";
import AdminProducts from "./pages/AdminProducts.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import AdminOrders from "./pages/AdminOrders.tsx";
import AdminCustomers from "./pages/AdminCustomers.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import CookiePolicy from "./pages/CookiePolicy.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/shop" element={<ShopAll />} />
                <Route path="/home-living" element={<HomeLiving />} />
                <Route path="/home-living/:category" element={<HomeLiving />} />
                <Route path="/gift-shop" element={<GiftShop />} />
                <Route path="/journal" element={<Journal />} />
                <Route path="/journal/:slug" element={<JournalPost />} />
                <Route path="/insta-feed" element={<InstaFeed />} />
                <Route path="/our-story" element={<OurStory />} />
                <Route path="/connect" element={<Connect />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/thank-you" element={<ThankYou />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
                <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
                <Route path="/admin/customers" element={<AdminRoute><AdminCustomers /></AdminRoute>} />
                <Route path="/admin/content" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <CartDrawer />
              <WhatsAppButton />
              <CookieConsent />
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;

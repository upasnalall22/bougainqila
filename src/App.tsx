import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import WhatsAppButton from "@/components/WhatsAppButton";
import Index from "./pages/Index.tsx";
import ShopAll from "./pages/ShopAll.tsx";
import HomeLiving from "./pages/HomeLiving.tsx";
import GiftShop from "./pages/GiftShop.tsx";
import Journal from "./pages/Journal.tsx";
import InstaFeed from "./pages/InstaFeed.tsx";
import OurStory from "./pages/OurStory.tsx";
import Connect from "./pages/Connect.tsx";
import RefundPolicy from "./pages/RefundPolicy.tsx";
import Terms from "./pages/Terms.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import AdminProducts from "./pages/AdminProducts.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/shop" element={<ShopAll />} />
          <Route path="/home-living" element={<HomeLiving />} />
          <Route path="/home-living/:category" element={<HomeLiving />} />
          <Route path="/gift-shop" element={<GiftShop />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/insta-feed" element={<InstaFeed />} />
          <Route path="/our-story" element={<OurStory />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <WhatsAppButton />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

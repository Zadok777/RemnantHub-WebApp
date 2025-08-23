import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/layout/ThemeProvider";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import Search from "./pages/Search";
import Features from "./pages/Features";
import About from "./pages/About";
import Donate from "./pages/Donate";
import Dashboard from "./pages/Dashboard";
import Community from "./pages/Community";
import Auth from "./pages/Auth";
import PrayerRequests from "./pages/PrayerRequests";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import DataRights from "./pages/DataRights";
import ReportContent from "./pages/ReportContent";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/search" element={<Search />} />
              <Route path="/features" element={<Features />} />
              <Route path="/about" element={<About />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/community/:id" element={<Community />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/signin" element={<Auth />} />
              <Route path="/signup" element={<Auth />} />
              <Route path="/prayers" element={<PrayerRequests />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/cookies" element={<CookiePolicy />} />
              <Route path="/data-rights" element={<DataRights />} />
              <Route path="/report" element={<ReportContent />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Layout>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

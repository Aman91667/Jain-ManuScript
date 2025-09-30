import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PrivateRoute from "@/components/common/PrivateRoute";

import HomePage from "@/pages/HomePage";
import BrowsePage from "@/pages/BrowsePage";
import LoginPage from "@/pages/LoginPage";
import SignupLanding from "@/pages/SignupLanding";
import NormalSignupPage from "@/pages/NormalSignupPage";
import ResearcherSignupPage from "@/pages/ResearcherSignupPage";
import DashboardPage from "@/pages/DashboardPage";
import PendingApproval from "@/pages/PendingApproval";
import ResearcherDashboard from "@/pages/ResearcherDashboard";
import ManuscriptDetailPage from "@/pages/ManuscriptDetailPage";
import AdminDashboard from "@/pages/AdminDashboard";
import UpgradeToResearcher from "@/pages/UpgradeToResearcher"; 
import NotFound from "@/pages/NotFound";
import UploadManuscript from "@/admin/UploadManuscriptPage";
import EditManuscriptPage from "@/admin/EditManuscriptPage";
import HelpForm from "@/components/common/HelpForm";
import ContactUsPage from "@/pages/ContactUsPage"; 
import TermsAndConditionsPage from "@/pages/TermsAndConditionsPage"; 
import LearnJainismPage from "@/pages/LearnJainismPage"; 

import "@/App.css";
import { ThemeProvider } from "next-themes";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/browse" element={<BrowsePage />} />
                  <Route path="/LearnJainismPage" element={<LearnJainismPage />} /> 
                  <Route path="/contact" element={<ContactUsPage />} /> 
                  <Route path="/terms" element={<TermsAndConditionsPage />} /> 
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupLanding />} />
                  <Route path="/signup/user" element={<NormalSignupPage />} />
                  <Route path="/signup/researcher" element={<ResearcherSignupPage />} />

                  {/* Protected Routes */}
                  <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
                  <Route path="/upgrade-to-researcher" element={<PrivateRoute><UpgradeToResearcher /></PrivateRoute>} />
                  <Route path="/researcher/dashboard" element={<PrivateRoute requiredRole="researcher"><ResearcherDashboard /></PrivateRoute>} />
                  <Route path="/manuscript/:id" element={<PrivateRoute requiredRole="researcher"><ManuscriptDetailPage /></PrivateRoute>} />

                  {/* Admin Routes - NO ADMIN VERIFICATION PAGE */}
                  <Route path="/admin/dashboard" element={<PrivateRoute requiredRole="admin"><AdminDashboard /></PrivateRoute>} />
                  <Route path="/admin/upload-manuscript" element={<PrivateRoute requiredRole="admin"><UploadManuscript /></PrivateRoute>} />
                  <Route path="/admin/edit-manuscript/:id" element={<PrivateRoute requiredRole="admin"><EditManuscriptPage /></PrivateRoute>} />

                  {/* Other */}
                  <Route path="/pending-approval" element={<PendingApproval />} />
                  <Route path="/help" element={<HelpForm trigger={<Link to="#" />} />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
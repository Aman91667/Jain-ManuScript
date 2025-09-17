// frontend/src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PrivateRoute from "@/components/common/PrivateRoute";

import HomePage from "./src/pages/HomePage";
import BrowsePage from "./src/pages/BrowsePage";
import LoginPage from "./src/pages/LoginPage";
import SignupLanding from "./src/pages/SignupLanding";
import NormalSignupPage from "./src/pages/NormalSignupPage";
import ResearcherSignupPage from "./src/pages/ResearcherSignupPage";
import DashboardPage from "./src/pages/DashboardPage";
import PendingApproval from "./src/pages/PendingApproval";
import ResearcherDashboard from "./src/pages/ResearcherDashboard";
import ManuscriptDetailPage from "./src/pages/ManuscriptDetailPage";
import AdminVerification from "./src/pages/AdminVerification";
import AdminDashboard from "./src/pages/AdminDashboard";
import UpgradeToResearcher from "./src/pages/UpgradeToResearcher"; 
import NotFound from "./src/pages/NotFound";
import UploadManuscript from "./src/admin/UploadManuscriptPage";
import HelpForm from "./src/components/common/HelpForm";

import "./src/App.css";
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
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupLanding />} />
                  <Route path="/signup/user" element={<NormalSignupPage />} />
                  <Route path="/signup/researcher" element={<ResearcherSignupPage />} />

                  {/* Protected Routes */}
                  <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
                  <Route path="/apply-researcher" element={<PrivateRoute><UpgradeToResearcher /></PrivateRoute>} />
                  <Route path="/researcher/dashboard" element={<PrivateRoute requiredRole="researcher"><ResearcherDashboard /></PrivateRoute>} />
                  <Route path="/manuscript/:id" element={<PrivateRoute requiredRole="researcher"><ManuscriptDetailPage /></PrivateRoute>} />

                  {/* Admin Routes */}
                  <Route path="/admin" element={<PrivateRoute requiredRole="admin"><AdminVerification /></PrivateRoute>} />
                  <Route path="/admin/dashboard" element={<PrivateRoute requiredRole="admin"><AdminDashboard /></PrivateRoute>} />
                  <Route path="/admin/upload-manuscript" element={<PrivateRoute requiredRole="admin"><UploadManuscript /></PrivateRoute>} />

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

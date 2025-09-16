// frontend/src/App.tsx
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import AdminVerification from "@/pages/AdminVerification";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/NotFound";
import ResearcherApplicationForm from "@/pages/ResearcherApplicationForm";
import { ThemeProvider } from "next-themes";
import "@/App.css";
import UploadManuscriptPage from "@/pages/UploadManuscriptPage";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Sonner />
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/browse" element={<BrowsePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupLanding />} />
                  <Route path="/signup/user" element={<NormalSignupPage />} />
                  <Route path="/signup/researcher" element={<ResearcherSignupPage />} />
                  <Route path="/upload" element={<UploadManuscriptPage />} />
                  
                  <Route
                    path="/dashboard"
                    element={
                      <PrivateRoute>
                        <DashboardPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/apply-researcher"
                    element={
                      <PrivateRoute>
                        <ResearcherApplicationForm />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/researcher/dashboard"
                    element={
                      <PrivateRoute requiredRole="researcher">
                        <ResearcherDashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/manuscript/:id"
                    element={
                      <PrivateRoute requiredRole="researcher">
                        <ManuscriptDetailPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <PrivateRoute requiredRole="admin">
                        <AdminVerification />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/admin/dashboard"
                    element={
                      <PrivateRoute requiredRole="admin">
                        <AdminDashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route path="/pending-approval" element={<PendingApproval />} />
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

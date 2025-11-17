import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import SkinScannerPage from "./pages/SkinScannerPage";
import EyeScannerPage from "./pages/EyeScannerPage";
import ResultPage from "./pages/ResultPage";
import AppointmentPage from "./pages/AppointmentPage";
import ClinicMapPage from "./pages/ClinicMapPage";
import HealthChatbotPage from "./pages/HealthChatbotPage";
import ProfilePage from "./pages/ProfilePage";
import ScanHistoryPage from "./pages/ScanHistoryPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <Router future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/scan/skin" element={<ProtectedRoute><SkinScannerPage /></ProtectedRoute>} />
              <Route path="/scan/eye" element={<ProtectedRoute><EyeScannerPage /></ProtectedRoute>} />
              <Route path="/result" element={<ProtectedRoute><ResultPage /></ProtectedRoute>} />
              <Route path="/appointments" element={<ProtectedRoute><AppointmentPage /></ProtectedRoute>} />
              <Route path="/clinics" element={<ProtectedRoute><ClinicMapPage /></ProtectedRoute>} />
              <Route path="/chat" element={<ProtectedRoute><HealthChatbotPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute><ScanHistoryPage /></ProtectedRoute>} />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Index from "./pages/Index";
import ApiDocs from "./pages/ApiDocs";
import Analytics from "./pages/Analytics";
import InputLeave from "./pages/InputLeave";
import AutomationLogs from "./pages/AutomationLogs";
import Calendar from "./pages/Calendar";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { authService } from "@/services/authService";

const queryClient = new QueryClient();

// Auth guard component
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          // Verify token by getting current user
          await authService.getCurrentUser();
          setIsAuthenticated(true);
        }
      } catch (error) {
        // If token is invalid, clear auth state
        authService.logout();
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // You can replace this with a proper loading component
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Toaster />
          <Sonner />
          <div className="flex min-h-screen bg-gray-50">
            <Routes>
              <Route path="/login" element={<Login />} />

              {/* Protected routes */}
              <Route
                path="/"
                element={
                  <RequireAuth>
                    <Index />
                  </RequireAuth>
                }
              />
              <Route
                path="/analytics"
                element={
                  <RequireAuth>
                    <Analytics />
                  </RequireAuth>
                }
              />
              <Route
                path="/input-leave"
                element={
                  <RequireAuth>
                    <InputLeave />
                  </RequireAuth>
                }
              />
              <Route
                path="/automation-logs"
                element={
                  <RequireAuth>
                    <AutomationLogs />
                  </RequireAuth>
                }
              />
              <Route
                path="/api-docs"
                element={
                  <RequireAuth>
                    <ApiDocs />
                  </RequireAuth>
                }
              />
              <Route
                path="/calendar"
                element={
                  <RequireAuth>
                    <Calendar />
                  </RequireAuth>
                }
              />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;

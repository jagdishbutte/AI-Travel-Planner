import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { LoginForm } from "./components/auth/LoginForm";
import { RegistrationForm } from "./components/registration/RegistrationForm";
import { PreferencesSlider } from "./components/onboarding/PreferencesSlider";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import { useAuthStore } from "./store/authStore";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  const { user, isLoading, hasCompletedOnboarding } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-900">
          {!user && <Navbar />}
          <main>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Hero />} />
              <Route
                path="/login"
                element={
                  user ? <Navigate to="/dashboard" replace /> : <LoginForm />
                }
              />
              <Route
                path="/register"
                element={
                  user ? (
                    <Navigate to="/preferences" replace />
                  ) : (
                    <RegistrationForm />
                  )
                }
              />
              <Route
                path="/preferences"
                element={
                  !user ? (
                    <Navigate to="/login" replace />
                  ) : hasCompletedOnboarding ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <PreferencesSlider />
                  )
                }
              />

              {/* Protected routes */}
              <Route
                path="/dashboard/*"
                element={
                  !user ? <Navigate to="/login" replace /> : <DashboardLayout />
                }
              />

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

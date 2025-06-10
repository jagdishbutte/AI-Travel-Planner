import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { LoadingSpinner } from "./components/common/LoadingSpinner";
import { useAuthStore } from "./store/authStore";
import { ThemeProvider } from "./context/ThemeContext";
import { SearchProvider } from "./context/SearchContext";
import { Destinations } from "./components/explore/Destinations";
import { PopularTrips } from "./components/explore/PopularTrips";
import { TravelGuides } from "./components/explore/TravelGuides";
import CreateTrip from "./components/dashboard/CreateTrip";
import { Trips } from "./components/travel/Trips";
import { Calendar } from "./components/travel/Calendar";
import PrivateRoute from "./components/auth/PrivateRoute";
import ViewTrip from "./components/dashboard/ViewTrip";
import AdminRoute from "./components/auth/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";
import UserList from "./components/admin/UserList";
import UserDetail from "./components/admin/UserDetail";
import AdminViewTrip from "./components/admin/AdminViewTrip";

// Lazy load components
const LoginForm = React.lazy(() => import("./components/auth/LoginForm"));
const RegistrationForm = React.lazy(
  () => import("./components/registration/RegistrationForm")
);
const PreferencesSlider = React.lazy(() =>
  import("./components/onboarding/PreferencesSlider").then((module) => ({
    default: module.default,
  }))
);
const Dashboard = React.lazy(
  () => import("./components/dashboard/DashboardLayout")
);

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
      <SearchProvider>
        <Router>
          <div className="min-h-screen bg-gray-900">
            <Navbar />
            <main>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Hero />} />
                  <Route
                    path="/login"
                    element={
                      user ? (
                        <Navigate to="/dashboard" replace />
                      ) : (
                        <LoginForm />
                      )
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

                  {/* Public dashboard */}
                  <Route path="/dashboard" element={<Dashboard />}>
                    <Route
                      path="explore/destinations"
                      element={<Destinations />}
                    />
                    <Route
                      path="explore/popular-trips"
                      element={<PopularTrips />}
                    />
                    <Route
                      path="explore/travel-guides"
                      element={<TravelGuides />}
                    />
                    <Route path="trips/*" element={<ViewTrip />} />
                  </Route>

                  {/* Protected dashboard routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <PrivateRoute user={user}>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  >
                    <Route path="create-trip" element={<CreateTrip />} />
                    <Route path="trips" element={<Trips />} />
                    <Route path="calendar" element={<Calendar />} />
                    <Route path="profile" />
                    <Route path="history" />
                    <Route path="settings" />
                    <Route path="help" />
                  </Route>

                  {/* Admin routes */}
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminLayout />
                      </AdminRoute>
                    }
                  >
                    <Route path="users" element={<UserList />} />
                    <Route path="users/:userId" element={<UserDetail />} />
                    <Route path="trips/:tripId" element={<AdminViewTrip />} />
                  </Route>

                  {/* Fallback route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </main>
          </div>
        </Router>
      </SearchProvider>
    </ThemeProvider>
  );
}

export default App;

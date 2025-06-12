import { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { DashboardNavbar } from "./DashboardNavbar";
import { Overview } from "./Overview";
import { Explore } from "./Explore";
import { Trips } from "../travel/Trips";
import { Settings } from "../profile/Settings";
import { CreateTrip } from "./CreateTrip";
import ViewTrip from "./ViewTrip";
import { TripBudget } from "./TripBudget";
import { ThemeContext } from "../../context/ThemeContext";
import { Destinations } from "../explore/Destinations";
import { PopularTrips } from "../explore/PopularTrips";
import { TravelGuides } from "../explore/TravelGuides";
import { Footer } from "../../components/Footer";
import { Calendar } from "../travel/Calendar";
import UserProfile from "../profile/UserProfile";

export const DashboardLayout = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-white"
      } flex flex-col`}
    >
      <DashboardNavbar />
      <main
        className={`flex-1 pt-16 ${
          theme === "dark" ? "text-white" : "text-black"
        }`}
      >
        <Routes>
          <Route index element={<Overview />} />
          <Route path="explore">
            <Route index element={<Explore />} />
            <Route path="destinations" element={<Destinations />} />
            <Route path="popular-trips" element={<PopularTrips />} />
            <Route path="travel-guides" element={<TravelGuides />} />
          </Route>
          <Route path="trips" element={<Trips />} />
          <Route path="create-trip" element={<CreateTrip />} />
          <Route path="trips/:tripId" element={<ViewTrip />} />
          <Route path="trips/:tripId/budget" element={<TripBudget />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="history" element={<Trips />} />
          <Route path="settings" element={<Settings />} />
          <Route path="help" element={<TravelGuides />} />
          <Route path="profile" element={<UserProfile />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardLayout;

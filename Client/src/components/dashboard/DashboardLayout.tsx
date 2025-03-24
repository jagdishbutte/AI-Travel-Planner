import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { DashboardNavbar } from "./DashboardNavbar";
import { Overview } from "./Overview";
import { Explore } from "./Explore";
import { Trips } from "./Trips";
import { Settings } from "./Settings";
import { CreateTrip } from "./CreateTrip";
import ViewTrip from "./ViewTrip";
import { TripBudget } from "./TripBudget";
import { ThemeContext } from "../../context/ThemeContext";

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
          <Route path="explore" element={<Explore />} />
          <Route path="trips" element={<Trips />} />
          <Route path="settings" element={<Settings />} />
          <Route path="create-trip" element={<CreateTrip />} />
          <Route path="trips/:tripId" element={<ViewTrip />} />
          <Route path="trips/:tripId/budget" element={<TripBudget />} />
        </Routes>
      </main>
    </div>
  );
};

export default DashboardLayout;

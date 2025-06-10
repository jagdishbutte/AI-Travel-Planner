import React from "react";
import { Trip } from "../../types";
import { MapPin, Users, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";

interface AdminTripCardProps {
  trip: Trip;
}

const AdminTripCard: React.FC<AdminTripCardProps> = ({ trip }) => {
  return (
    <Link to={`/admin/trips/${trip._id || trip.id}`}>
      <div className="relative h-64 rounded-xl overflow-hidden mb-8 bg-gray-800 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${trip.image})`,
          }}
        >
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-xs" />
        </div>
        <div className="relative h-full flex flex-col justify-end p-6">
          <h2 className="text-2xl font-bold mb-2">{trip.title}</h2>
          <div className="flex items-center space-x-4 text-md mb-2">
            <span className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {trip.destination}
            </span>
          </div>
          <div className="flex items-center space-x-4 text-md">
            <span className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {trip.travelers} Travelers
            </span>
            <span className="flex items-center">
              <CalendarDays className="h-4 w-4 mr-1" />
              {trip.itinerary?.length || 0} days
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AdminTripCard;

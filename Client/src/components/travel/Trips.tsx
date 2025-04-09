import { useNavigate } from "react-router-dom";
import { useTripStore } from "../../store/tripStore";
import { motion } from "framer-motion";
import { Trip } from "../../types";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Users,
  Wallet,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { tripsAPI } from "../../lib/apis";

interface TripCardProps {
  trip: Trip;
  showBookNow?: boolean;
  onDelete: (tripId: string) => void;
}

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Delete Trip</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete this trip? This action cannot be
          undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

const TripCard = ({ trip, showBookNow = false, onDelete }: TripCardProps) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const {fetchTrips}=useTripStore();

  const getBudgetDisplay = () => {
      const budget =
          typeof trip.budget === "string"
              ? JSON.parse(trip.budget)
              : trip.budget;

      const amount = budget.amount;
      const isPerPerson = trip.budget.type === "per_person";
      const isPerDay = trip.budget.duration === "per_day";

      return `₹${amount} ${isPerPerson ? "per person" : "total"}${
          isPerDay ? " per day" : ""
      }`;
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await tripsAPI.deleteTrip(trip._id || trip.id);

      if (response.data.success) {
        toast.success(response.data.message || "Trip deleted successfully");
        onDelete(trip._id as string);
        fetchTrips();
        // deleteTrip(trip._id as string);
        setShowDeleteModal(false);

      } else {
        throw new Error(response.data.message || "Failed to delete trip");
      }
    } catch (error: any) {
      console.error("Error deleting trip:", error);
      toast.error(error.message || "Failed to delete trip. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden relative group"
      >
        <div className="aspect-w-16 aspect-h-9 relative">
          <img
            src={
              trip.image ||
              `https://source.unsplash.com/800x600/?${encodeURIComponent(
                trip.destination
              )}`
            }
            alt={trip.destination}
            className="object-cover w-full h-48"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-white mb-3">
            {trip.destination}
          </h3>
          <div className="space-y-2 text-gray-300 text-sm mb-4">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              <span>{trip.travelers} travelers</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>
                {new Date(trip.startDate).toLocaleDateString()} -{" "}
                {new Date(trip.endDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center">
              <Wallet className="h-4 w-4 mr-2" />
              <span>{getBudgetDisplay()}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={() =>
                navigate(`/dashboard/trips/${trip._id || trip.id}`)
              }
              className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center"
            >
              View Itinerary
              <ArrowRight className="h-4 w-4 ml-1" />
            </button>
            <div className="flex items-center space-x-3">
              {showBookNow && (
                <button
                  onClick={() =>
                    navigate(`/dashboard/book/${trip._id || trip.id}`)
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Book Now
                </button>
              )}
              <button
                onClick={() => setShowDeleteModal(true)}
                className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                title="Delete trip"
              >
                <Trash2 className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export const Trips = () => {
  const { trips, deleteTrip } = useTripStore();
  const navigate = useNavigate();

  const handleDeleteTrip = (tripId: string) => {
    deleteTrip(tripId);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto mt-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(`/dashboard`)}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </button>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
          {/* Your Trips Section */}
          <section>
            {trips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trips.map((trip) => (
                  <TripCard
                    key={trip._id}
                    trip={trip}
                    onDelete={handleDeleteTrip}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">You don't have any trips yet.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

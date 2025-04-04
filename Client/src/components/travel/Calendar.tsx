import { useNavigate } from "react-router-dom";
import { useTripStore } from "../../store/tripStore";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
} from "date-fns";

export const Calendar = () => {
  const navigate = useNavigate();
  const { trips } = useTripStore();
  const [currentDate, setCurrentDate] = useState(new Date());

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getTripsForDate = (date: Date) => {
    return trips.filter((trip) => {
      const startDate = new Date(trip.startDate);
      const endDate = new Date(trip.endDate);
      return date >= startDate && date <= endDate;
    });
  };

  return (
    <div className="max-w-7xl mx-auto mt-6 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(`/dashboard`)}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span className="text-sm sm:text-base">Back to Home</span>
        </button>
      </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 sm:p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-white">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevMonth}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextMonth}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </motion.button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {/* Week days header */}
          {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
            <div
              key={day}
              className="text-center text-gray-400 font-medium py-1 sm:py-2 text-xs sm:text-sm"
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {daysInMonth.map((date) => {
            const dayTrips = getTripsForDate(date);
            const isToday = isSameDay(date, new Date());
            const isCurrentMonth = isSameMonth(date, currentDate);

            return (
              <motion.div
                key={date.toString()}
                whileHover={{ scale: 1.02 }}
                className={`
                  p-1 sm:p-2 rounded-lg border border-gray-700
                  ${isCurrentMonth ? "bg-gray-800/30" : "bg-gray-800/10"}
                  ${isToday ? "ring-2 ring-blue-500" : ""}
                  min-h-[60px] sm:min-h-[100px]
                  touch-manipulation
                `}
              >
                <div className="text-right mb-1">
                  <span
                    className={`text-xs sm:text-sm ${
                      isCurrentMonth ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {format(date, "d")}
                  </span>
                </div>
                <div className="space-y-1 overflow-y-auto max-h-[40px] sm:max-h-[70px] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                  {dayTrips.map((trip) => (
                    <div
                      key={trip.id}
                      onClick={() => navigate(`/dashboard/trips/${trip.id}`)}
                      className="text-[10px] sm:text-xs bg-blue-500/20 text-blue-300 p-1 rounded cursor-pointer 
                        hover:bg-blue-500/30 transition-colors truncate active:bg-blue-500/40 touch-manipulation"
                    >
                      {trip.destination}
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

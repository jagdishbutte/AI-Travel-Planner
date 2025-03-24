export const TripCard = ({ trip }) => {
  return (
    <div className="card">
      <img
        src={trip.image}
        alt={trip.title}
        loading="lazy"
        className="w-full h-48 object-cover rounded-t-lg"
      />
      {/* ... rest of the card content ... */}
    </div>
  );
};

import { Search } from "lucide-react";

export const Explore = () => {
  const destinations = [
    {
      city: "Paris",
      country: "France",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
      description:
        "The City of Light awaits with its iconic architecture and culture",
    },
    {
      city: "Tokyo",
      country: "Japan",
      image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26",
      description: "Experience the perfect blend of tradition and modernity",
    },
    {
      city: "Santorini",
      country: "Greece",
      image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e",
      description: "Stunning sunsets and pristine white architecture",
    },
    {
      city: "New York",
      country: "United States",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9",
      description: "The city that never sleeps has something for everyone",
    },
    {
      city: "Dubai",
      country: "UAE",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
      description: "Experience luxury and futuristic architecture",
    },
    {
      city: "Bali",
      country: "Indonesia",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
      description: "Paradise islands with rich culture and natural beauty",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-white">
          Explore Destinations
        </h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search destinations..."
            className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((destination, index) => (
          <div
            key={index}
            className="group bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden hover:bg-gray-800 transition-all cursor-pointer"
          >
            <div className="relative aspect-w-16 aspect-h-9">
              <img
                src={destination.image}
                alt={`${destination.city}, ${destination.country}`}
                className="object-cover w-full h-48 group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-1">
                {destination.city}
              </h3>
              <p className="text-gray-400 text-sm mb-3">
                {destination.country}
              </p>
              <p className="text-gray-300 text-sm">{destination.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

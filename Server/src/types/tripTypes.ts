export interface Hotel {
  hotelName: string;
  hotelAddress: string;
  price: string;
  hotelImageUrl: string;
  geoCoordinates: { lat: number; lng: number };
  rating: number;
  description: string;
}

export interface Place {
  placeName: string;
  placeDetails: string;
  placeImageUrl: string;
  geoCoordinates: { lat: number; lng: number };
  ticketPricing: string;
  bestTimeToVisit: string;
}

export interface Itinerary {
  day: number;
  places: Place[];
}

export interface TripPlan {
  hotels: Hotel[];
  itinerary: Itinerary[];
}

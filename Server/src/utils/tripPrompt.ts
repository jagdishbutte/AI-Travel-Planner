export const generateTripPrompt = (
  location: string,
  days: number,
  travelers: number,
  budget: string
): string => {
  return `Generate Travel Plan for Location: ${location} (image aspect ratio 16:9), for ${days} Days for ${travelers} travelers with a ${budget} budget. 
  Give me 4 hotel options with hotel name, address, price, image URL (aspect ratio 1:1), geo-coordinates, rating, and description. Also, suggest an itinerary with places including name, details, image URL (aspect ratio 1:1), geo-coordinates, ticket pricing, and best time to visit. 
  Provide the response strictly in valid JSON format.`;
};

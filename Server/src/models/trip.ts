import mongoose, { Schema, Document } from "mongoose";

export interface ITrip extends Document {
  user: mongoose.Schema.Types.ObjectId;
  destination: string;
  days: number;
  travelers: number;
  budget: string;
  preferences: Record<string, any>;
  itinerary: {
    summary: string;
    daily_itinerary: Array<{
      day: number;
      activities: string[];
    }>;
    accommodation: string[];
    transportation: string[];
    food_recommendations: string[];
    budget_breakdown: Record<string, number>;
  };
  createdAt: Date;
  updatedAt: Date;
}

const TripSchema: Schema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        destination: {
            type: String,
            required: true,
        },

        days: {
            type: Number,
            required: true,
        },

        travelers: {
            type: Number,
            required: true,
        },

        budget: {
            type: Object,
            required: true,
        },

        preferences: {
            type: Object,
            default: {},
        },

        itinerary: [
            {
                date: {
                    type: String,
                    required: true,
                },
                events: [
                    {
                        time: {
                            type: String,
                            required: true,
                        },
                        title: {
                            type: String,
                            required: true,
                        },
                        description: {
                            type: String,
                            required: true,
                        },
                        type: {
                            type: String,
                            enum: [
                                "activity",
                                "transport",
                                "food",
                                "accommodation",
                            ],
                            required: true,
                        },
                        location: {
                            name: {
                                type: String,
                                required: false,
                            },
                            coordinates: {
                                type: [Number], // [longitude, latitude]
                                required: false,
                            },
                            address: {
                                type: String,
                                required: false,
                            },
                        },
                        cost: {
                            type: Number,
                            required: false,
                        },
                        duration: {
                            type: String,
                            required: false,
                        },
                        bookingRequired: {
                            type: Boolean,
                            required: false,
                        },
                        bookingUrl: {
                            type: String,
                            required: false,
                        },
                    },
                ],
                weather: {
                    condition: {
                        type: String,
                        enum: ["sunny", "cloudy", "rainy", "snowy", "windy"],
                        required: true,
                    },
                    temperature: {
                        type: Number,
                        required: true,
                    },
                    humidity: {
                        type: Number,
                        required: false,
                    },
                    precipitation: {
                        type: Number,
                        required: false,
                    },
                },
            },
        ],

        transportationType: {
            type: String,
            enum: ["flight", "train", "bus"],
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["planned", "ongoing", "completed"],
            default: "planned",
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        activities: [
            {
                type: String,
                required: true,
            },
        ],
        accommodation: [
            {
                name: {
                    type: String,
                    required: true,
                },
                image: {
                    type: String,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
                rating: {
                    type: Number,
                    required: true,
                },
                description: {
                    type: String,
                    required: true,
                },
                amenities: [
                    {
                        type: String,
                        required: false,
                    },
                ],
                location: {
                    name: {
                        type: String,
                        required: false,
                    },
                    coordinates: {
                        type: [Number], // [latitude, longitude]
                        required: false,
                    },
                    address: {
                        type: String,
                        required: false,
                    },
                },
                roomTypes: [
                    {
                        type: {
                            type: String,
                            required: true,
                        },
                        price: {
                            type: Number,
                            required: true,
                        },
                        capacity: {
                            type: Number,
                            required: true,
                        },
                        available: {
                            type: Boolean,
                            required: true,
                        },
                    },
                ],
                contactInfo: {
                    phone: {
                        type: String,
                        required: false,
                    },
                    email: {
                        type: String,
                        required: false,
                    },
                    website: {
                        type: String,
                        required: false,
                    },
                },
                bookingRequired: {
                    type: Boolean,
                    default: false,
                },
                bookingUrl: {
                    type: String,
                    required: false,
                },
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model<ITrip>("Trip", TripSchema);

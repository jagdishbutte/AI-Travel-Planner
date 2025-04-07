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

        itinerary: {
            summary: {
                type: String,
                required: true,
            },

            daily_itinerary: [
                {
                    day: {
                        type: Number,
                        required: true,
                    },
                    activities: [
                        {
                            type: String,
                            required: true,
                        },
                    ],
                },
            ],

            accommodation: [
                {
                    type: String,
                    required: true,
                },
            ],

            transportation: [
                {
                    type: String,
                    required: true,
                },
            ],

            food_recommendations: [
                {
                    type: String,
                    required: true,
                },
            ],

            budget_breakdown: {
                type: Object,
                required: true,
            },
        },
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
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model<ITrip>("Trip", TripSchema);

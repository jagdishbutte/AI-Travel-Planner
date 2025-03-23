import mongoose, { Schema, Document } from "mongoose";

export interface ITrip extends Document {
  user: mongoose.Schema.Types.ObjectId;
  location: string;
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

    location: {
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
      type: String,
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
  },
  { timestamps: true }
);

export default mongoose.model<ITrip>("Trip", TripSchema);

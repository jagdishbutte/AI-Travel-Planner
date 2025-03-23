import mongoose from "mongoose";

const preferencesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  travelStyle: [String],
  destinations: [String],
  accommodation: [String],
  transportation: [String],
  activities: [String],
  budget: [String],
  tripLength: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Preferences = mongoose.model("Preferences", preferencesSchema);
export default Preferences;

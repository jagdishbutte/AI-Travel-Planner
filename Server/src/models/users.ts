import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
      // unique: true,
      // trim: true,
    },
    location: {
      type: String,
      required: true,
    },
    nationality: {
      type: String,
      required: true,
    },
    occupation: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    // emergencyContact: {
    //   type: String,
    //   required: true,
    // },
    passportNumber: {
      type: String,
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    preferences: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Preferences",
    },
  },
  { timestamps: true }
);

// userSchema.index({ mobile: 1 }, { unique: true, sparse: true });

const User = mongoose.model("User", userSchema);
export default User;

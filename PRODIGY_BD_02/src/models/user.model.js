import mongoose from "mongoose";

const uerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      lowercase: true,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    age: {
      type: Number,
      require: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", uerSchema);

export default User;

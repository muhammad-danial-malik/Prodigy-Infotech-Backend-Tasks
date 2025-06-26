import mongoose from "mongoose";

const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    age: {
      type: Number,
      require: true,
    },
  },
  { timestamps: true }
);

const ModelName = mongoose.model("ModelName", Schema);

export default ModelName;

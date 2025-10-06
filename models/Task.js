import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    roommate: {
      type: String,
      required: true,
      trim: true,
    },
    task: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true } // ✅ Automatically adds createdAt & updatedAt
);

export default mongoose.model("Task", taskSchema);

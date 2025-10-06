import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Load .env

const app = express();

// ✅ Proper CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000", // local testing
      "https://tea-tracker-frontend.onrender.com", // your live frontend
    ],
    credentials: true,
  })
);

app.use(express.json());

// Use the MONGO_URI from .env
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) =>
    console.error("❌ MongoDB Connection Error:", err.message)
  );

// Task schema
const taskSchema = new mongoose.Schema(
  {
    roommate: { type: String, required: true },
    task: { type: String, required: true },
  },
  { timestamps: true } // creates createdAt and updatedAt
);

const Task = mongoose.model("Task", taskSchema);

// Routes
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/tasks", async (req, res) => {
  try {
    const { roommate, task } = req.body;
    if (!roommate || !task) {
      return res.status(400).json({ error: "Missing fields" });
    }
    const newTask = new Task({ roommate, task });
    await newTask.save();
    res.json(newTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

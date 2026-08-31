import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import authMiddleware from "./middleware/auth.middleware.js";
import channelRoutes from "./routes/channel.routes.js";
import videoRoutes from "./routes/video.routes.js";
import commentRoutes from "./routes/comment.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);

app.get("/api/protected", authMiddleware, (req, res) => {
    res.json({
        message: "You are authenticated",
        userId: req.userId
    });
});

app.get("/", (req, res) => {
    res.json({
        message: "YouTube Clone Backend is running"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
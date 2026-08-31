import express from "express";

import {
    createVideo,
    getVideos,
    getVideo,
    updateVideo,
    deleteVideo,
    likeVideo,
    dislikeVideo
} from "../controllers/video.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createVideo);

router.get("/", getVideos);

router.get("/:id", getVideo);

router.put("/:id", authMiddleware, updateVideo);

router.delete("/:id", authMiddleware, deleteVideo);

router.put("/:id/like", authMiddleware, likeVideo);

router.put("/:id/dislike", authMiddleware, dislikeVideo);

export default router;
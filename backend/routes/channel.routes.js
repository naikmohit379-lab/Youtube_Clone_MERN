import express from "express";

import {
    createChannel,
    getChannel,
    subscribeChannel
} from "../controllers/channel.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    createChannel
);

router.get(
    "/:id",
    getChannel
);

router.put(
    "/:id/subscribe",
    subscribeChannel
);

export default router;
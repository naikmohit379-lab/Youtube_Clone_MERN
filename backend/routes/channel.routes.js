import express from "express";

import {
    createChannel,
    getChannel,
    subscribeChannel,
    getMyChannel
} from "../controllers/channel.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    createChannel
);

router.get(
    "/mine",
    authMiddleware,
    getMyChannel
);

router.get(
    "/:id",
    getChannel
);

router.put(
    "/:id/subscribe",
    authMiddleware,
    subscribeChannel
);

export default router;
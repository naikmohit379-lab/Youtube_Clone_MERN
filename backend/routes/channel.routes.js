import express from "express";

import {
    createChannel,
    getChannel,
    getMyChannel,
    subscribeChannel
} from "../controllers/channel.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();


// CREATE CHANNEL
router.post(
    "/",
    authMiddleware,
    createChannel
);


// GET MY CHANNEL
// IMPORTANT: This must come BEFORE /:id
router.get(
    "/mine",
    authMiddleware,
    getMyChannel
);


// GET CHANNEL BY ID
router.get(
    "/:id",
    getChannel
);


// SUBSCRIBE TO CHANNEL
router.put(
    "/:id/subscribe",
    authMiddleware,
    subscribeChannel
);


export default router;
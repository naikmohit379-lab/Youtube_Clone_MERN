import Channel from "../models/channel.model.js";
import User from "../models/user.model.js";

export const createChannel = async (req, res) => {
    try {
        const { channelName, description, channelBanner } = req.body;

        if (!channelName) {
            return res.status(400).json({
                message: "Channel name is required"
            });
        }

        const existingChannel = await Channel.findOne({
            channelName
        });

        if (existingChannel) {
            return res.status(400).json({
                message: "Channel name already exists"
            });
        }

        const channel = await Channel.create({
            channelName,
            description,
            channelBanner,
            owner: req.userId
        });

        await User.findByIdAndUpdate(
            req.userId,
            {
                $push: {
                    channels: channel._id
                }
            }
        );

        res.status(201).json({
            message: "Channel created successfully",
            channel
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create channel",
            error: error.message
        });
    }
};


export const getChannel = async (req, res) => {
    try {
        const channel = await Channel.findById(req.params.id)
            .populate("owner", "username email");

        if (!channel) {
            return res.status(404).json({
                message: "Channel not found"
            });
        }

        res.status(200).json(channel);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch channel",
            error: error.message
        });
    }
};
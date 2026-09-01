import Video from "../models/video.model.js";
import Channel from "../models/channel.model.js";

export const createVideo = async (req, res) => {
    try {
        const {
            title,
            thumbnailUrl,
            videoUrl,
            description,
            channel,
            category
        } = req.body;

        if (
            !title ||
            !thumbnailUrl ||
            !videoUrl ||
            !channel ||
            !category
        ) {
            return res.status(400).json({
                message: "Required fields are missing"
            });
        }

        const channelData = await Channel.findById(channel);

        if (!channelData) {
            return res.status(404).json({
                message: "Channel not found"
            });
        }

        if (channelData.owner.toString() !== req.userId.toString()) {
            return res.status(403).json({
                message: "You can only upload videos to your own channel"
            });
        }

        const video = await Video.create({
            title,
            thumbnailUrl,
            videoUrl,
            description,
            channel,
            category,
            uploader: req.userId
        });

        res.status(201).json({
            message: "Video created successfully",
            video
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create video",
            error: error.message
        });
    }
};


export const getVideos = async (req, res) => {
    try {
        const videos = await Video.find()
            .populate("channel", "channelName")
            .populate("uploader", "username");

        res.status(200).json(videos);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch videos",
            error: error.message
        });
    }
};


export const getVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id)
            .populate("channel", "channelName")
            .populate("uploader", "username");

        if (!video) {
            return res.status(404).json({
                message: "Video not found"
            });
        }

        res.status(200).json(video);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch video",
            error: error.message
        });
    }
};


export const updateVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);

        if (!video) {
            return res.status(404).json({
                message: "Video not found"
            });
        }

        if (video.uploader.toString() !== req.userId.toString()) {
            return res.status(403).json({
                message: "You can only update your own videos"
            });
        }

        const {
            title,
            thumbnailUrl,
            videoUrl,
            description,
            category
        } = req.body;

        video.title = title ?? video.title;
        video.thumbnailUrl = thumbnailUrl ?? video.thumbnailUrl;
        video.videoUrl = videoUrl ?? video.videoUrl;
        video.description = description ?? video.description;
        video.category = category ?? video.category;

        await video.save();

        res.status(200).json({
            message: "Video updated successfully",
            video
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update video",
            error: error.message
        });
    }
};


export const deleteVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);

        if (!video) {
            return res.status(404).json({
                message: "Video not found"
            });
        }

        if (video.uploader.toString() !== req.userId.toString()) {
            return res.status(403).json({
                message: "You can only delete your own videos"
            });
        }

        await Video.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Video deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete video",
            error: error.message
        });
    }
};

export const likeVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);

        if (!video) {
            return res.status(404).json({
                message: "Video not found"
            });
        }

        video.likes += 1;

        await video.save();

        res.status(200).json({
            message: "Video liked successfully",
            likes: video.likes,
            dislikes: video.dislikes
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to like video",
            error: error.message
        });
    }
};


export const dislikeVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);

        if (!video) {
            return res.status(404).json({
                message: "Video not found"
            });
        }

        video.dislikes += 1;

        await video.save();

        res.status(200).json({
            message: "Video disliked successfully",
            likes: video.likes,
            dislikes: video.dislikes
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to dislike video",
            error: error.message
        });
    }
};
export const viewVideo = async (req, res) => {
    try {
        const video = await Video.findByIdAndUpdate(
            req.params.id,
            {
                $inc: { views: 1 }
            },
            {
                new: true
            }
        );

        if (!video) {
            return res.status(404).json({
                message: "Video not found"
            });
        }

        console.log("VIEW UPDATED:", video.views);

        res.status(200).json({
            message: "Video view counted successfully",
            views: video.views
        });

    } catch (error) {
        console.log("VIEW ERROR:", error);

        res.status(500).json({
            message: "Failed to count video view",
            error: error.message
        });
    }
};
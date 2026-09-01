import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api.js";
import VideoCard from "../components/VideoCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function Channel() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { isLoggedIn } = useAuth();

    const [channel, setChannel] = useState(null);
    const [videos, setVideos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [subscribed, setSubscribed] = useState(false);
    const [isOwner, setIsOwner] = useState(false);

    // Get user ID from token
    const getUserIdFromToken = () => {
        const token = localStorage.getItem("token");

        if (!token) {
            return null;
        }

        try {
            const payload = JSON.parse(
                atob(token.split(".")[1])
            );

            return payload.userId;

        } catch (error) {
            console.log("TOKEN ERROR:", error);
            return null;
        }
    };

    // Fetch channel
    const fetchChannel = async () => {
        try {
            // Get channel
            const channelResponse = await api.get(
                `/channels/${id}`
            );

            const channelData = channelResponse.data;

            setChannel(channelData);

            // Get logged-in user
            const loggedInUserId = getUserIdFromToken();

            // Get channel owner
            const ownerId =
                channelData.owner?._id ||
                channelData.owner;

            // Check if user is owner
            if (
                loggedInUserId &&
                ownerId &&
                loggedInUserId.toString() ===
                ownerId.toString()
            ) {
                setIsOwner(true);
            } else {
                setIsOwner(false);
            }

            // Check subscription
            if (
                loggedInUserId &&
                channelData.subscriberIds
            ) {
                const alreadySubscribed =
                    channelData.subscriberIds.some(
                        (subscriberId) =>
                            subscriberId.toString() ===
                            loggedInUserId.toString()
                    );

                setSubscribed(alreadySubscribed);

            } else {
                setSubscribed(false);
            }

            // Fetch videos
            const videoResponse =
                await api.get("/videos");

            const channelVideos =
                videoResponse.data.filter(
                    (video) =>
                        video.channel?._id === id
                );

            setVideos(channelVideos);

        } catch (error) {
            console.log("CHANNEL ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load channel"
            );
        }
    };

    // Load channel
    useEffect(() => {
        fetchChannel();
    }, [id, isLoggedIn]);

    // Subscribe
    const handleSubscribe = async () => {

        // User must be logged in
        if (!isLoggedIn) {
            navigate("/login");
            return;
        }

        // Owner cannot subscribe
        if (isOwner) {
            return;
        }

        // Already subscribed
        if (subscribed) {
            return;
        }

        try {
            const response =
                await api.put(
                    `/channels/${id}/subscribe`
                );

            // Update subscriber count
            setChannel(
                (previousChannel) => ({
                    ...previousChannel,
                    subscribers:
                        response.data.subscribers
                })
            );

            setSubscribed(true);

            setMessage(
                "Subscribed successfully"
            );

        } catch (error) {
            console.log(
                "SUBSCRIBE ERROR:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                "Failed to subscribe"
            );
        }
    };

    // Delete video
    const handleDelete = async (videoId) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this video?"
            );

        if (!confirmDelete) {
            return;
        }

        try {
            const response =
                await api.delete(
                    `/videos/${videoId}`
                );

            setMessage(
                response.data.message ||
                "Video deleted successfully"
            );

            setVideos(
                (previousVideos) =>
                    previousVideos.filter(
                        (video) =>
                            video._id !== videoId
                    )
            );

        } catch (error) {
            console.log(
                "DELETE VIDEO ERROR:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                "Failed to delete video"
            );
        }
    };

    // Show error
    if (error) {
        return (
            <main className="channel-page">

                <p className="error-message">
                    {error}
                </p>

            </main>
        );
    }

    // Show loading
    if (!channel) {
        return (
            <main className="channel-page">

                <p>
                    Loading...
                </p>

            </main>
        );
    }

    return (
        <main className="channel-page">

            {/* Channel information */}
            <div className="channel-header">

                {/* Channel name */}
                <div
                    className="channel-name-link"
                    onClick={() =>
                        navigate(`/channel/${id}`)
                    }
                >
                    <h1>
                        {channel.channelName}
                    </h1>
                </div>

                {/* Description */}
                <p>
                    {channel.description}
                </p>

                {/* Subscribers */}
                <div className="channel-subscribe-section">

                    {/* Subscriber count */}
                    <p className="subscriber-count">
                        {channel.subscribers || 0}
                        {" "}
                        subscribers
                    </p>

                    {/* Owner button */}
                    {isOwner ? (

                        <button
                            className="subscribe-button own-channel-button"
                            disabled
                        >
                            Your Channel
                        </button>

                    ) : (

                        /* Subscribe button */
                        <button
                            className={
                                subscribed
                                    ? "subscribe-button subscribed"
                                    : "subscribe-button"
                            }
                            onClick={handleSubscribe}
                            disabled={subscribed}
                        >
                            {subscribed
                                ? "Subscribed"
                                : "Subscribe"}
                        </button>

                    )}

                </div>

            </div>

            {/* Show message */}
            {message && (
                <p className="channel-message">
                    {message}
                </p>
            )}

            {/* Videos heading */}
            <div className="channel-video-header">

                <h2>
                    Videos
                </h2>

                {/* Create video */}
                <button
                    className="create-video-button"
                    onClick={() =>
                        navigate(
                            `/channel/${id}/create-video`
                        )
                    }
                >
                    + Create Video
                </button>

            </div>

            {/* Videos */}
            <div className="video-grid">

                {videos.length === 0 ? (

                    <p>
                        No videos available.
                    </p>

                ) : (

                    videos.map((video) => (

                        <div
                            className="channel-video-card"
                            key={video._id}
                        >

                            <VideoCard
                                video={video}
                            />

                            {/* Video actions */}
                            <div className="video-card-actions">

                                {/* Edit video */}
                                <button
                                    className="edit-button"
                                    onClick={() =>
                                        navigate(
                                            `/video/${video._id}/edit`
                                        )
                                    }
                                >
                                    ✏️ Edit
                                </button>

                                {/* Delete video */}
                                <button
                                    className="delete-button"
                                    onClick={() =>
                                        handleDelete(
                                            video._id
                                        )
                                    }
                                >
                                    🗑️ Delete
                                </button>

                            </div>

                        </div>

                    ))

                )}

            </div>

        </main>
    );
}

export default Channel;
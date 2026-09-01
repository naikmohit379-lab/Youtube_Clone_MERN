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

    const fetchChannel = async () => {
        try {
            const channelResponse = await api.get(
                `/channels/${id}`
            );

            setChannel(channelResponse.data);

            const videoResponse = await api.get(
                "/videos"
            );

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

    useEffect(() => {
        fetchChannel();
    }, [id]);

    const handleSubscribe = async () => {

        if (!isLoggedIn) {
            navigate("/login");
            return;
        }

        try {
            const response = await api.put(
                `/channels/${id}/subscribe`
            );

            setChannel((previousChannel) => ({
                ...previousChannel,
                subscribers: response.data.subscribers
            }));

            setSubscribed(true);

            setMessage("Subscribed successfully");

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

    const handleDelete = async (videoId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this video?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await api.delete(
                `/videos/${videoId}`
            );

            setMessage(
                response.data.message ||
                "Video deleted successfully"
            );

            setVideos((previousVideos) =>
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

    if (error) {
        return (
            <main className="channel-page">
                <p className="error-message">
                    {error}
                </p>
            </main>
        );
    }

    if (!channel) {
        return (
            <main className="channel-page">
                <p>Loading...</p>
            </main>
        );
    }

    return (
        <main className="channel-page">

            {/* Channel information */}

            <div className="channel-header">

                <h1>
                    {channel.channelName}
                </h1>

                <p>
                    {channel.description}
                </p>

                <div className="channel-subscribe-section">

                    <p className="subscriber-count">
                        {channel.subscribers} subscribers
                    </p>

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

                </div>

            </div>


            {/* Message */}

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

                            <div className="video-card-actions">

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
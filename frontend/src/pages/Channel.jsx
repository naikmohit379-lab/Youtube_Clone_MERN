import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api.js";
import VideoCard from "../components/VideoCard.jsx";

function Channel() {
    const { id } = useParams();

    const [channel, setChannel] = useState(null);
    const [videos, setVideos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // Fetch channel and its videos
    const fetchChannel = async () => {
        try {
            const channelResponse = await api.get(
                `/channels/${id}`
            );

            console.log(
                "CHANNEL RESPONSE:",
                channelResponse.data
            );

            setChannel(channelResponse.data);

            const videoResponse = await api.get(
                "/videos"
            );

            console.log(
                "ALL VIDEOS:",
                videoResponse.data
            );

            const channelVideos =
                videoResponse.data.filter(
                    (video) =>
                        video.channel?._id === id
                );

            console.log(
                "FILTERED CHANNEL VIDEOS:",
                channelVideos
            );

            setVideos(channelVideos);

        } catch (error) {
            console.log(
                "CHANNEL ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load channel"
            );
        }
    };


    // Load channel when page opens
    useEffect(() => {
        fetchChannel();
    }, [id]);


    // Delete video
    const handleDelete = async (videoId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this video?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            console.log(
                "DELETE VIDEO ID:",
                videoId
            );

            const response = await api.delete(
                `/videos/${videoId}`
            );

            console.log(
                "DELETE RESPONSE:",
                response.data
            );

            setMessage(
                "Video deleted successfully"
            );

            // Remove deleted video immediately
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
        return <p>{error}</p>;
    }


    if (!channel) {
        return <p>Loading...</p>;
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

                <p>
                    Subscribers:{" "}
                    {channel.subscribers}
                </p>

            </div>


            {/* Videos heading */}

            <div className="channel-video-header">

                <h2>Videos</h2>

                <button
                    onClick={() =>
                        window.location.href =
                            `/channel/${id}/create-video`
                    }
                >
                    Create Video
                </button>

            </div>


            {/* Success / error message */}

            {message && (
                <p>{message}</p>
            )}


            {/* Videos */}

            <div className="video-grid">

                {videos.length === 0 ? (

                    <p>
                        No videos available.
                    </p>

                ) : (

                    videos.map((video) => (

                        <div key={video._id}>

                            <VideoCard
                                video={video}
                            />


                            {/* Edit */}

                            <button
                                onClick={() => {
                                    window.location.href =
                                        `/video/${video._id}/edit`;
                                }}
                            >
                                Edit
                            </button>


                            {/* Delete */}

                            <button
                                onClick={() =>
                                    handleDelete(
                                        video._id
                                    )
                                }
                            >
                                Delete
                            </button>

                        </div>

                    ))

                )}

            </div>

        </main>
    );
}

export default Channel;
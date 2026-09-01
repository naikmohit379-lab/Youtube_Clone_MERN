import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api.js";
import VideoCard from "../components/VideoCard.jsx";

function Channel() {
    const { id } = useParams();

    const [channel, setChannel] = useState(null);
    const [videos, setVideos] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchChannel = async () => {
            try {
                // Get channel information
                const channelResponse = await api.get(
                    `/channels/${id}`
                );

                console.log(
                    "CHANNEL RESPONSE:",
                    channelResponse.data
                );

                setChannel(channelResponse.data);

                // Get all videos
                const videoResponse = await api.get(
                    "/videos"
                );

                console.log(
                    "ALL VIDEOS:",
                    videoResponse.data
                );

                // Get only videos belonging to this channel
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

                setError("Failed to load channel");
            }
        };

        fetchChannel();
    }, [id]);

    if (error) {
        return <p>{error}</p>;
    }

    if (!channel) {
        return <p>Loading...</p>;
    }

    return (
        <main className="channel-page">

            {/* Channel Information */}
            <div className="channel-header">

                <h1>
                    {channel.channelName}
                </h1>

                <p>
                    {channel.description}
                </p>

                <p>
                    Subscribers: {channel.subscribers}
                </p>

            </div>


            {/* Videos Heading + Create Button */}
            <div className="channel-video-header">

                <h2>Videos</h2>

                <button
                    onClick={() => {
                        window.location.href =
                            `/channel/${id}/create-video`;
                    }}
                >
                    Create Video
                </button>

            </div>


            {/* Channel Videos */}
            <div className="video-grid">

                {videos.length === 0 ? (

                    <p>No videos available.</p>

                ) : (

                    videos.map((video) => (

                        <div key={video._id}>

                            <VideoCard
                                video={video}
                            />

                            <button
                                onClick={() => {
                                    window.location.href =
                                        `/video/${video._id}/edit`;
                                }}
                            >
                                Edit
                            </button>

                        </div>

                    ))

                )}

            </div>

        </main>
    );
}

export default Channel;
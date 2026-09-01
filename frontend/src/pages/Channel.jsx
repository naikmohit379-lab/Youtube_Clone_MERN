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
                console.log(error);
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

            <div className="video-grid">

                {videos.length === 0 ? (
                    <p>No videos available.</p>
                ) : (
                    videos.map((video) => (
                        <VideoCard
                            key={video._id}
                            video={video}
                        />
                    ))
                )}

            </div>

        </main>
    );
}

export default Channel;
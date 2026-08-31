import { useNavigate } from "react-router-dom";

function VideoCard({ video }) {
    const navigate = useNavigate();

    return (
        <div
            className="video-card"
            onClick={() => navigate(`/video/${video._id}`)}
        >

            <img
                src={video.thumbnailUrl}
                alt={video.title}
            />

            <h3>{video.title}</h3>

            <p>
                {video.channel?.channelName}
            </p>

            <span>
                {video.views} views
            </span>

        </div>
    );
}

export default VideoCard;
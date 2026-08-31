function VideoCard({ video }) {
    return (
        <div className="video-card">

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
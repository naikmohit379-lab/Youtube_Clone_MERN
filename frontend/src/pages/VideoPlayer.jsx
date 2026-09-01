import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api.js";

function VideoPlayer() {
    const { id } = useParams();
    const navigate = useNavigate();

    const viewCounted = useRef(false);

    const [video, setVideo] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [error, setError] = useState("");
    const [commentError, setCommentError] = useState("");

    const [subscribed, setSubscribed] = useState(false);
    const [subscribeLoading, setSubscribeLoading] = useState(false);

    // Fetch video
    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await api.get(`/videos/${id}`);

                console.log("VIDEO ID:", id);
                console.log("VIDEO RESPONSE:", response.data);

                setVideo(response.data);
            } catch (error) {
                console.log("VIDEO FETCH ERROR:", error);
                console.log("STATUS:", error.response?.status);
                console.log("DATA:", error.response?.data);

                setError(
                    error.response?.data?.message ||
                    "Failed to load video"
                );
            }
        };

        fetchVideo();
    }, [id]);


    // Count video view only once
    useEffect(() => {
        if (viewCounted.current) {
            return;
        }

        viewCounted.current = true;

        const countView = async () => {
            try {
                const response = await api.put(
                    `/videos/${id}/view`
                );

                console.log("VIEW RESPONSE:", response.data);

                setVideo((previousVideo) => ({
                    ...previousVideo,
                    views: response.data.views
                }));
            } catch (error) {
                console.log(
                    "VIEW UPDATE ERROR:",
                    error.response?.data || error.message
                );
            }
        };

        countView();
    }, [id]);


    // Fetch comments
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await api.get(
                    `/comments/${id}`
                );

                setComments(response.data);
            } catch (error) {
                console.log(
                    "FETCH COMMENTS ERROR:",
                    error
                );
            }
        };

        fetchComments();
    }, [id]);


    // Like video
    const handleLike = async () => {
        try {
            const response = await api.put(
                `/videos/${id}/like`
            );

            setVideo((previousVideo) => ({
                ...previousVideo,
                likes: response.data.likes,
                dislikes: response.data.dislikes
            }));
        } catch (error) {
            console.log(error);
        }
    };


    // Dislike video
    const handleDislike = async () => {
        try {
            const response = await api.put(
                `/videos/${id}/dislike`
            );

            setVideo((previousVideo) => ({
                ...previousVideo,
                likes: response.data.likes,
                dislikes: response.data.dislikes
            }));
        } catch (error) {
            console.log(error);
        }
    };


    // Subscribe to channel
    const handleSubscribe = async () => {
        if (!video?.channel?._id) {
            return;
        }

        if (subscribed) {
            return;
        }

        try {
            setSubscribeLoading(true);

            const response = await api.put(
                `/channels/${video.channel._id}/subscribe`
            );

            console.log(
                "SUBSCRIBE RESPONSE:",
                response.data
            );

            setVideo((previousVideo) => ({
                ...previousVideo,
                channel: {
                    ...previousVideo.channel,
                    subscribers: response.data.subscribers
                }
            }));

            setSubscribed(true);

        } catch (error) {
            console.log(
                "SUBSCRIBE ERROR:",
                error.response?.data || error.message
            );
        } finally {
            setSubscribeLoading(false);
        }
    };


    // Add comment
    const handleAddComment = async (e) => {
        e.preventDefault();

        if (!commentText.trim()) {
            return;
        }

        try {
            setCommentError("");

            const response = await api.post(
                "/comments",
                {
                    video: id,
                    text: commentText.trim()
                }
            );

            setComments((previousComments) => [
                ...previousComments,
                response.data.comment
            ]);

            setCommentText("");

        } catch (error) {
            console.log(
                "ADD COMMENT ERROR:",
                error
            );

            setCommentError(
                error.response?.data?.message ||
                "Failed to add comment"
            );
        }
    };


    // Delete comment
    const handleDeleteComment = async (commentId) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this comment?"
            )
        ) {
            return;
        }

        try {
            await api.delete(
                `/comments/${commentId}`
            );

            setComments((previousComments) =>
                previousComments.filter(
                    (comment) =>
                        comment._id !== commentId
                )
            );

        } catch (error) {
            console.log(
                "DELETE COMMENT ERROR:",
                error
            );

            setCommentError(
                error.response?.data?.message ||
                "Failed to delete comment"
            );
        }
    };


    // Edit comment
    const handleEditComment = async (
        commentId,
        oldText
    ) => {
        const newText = window.prompt(
            "Edit your comment:",
            oldText
        );

        if (!newText || !newText.trim()) {
            return;
        }

        try {
            const response = await api.put(
                `/comments/${commentId}`,
                {
                    text: newText.trim()
                }
            );

            setComments((previousComments) =>
                previousComments.map((comment) =>
                    comment._id === commentId
                        ? response.data.comment
                        : comment
                )
            );

        } catch (error) {
            console.log(
                "UPDATE COMMENT ERROR:",
                error
            );

            setCommentError(
                error.response?.data?.message ||
                "Failed to update comment"
            );
        }
    };


    if (error) {
        return (
            <main className="video-page">
                <p className="error-message">
                    {error}
                </p>
            </main>
        );
    }


    if (!video) {
        return (
            <main className="video-page">
                <p className="loading-message">
                    Loading video...
                </p>
            </main>
        );
    }


    return (
        <main className="video-page">

            {/* Video Player */}

            <div className="player-container">
                <video
                    controls
                    width="100%"
                    src={video.videoUrl}
                >
                    Your browser does not support video
                    playback.
                </video>
            </div>


            {/* Video Title */}

            <h1 className="video-title">
                {video.title}
            </h1>


            {/* Views + Actions */}

            <div className="video-meta">

                <p className="video-views">
                    {video.views} views
                </p>

                <div className="video-actions">

                    <button
                        className="action-button"
                        onClick={handleLike}
                    >
                        👍 {video.likes}
                    </button>

                    <button
                        className="action-button"
                        onClick={handleDislike}
                    >
                        👎 {video.dislikes}
                    </button>

                </div>

            </div>


            {/* Channel Information */}

            <div className="channel-info">

                <div
                    className="channel-details"
                    onClick={() =>
                        navigate(
                            `/channel/${video.channel?._id}`
                        )
                    }
                >
                    <div className="channel-avatar">
                        {video.channel?.channelName
                            ?.charAt(0)
                            .toUpperCase()}
                    </div>

                    <div>
                        <h3>
                            {video.channel?.channelName}
                        </h3>

                        <p>
                            {video.channel?.subscribers || 0}
                            {" "}
                            subscribers
                        </p>
                    </div>
                </div>


                <button
                    className={
                        subscribed
                            ? "subscribe-button subscribed"
                            : "subscribe-button"
                    }
                    onClick={handleSubscribe}
                    disabled={
                        subscribeLoading ||
                        subscribed
                    }
                >
                    {subscribeLoading
                        ? "Subscribing..."
                        : subscribed
                            ? "Subscribed"
                            : "Subscribe"}
                </button>

            </div>


            {/* Description */}

            <div className="description">

                <h3>Description</h3>

                <p>
                    {video.description}
                </p>

            </div>


            {/* Comments */}

            <section className="comments-section">

                <h2>
                    Comments ({comments.length})
                </h2>


                {commentError && (
                    <p className="comment-error">
                        {commentError}
                    </p>
                )}


                <form
                    className="comment-form"
                    onSubmit={handleAddComment}
                >

                    <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentText}
                        onChange={(e) =>
                            setCommentText(
                                e.target.value
                            )
                        }
                    />

                    <button type="submit">
                        Comment
                    </button>

                </form>


                <div className="comments-list">

                    {comments.length === 0 ? (

                        <p className="no-comments">
                            No comments yet.
                        </p>

                    ) : (

                        comments.map((comment) => (

                            <div
                                className="comment"
                                key={comment._id}
                            >

                                <strong>
                                    {comment.user?.username ||
                                        "User"}
                                </strong>

                                <p>
                                    {comment.text}
                                </p>

                                <button
                                    className="comment-edit"
                                    onClick={() =>
                                        handleEditComment(
                                            comment._id,
                                            comment.text
                                        )
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    className="comment-delete"
                                    onClick={() =>
                                        handleDeleteComment(
                                            comment._id
                                        )
                                    }
                                >
                                    Delete
                                </button>

                            </div>

                        ))

                    )}

                </div>

            </section>

        </main>
    );
}

export default VideoPlayer;
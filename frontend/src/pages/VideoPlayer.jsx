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
    const [subscribeError, setSubscribeError] = useState("");

    const [subscribed, setSubscribed] = useState(false);
    const [subscribeLoading, setSubscribeLoading] = useState(false);


    // =========================
    // FETCH VIDEO
    // =========================

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await api.get(
                    `/videos/${id}`
                );

                console.log(
                    "VIDEO ID:",
                    id
                );

                console.log(
                    "VIDEO RESPONSE:",
                    response.data
                );

                setVideo(response.data);

            } catch (error) {

                console.log(
                    "VIDEO FETCH ERROR:",
                    error
                );

                console.log(
                    "STATUS:",
                    error.response?.status
                );

                console.log(
                    "DATA:",
                    error.response?.data
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load video"
                );
            }
        };

        fetchVideo();

    }, [id]);


    // =========================
    // COUNT VIDEO VIEW
    // =========================

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

                console.log(
                    "VIEW RESPONSE:",
                    response.data
                );

                setVideo((previousVideo) => ({
                    ...previousVideo,
                    views: response.data.views
                }));

            } catch (error) {

                console.log(
                    "VIEW UPDATE ERROR:",
                    error.response?.data ||
                    error.message
                );
            }
        };

        countView();

    }, [id]);


    // =========================
    // FETCH COMMENTS
    // =========================

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


    // =========================
    // LIKE VIDEO
    // =========================

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

            console.log(
                "LIKE ERROR:",
                error
            );
        }
    };


    // =========================
    // DISLIKE VIDEO
    // =========================

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

            console.log(
                "DISLIKE ERROR:",
                error
            );
        }
    };


    // =========================
    // SUBSCRIBE TO CHANNEL
    // =========================

    const handleSubscribe = async () => {

        if (!video?.channel?._id) {
            return;
        }

        if (subscribed) {
            return;
        }

        try {

            setSubscribeLoading(true);
            setSubscribeError("");

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

                    subscribers:
                        response.data.subscribers
                }
            }));

            setSubscribed(true);

        } catch (error) {

            console.log(
                "SUBSCRIBE ERROR:",
                error.response?.data ||
                error.message
            );

            setSubscribeError(
                error.response?.data?.message ||
                "Failed to subscribe"
            );

        } finally {

            setSubscribeLoading(false);
        }
    };


    // =========================
    // ADD COMMENT
    // =========================

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


    // =========================
    // DELETE COMMENT
    // =========================

    const handleDeleteComment = async (commentId) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this comment?"
            );

        if (!confirmDelete) {
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


    // =========================
    // EDIT COMMENT
    // =========================

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
                previousComments.map(
                    (comment) =>
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


    // =========================
    // ERROR
    // =========================

    if (error) {

        return (
            <main className="video-page">

                <p className="error-message">
                    {error}
                </p>

            </main>
        );
    }


    // =========================
    // LOADING
    // =========================

    if (!video) {

        return (
            <main className="video-page">

                <p className="loading-message">
                    Loading Video...
                </p>

            </main>
        );
    }


    return (

        <main className="video-page">


            {/* =========================
                VIDEO PLAYER
            ========================= */}

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


            {/* =========================
                VIDEO TITLE
            ========================= */}

            <h1 className="video-title">
                {video.title}
            </h1>


            {/* =========================
                VIEWS + LIKE/DISLIKE
            ========================= */}

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


            {/* =========================
                CHANNEL INFORMATION
            ========================= */}

            <div className="channel-info">


                {/* CLICKABLE CHANNEL */}

                <div
                    className="channel-details"
                    onClick={() => {

                        if (video.channel?._id) {

                            navigate(
                                `/channel/${video.channel._id}`
                            );
                        }

                    }}
                >

                    {/* CHANNEL AVATAR */}

                    <div className="channel-avatar">

                        {video.channel?.channelName
                            ?.charAt(0)
                            .toUpperCase() || "C"}

                    </div>


                    {/* CHANNEL NAME */}

                    <div className="channel-text">

                        <h3>
                            {video.channel?.channelName ||
                                "Unknown Channel"}
                        </h3>

                        <p>
                            {video.channel?.subscribers || 0}
                            {" "}
                            subscribers
                        </p>

                    </div>

                </div>


                {/* SUBSCRIBE BUTTON */}

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


            {/* SUBSCRIBE ERROR */}

            {subscribeError && (

                <p className="subscribe-error">
                    {subscribeError}
                </p>

            )}


            {/* =========================
                DESCRIPTION
            ========================= */}

            <div className="description">

                <h3>
                    Description
                </h3>

                <p>
                    {video.description}
                </p>

            </div>


            {/* =========================
                COMMENTS
            ========================= */}

            <section className="comments-section">

                <h2>
                    Comments ({comments.length})
                </h2>


                {/* COMMENT ERROR */}

                {commentError && (

                    <p className="comment-error">
                        {commentError}
                    </p>

                )}


                {/* COMMENT FORM */}

                <form
                    className="comment-form"
                    onSubmit={handleAddComment}
                >

                    <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentText}
                        maxLength={500}
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


                {/* COMMENTS LIST */}

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


                                {/* EDIT */}

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


                                {/* DELETE */}

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
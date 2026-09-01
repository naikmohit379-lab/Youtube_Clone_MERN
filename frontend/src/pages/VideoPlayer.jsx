import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api.js";

function VideoPlayer() {
    const { id } = useParams();
    const viewCounted = useRef(false);

    const [video, setVideo] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [error, setError] = useState("");
    const [commentError, setCommentError] = useState("");

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

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await api.get(
                    `/comments/${id}`
                );

                setComments(response.data);
            } catch (error) {
                console.log("FETCH COMMENTS ERROR:", error);
            }
        };

        fetchComments();
    }, [id]);

    const handleLike = async () => {
        try {
            const response = await api.put(`/videos/${id}/like`);

            setVideo((previousVideo) => ({
                ...previousVideo,
                likes: response.data.likes,
                dislikes: response.data.dislikes
            }));
        } catch (error) {
            console.log(error);
        }
    };

    const handleDislike = async () => {
        try {
            const response = await api.put(`/videos/${id}/dislike`);

            setVideo((previousVideo) => ({
                ...previousVideo,
                likes: response.data.likes,
                dislikes: response.data.dislikes
            }));
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();

        if (!commentText.trim()) {
            return;
        }

        try {
            setCommentError("");

            const response = await api.post("/comments", {
                video: id,
                text: commentText.trim()
            });

            setComments((previousComments) => [
                ...previousComments,
                response.data.comment
            ]);

            setCommentText("");
        } catch (error) {
            console.log("ADD COMMENT ERROR:", error);

            setCommentError(
                error.response?.data?.message ||
                "Failed to add comment"
            );
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this comment?"
            )
        ) {
            return;
        }

        try {
            await api.delete(`/comments/${commentId}`);

            setComments((previousComments) =>
                previousComments.filter(
                    (comment) => comment._id !== commentId
                )
            );
        } catch (error) {
            console.log("DELETE COMMENT ERROR:", error);

            setCommentError(
                error.response?.data?.message ||
                "Failed to delete comment"
            );
        }
    };

    const handleEditComment = async (commentId, oldText) => {
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
            console.log("UPDATE COMMENT ERROR:", error);

            setCommentError(
                error.response?.data?.message ||
                "Failed to update comment"
            );
        }
    };

    if (error) {
        return <p>{error}</p>;
    }

    if (!video) {
        return <p>Loading...</p>;
    }

    return (
        <main className="video-page">

            <div className="player-container">
                <video
                    controls
                    width="100%"
                    src={video.videoUrl}
                >
                    Your browser does not support video playback.
                </video>
            </div>

            <h1>{video.title}</h1>

            <p>{video.views} views</p>

            <div className="video-actions">
                <button onClick={handleLike}>
                    👍 {video.likes}
                </button>

                <button onClick={handleDislike}>
                    👎 {video.dislikes}
                </button>
            </div>

            <div className="channel-info">
                <h3>{video.channel?.channelName}</h3>
            </div>

            <div className="description">
                <p>{video.description}</p>
            </div>

            <section className="comments-section">

                <h2>
                    Comments ({comments.length})
                </h2>

                {commentError && (
                    <p>{commentError}</p>
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
                            setCommentText(e.target.value)
                        }
                    />

                    <button type="submit">
                        Comment
                    </button>
                </form>

                <div className="comments-list">

                    {comments.length === 0 ? (
                        <p>No comments yet.</p>
                    ) : (
                        comments.map((comment) => (
                            <div
                                className="comment"
                                key={comment._id}
                            >
                                <strong>
                                    {comment.user?.username || "User"}
                                </strong>

                                <p>{comment.text}</p>

                                <button
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
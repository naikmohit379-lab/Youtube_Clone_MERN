import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api.js";

function VideoPlayer() {
    const { id } = useParams();

    const [video, setVideo] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await api.get(`/videos/${id}`);
                setVideo(response.data);
            } catch (error) {
                console.log(error);
                setError("Failed to load video");
            }
        };

        fetchVideo();
    }, [id]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await api.get(`/comments/${id}`);
                setComments(response.data);
            } catch (error) {
                console.log(error);
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
            const response = await api.post("/comments", {
                video: id,
                text: commentText
            });

            setComments((previousComments) => [
                ...previousComments,
                response.data
            ]);

            setCommentText("");
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await api.delete(`/comments/${commentId}`);

            setComments((previousComments) =>
                previousComments.filter(
                    (comment) => comment._id !== commentId
                )
            );
        } catch (error) {
            console.log(error);
        }
    };

    const handleEditComment = async (commentId, oldText) => {
        const newText = prompt(
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
                    text: newText
                }
            );

            setComments((previousComments) =>
                previousComments.map((comment) =>
                    comment._id === commentId
                        ? response.data
                        : comment
                )
            );
        } catch (error) {
            console.log(error);
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

            <p>
                {video.views} views
            </p>

            <div className="video-actions">

                <button onClick={handleLike}>
                    👍 {video.likes}
                </button>

                <button onClick={handleDislike}>
                    👎 {video.dislikes}
                </button>

            </div>

            <div className="channel-info">
                <h3>
                    {video.channel?.channelName}
                </h3>
            </div>

            <div className="description">
                <p>{video.description}</p>
            </div>

            <section className="comments-section">

                <h2>
                    Comments ({comments.length})
                </h2>

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

                    {comments.map((comment) => (
                        <div
                            className="comment"
                            key={comment._id}
                        >

                            <strong>
                                {comment.user?.username ||
                                    "User"}
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
                    ))}

                </div>

            </section>

        </main>
    );
}

export default VideoPlayer;
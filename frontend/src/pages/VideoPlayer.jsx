import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api.js";

function VideoPlayer() {
    const { id } = useParams();

    const [video, setVideo] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [error, setError] = useState("");
    const [commentError, setCommentError] = useState("");

    // Fetch video
    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await api.get(
                    `/videos/${id}`
                );

                setVideo(response.data);
            } catch (error) {
                console.log(error);

                setError(
                    "Failed to load video"
                );
            }
        };

        fetchVideo();
    }, [id]);


    // Fetch comments
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await api.get(
                    `/comments/${id}`
                );

                console.log(
                    "COMMENTS:",
                    response.data
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

            console.log(
                "ADD COMMENT RESPONSE:",
                response.data
            );

            // IMPORTANT:
            // Backend returns { message, comment }
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
    const handleDeleteComment = async (
        commentId
    ) => {
        const confirmDelete = window.confirm(
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


    // Edit comment
    const handleEditComment = async (
        commentId,
        oldText
    ) => {
        const newText = window.prompt(
            "Edit your comment:",
            oldText
        );

        if (
            !newText ||
            !newText.trim()
        ) {
            return;
        }

        try {
            const response = await api.put(
                `/comments/${commentId}`,
                {
                    text: newText.trim()
                }
            );

            console.log(
                "UPDATE COMMENT RESPONSE:",
                response.data
            );

            // IMPORTANT:
            // Backend returns { message, comment }
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


    if (error) {
        return <p>{error}</p>;
    }


    if (!video) {
        return <p>Loading...</p>;
    }


    return (
        <main className="video-page">

            {/* Video player */}

            <div className="player-container">

                <video
                    controls
                    width="100%"
                    src={video.videoUrl}
                >
                    Your browser does not support
                    video playback.
                </video>

            </div>


            {/* Video title */}

            <h1>
                {video.title}
            </h1>


            {/* Views */}

            <p>
                {video.views} views
            </p>


            {/* Like / dislike */}

            <div className="video-actions">

                <button
                    onClick={handleLike}
                >
                    👍 {video.likes}
                </button>

                <button
                    onClick={handleDislike}
                >
                    👎 {video.dislikes}
                </button>

            </div>


            {/* Channel */}

            <div className="channel-info">

                <h3>
                    {video.channel?.channelName}
                </h3>

            </div>


            {/* Description */}

            <div className="description">

                <p>
                    {video.description}
                </p>

            </div>


            {/* Comments */}

            <section className="comments-section">

                <h2>
                    Comments ({comments.length})
                </h2>


                {/* Comment error */}

                {commentError && (
                    <p>
                        {commentError}
                    </p>
                )}


                {/* Add comment */}

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


                {/* Comments list */}

                <div className="comments-list">

                    {comments.length === 0 ? (

                        <p>
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
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api.js";

function EditVideo() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        thumbnailUrl: "",
        videoUrl: "",
        description: "",
        category: ""
    });

    const [channelId, setChannelId] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    // Fetch existing video
    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await api.get(
                    `/videos/${id}`
                );

                console.log(
                    "VIDEO DETAILS:",
                    response.data
                );

                const video = response.data;

                setFormData({
                    title: video.title || "",
                    thumbnailUrl: video.thumbnailUrl || "",
                    videoUrl: video.videoUrl || "",
                    description: video.description || "",
                    category: video.category || ""
                });

                setChannelId(
                    video.channel?._id || ""
                );

            } catch (error) {
                console.log(
                    "FETCH VIDEO ERROR:",
                    error
                );

                setMessage(
                    error.response?.data?.message ||
                    "Failed to load video"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchVideo();
    }, [id]);


    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


    // Update video
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log(
                "FORM DATA BEFORE UPDATE:",
                formData
            );

            const response = await api.put(
                `/videos/${id}`,
                formData
            );

            console.log(
                "UPDATE VIDEO RESPONSE:",
                response.data
            );

            setMessage(
                "Video updated successfully"
            );

            // Reload the channel page so fresh
            // data is fetched from the backend
            setTimeout(() => {
                window.location.href =
                    `/channel/${channelId}`;
            }, 500);

        } catch (error) {
            console.log(
                "UPDATE VIDEO ERROR:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                "Failed to update video"
            );
        }
    };


    if (loading) {
        return <p>Loading video...</p>;
    }


    return (
        <main className="create-video-page">

            <form
                className="video-form"
                onSubmit={handleSubmit}
            >

                <h1>Edit Video</h1>


                <input
                    type="text"
                    name="title"
                    placeholder="Video Title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />


                <input
                    type="text"
                    name="thumbnailUrl"
                    placeholder="Thumbnail URL"
                    value={formData.thumbnailUrl}
                    onChange={handleChange}
                    required
                />


                <input
                    type="text"
                    name="videoUrl"
                    placeholder="Video URL"
                    value={formData.videoUrl}
                    onChange={handleChange}
                    required
                />


                <textarea
                    name="description"
                    placeholder="Video Description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />


                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                />


                <button type="submit">
                    Update Video
                </button>


                {message && (
                    <p>{message}</p>
                )}

            </form>

        </main>
    );
}

export default EditVideo;
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api.js";

function CreateVideo() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        thumbnailUrl: "",
        videoUrl: "",
        description: "",
        category: ""
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post("/videos", {
                ...formData,
                channel: id
            });

            setMessage("Video created successfully");

            setTimeout(() => {
                navigate(`/channel/${id}`);
            }, 500);

        } catch (error) {
            console.log(error);

            setMessage(
                error.response?.data?.message ||
                "Failed to create video"
            );
        }
    };

    return (
        <main className="create-video-page">

            <form
                className="video-form"
                onSubmit={handleSubmit}
            >

                <h1>Create Video</h1>

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
                    Create Video
                </button>

                {message && <p>{message}</p>}

            </form>

        </main>
    );
}

export default CreateVideo;
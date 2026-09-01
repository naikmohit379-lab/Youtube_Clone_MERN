import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";

function CreateChannel() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        channelName: "",
        description: "",
        channelBanner: ""
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
const response = await api.post(
    "/channels",
    formData
);

console.log("CREATE CHANNEL RESPONSE:", JSON.stringify(response.data, null, 2));

setMessage("Channel created successfully");

setTimeout(() => {
    navigate(
        `/channel/${response.data.channel._id}`
    );
}, 500);

        } catch (error) {
            console.log(error);

            setMessage(
                error.response?.data?.message ||
                "Failed to create channel"
            );
        }
    };

    return (
        <main className="create-channel-page">

            <form
                className="channel-form"
                onSubmit={handleSubmit}
            >

                <h1>Create Channel</h1>

                <input
                    type="text"
                    name="channelName"
                    placeholder="Channel Name"
                    value={formData.channelName}
                    onChange={handleChange}
                    required
                />

                <textarea
                    name="description"
                    placeholder="Channel Description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="channelBanner"
                    placeholder="Channel Banner URL"
                    value={formData.channelBanner}
                    onChange={handleChange}
                />

                <button type="submit">
                    Create Channel
                </button>

                {message && <p>{message}</p>}

            </form>

        </main>
    );
}

export default CreateChannel;
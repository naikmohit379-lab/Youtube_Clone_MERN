import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../services/api.js";
import VideoCard from "../components/VideoCard.jsx";

function Home() {
    const { searchText } = useOutletContext();
    const [videos, setVideos] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = [
        "All",
        "Music",
        "Gaming",
        "Programming",
        "News",
        "Sports",
        "Education"
    ];

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await api.get("/videos");
                setVideos(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchVideos();
    }, []);

    const filteredVideos = videos.filter((video) => {
        const matchesSearch = video.title
            .toLowerCase()
            .includes(searchText.toLowerCase());

        const matchesCategory =
            selectedCategory === "All" ||
            video.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <main className="home">

            <div className="filters">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="video-grid">
                {filteredVideos.map((video) => (
                    <VideoCard
                        key={video._id}
                        video={video}
                    />
                ))}
            </div>

        </main>
    );
}

export default Home;
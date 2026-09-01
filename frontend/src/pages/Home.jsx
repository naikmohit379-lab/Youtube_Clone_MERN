import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../services/api.js";
import VideoCard from "../components/VideoCard.jsx";

function Home() {

    const outletContext = useOutletContext();

    const searchText = outletContext?.searchText || "";

    const [videos, setVideos] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [error, setError] = useState("");

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

                setError("");

                const response = await api.get("/videos");

                console.log(
                    "HOME VIDEOS:",
                    response.data
                );

                setVideos(response.data);

            } catch (error) {

                console.log(
                    "FETCH VIDEOS ERROR:",
                    error
                );

                setError("Failed to load videos");

            }

        };

        fetchVideos();

    }, []);


    const filteredVideos = videos.filter((video) => {

        const title =
            video.title?.toLowerCase() || "";

        const category =
            video.category?.toLowerCase() || "";

        const search =
            searchText.trim().toLowerCase();


        const matchesSearch =
            title.includes(search);


        const matchesCategory =
            selectedCategory === "All" ||
            category ===
                selectedCategory.toLowerCase();


        return (
            matchesSearch &&
            matchesCategory
        );

    });


    return (

        <main className="home">

            <div className="filters">

                {categories.map((category) => (

                    <button
                        key={category}
                        className={
                            selectedCategory === category
                                ? "active-filter"
                                : ""
                        }
                        onClick={() =>
                            setSelectedCategory(category)
                        }
                    >
                        {category}
                    </button>

                ))}

            </div>


            {error && (
                <p>{error}</p>
            )}


            <div className="video-grid">

                {filteredVideos.length === 0 ? (

                    <p>
                        No videos found.
                    </p>

                ) : (

                    filteredVideos.map((video) => (

                        <VideoCard
                            key={video._id}
                            video={video}
                        />

                    ))

                )}

            </div>

        </main>

    );
}

export default Home;
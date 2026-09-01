import { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import api from "../services/api.js";
import VideoCard from "../components/VideoCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function Home() {
    const { searchText } = useOutletContext();
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();

    const [videos, setVideos] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [myChannel, setMyChannel] = useState(null);

    const categories = [
        "All",
        "Music",
        "Gaming",
        "Programming",
        "News",
        "Sports",
        "Education"
    ];

    // Fetch videos
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await api.get("/videos");

                setVideos(response.data);

            } catch (error) {
                console.log(
                    "FETCH VIDEOS ERROR:",
                    error
                );
            }
        };

        fetchVideos();
    }, []);


    // Fetch logged-in user's channel
    useEffect(() => {
        const fetchMyChannel = async () => {

            if (!isLoggedIn) {
                setMyChannel(null);
                return;
            }

            try {
                const response = await api.get(
                    "/channels/mine"
                );

                setMyChannel(response.data);

            } catch (error) {

                // 404 simply means the user
                // has not created a channel yet

                if (error.response?.status === 404) {
                    setMyChannel(null);
                } else {
                    console.log(
                        "FETCH MY CHANNEL ERROR:",
                        error
                    );
                }
            }
        };

        fetchMyChannel();

    }, [isLoggedIn]);


    // Search + category filtering
    const filteredVideos = videos.filter((video) => {

        const matchesSearch =
            video.title
                .toLowerCase()
                .includes(
                    searchText.toLowerCase()
                );

        const matchesCategory =
            selectedCategory === "All" ||
            video.category === selectedCategory;

        return (
            matchesSearch &&
            matchesCategory
        );
    });


    // Create or view channel
    const handleChannelButton = () => {

        if (!isLoggedIn) {
            navigate("/login");
            return;
        }

        if (myChannel) {
            navigate(
                `/channel/${myChannel._id}`
            );
        } else {
            navigate("/create-channel");
        }
    };


    return (
        <main className="home">

            {/* Filters + Channel button */}

            <div className="home-top-section">

                <div className="filters">

                    {categories.map((category) => (

                        <button
                            key={category}
                            onClick={() =>
                                setSelectedCategory(
                                    category
                                )
                            }
                        >
                            {category}
                        </button>

                    ))}

                </div>


                <button
                    className="create-channel-button"
                    onClick={handleChannelButton}
                >
                    {myChannel
                        ? "View Channel"
                        : "+ Create Channel"}
                </button>

            </div>


            {/* Videos */}

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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Header({ onMenuClick, onSearch }) {
    const { isLoggedIn, logout } = useAuth();
    const [searchText, setSearchText] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        setSearchText(e.target.value);
        onSearch(e.target.value);
    };

    return (
        <header className="header">

            <div className="header-left">

                <button
                    className="menu-button"
                    onClick={onMenuClick}
                >
                    ☰
                </button>

                <h2 style={{color:"red"}}
                    className="home-logo"
                    onClick={() => navigate("/")}
                >
                    YouTube Clone
                </h2>

            </div>

            <div className="search-container">

                <input
                    type="text"
                    placeholder="Search"
                    value={searchText}
                    onChange={handleSearch}
                />

                <button>
                    🔍
                </button>

            </div>

            {isLoggedIn ? (

                <button
                    className="signin-button"
                    onClick={logout}
                >
                    Logout
                </button>

            ) : (

                <button
                    className="signin-button"
                    onClick={() => navigate("/login")}
                >
                    Sign In
                </button>

            )}

        </header>
    );
}

export default Header;
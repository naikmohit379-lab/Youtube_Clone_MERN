import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Header({ onMenuClick, onSearch }) {
    const { isLoggedIn, logout } = useAuth();
    const [searchText, setSearchText] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        const value = e.target.value;

        setSearchText(value);

        if (onSearch) {
            onSearch(value);
        }
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

                <h2>YouTube Clone</h2>

            </div>


            <div className="search-container">

                <input
                    type="text"
                    placeholder="Search videos..."
                    value={searchText}
                    onChange={handleSearch}
                />

                <button
                    type="button"
                    onClick={() => {
                        if (onSearch) {
                            onSearch(searchText);
                        }
                    }}
                >
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
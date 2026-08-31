import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Header({ onMenuClick, onSearch }) {
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

                <h2>YouTube Clone</h2>
            </div>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search"
                    value={searchText}
                    onChange={handleSearch}
                />

                <button>🔍</button>
            </div>

            <button
             className="signin-button"
             onClick={() => navigate("/login")}
                    >
                        Sign In
                </button>

        </header>
    );
}

export default Header;
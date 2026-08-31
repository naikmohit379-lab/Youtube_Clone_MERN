import { useState } from "react";

function Header({ onMenuClick, onSearch }) {
    const [searchText, setSearchText] = useState("");

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

            <button className="signin-button">
                Sign In
            </button>

        </header>
    );
}

export default Header;
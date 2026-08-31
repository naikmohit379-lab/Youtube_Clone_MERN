function Sidebar({ isOpen }) {
    return (
        <aside className={`sidebar ${isOpen ? "open" : ""}`}>

            <p>Home</p>
            <p>Trending</p>
            <p>Subscriptions</p>
            <p>Library</p>

        </aside>
    );
}

export default Sidebar;
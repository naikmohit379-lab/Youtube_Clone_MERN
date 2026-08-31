import { useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";

function App() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchText, setSearchText] = useState("");

    return (
        <>
            <Header
                onMenuClick={() =>
                    setSidebarOpen(!sidebarOpen)
                }
                onSearch={setSearchText}
            />

            <Sidebar isOpen={sidebarOpen} />

            <Outlet context={{ searchText }} />
        </>
    );
}

export default App;
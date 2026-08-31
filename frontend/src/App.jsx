import { useState } from "react";
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Home from "./pages/Home.jsx";

function App() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchText, setSearchText] = useState("");

    return (
        <>
            <Header
                onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                onSearch={setSearchText}
            />

            <Sidebar isOpen={sidebarOpen} />

            <Home searchText={searchText} />
        </>
    );
}

export default App;
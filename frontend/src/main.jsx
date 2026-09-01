import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider
} from "react-router-dom";

import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ProtectedTest from "./pages/ProtectedTest.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

import { AuthProvider } from "./context/AuthContext.jsx";
import VideoPlayer from "./pages/VideoPlayer.jsx";
import Channel from "./pages/Channel.jsx";
import CreateChannel from "./pages/CreateChannel.jsx";
import CreateVideo from "./pages/CreateVideo.jsx";
import EditVideo from "./pages/EditVideo.jsx";

import "./index.css";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <Home />
            }
        ]
    },

    {
        path: "/login",
        element: <Login />
    },{
    path: "/video/:id",
    element: <VideoPlayer />
    },

    {
        path: "/register",
        element: <Register />
    },{
    path: "/channel/:id",
    element: <Channel />
},

    {
        element: <ProtectedRoute />,
        children: [
            {
                path: "/protected",
                element: <ProtectedTest />
            },
            {
                path: "/create-channel",
                element: <CreateChannel />
            },
            {
    path: "/channel/:id/create-video",
    element: <CreateVideo />
},{
    path: "/video/:id/edit",
    element: <EditVideo />
},
        ]
    }
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    </StrictMode>
);
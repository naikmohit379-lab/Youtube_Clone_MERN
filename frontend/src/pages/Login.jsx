import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post(
                "/auth/login",
                formData
            );

            const token = response.data.token;

            localStorage.setItem("token", token);

            setMessage("Login successful");

            setTimeout(() => {
                navigate("/");
            }, 500);

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Login failed"
            );
        }
    };

    return (
        <div className="auth-page">

            <form
                className="auth-form"
                onSubmit={handleSubmit}
            >

                <h2>Login</h2>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <button type="submit">
                    Login
                </button>

                {message && <p>{message}</p>}

                <p>
                    Don't have an account?{" "}
                    <span
                        className="auth-link"
                        onClick={() => navigate("/register")}
                    >
                        Register
                    </span>
                </p>

            </form>

        </div>
    );
}

export default Login;
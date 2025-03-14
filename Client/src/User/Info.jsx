import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, logout } from "../redux/authSlice";
import "./Info.css";

const User = () => {
    const [formType, setFormType] = useState("login");
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [protectedData, setProtectedData] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (storedUser) {
            setLoggedInUser(storedUser);
            fetchProtectedData();
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            if (formType === "signup") {
                const response = await fetch("http://localhost:3000/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: `${formData.firstName} ${formData.lastName}`,
                        email: formData.email,
                        password: formData.password,
                    }),
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.message);

                alert("Account created successfully!");
                setFormType("login");

            } else if (formType === "login") {
                const response = await fetch("http://localhost:3000/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password,
                    }),
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.message);

                localStorage.setItem("token", data.token);
                localStorage.setItem("loggedInUser", JSON.stringify(data.user));

                dispatch(login());
                setLoggedInUser(data.user);
                alert("Logged in successfully!");
                fetchProtectedData();
                navigate("/");

            }
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchProtectedData = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found!");
                return;
            }

            const response = await fetch("http://localhost:3000/protected", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            setProtectedData(data);
        } catch (error) {
            console.error("Error fetching protected data:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("loggedInUser");
        dispatch(logout());
        setLoggedInUser(null);
        setProtectedData(null);
        setFormType("login");
    };

    if (loggedInUser) {
        return (
            <div className="user-details">
                <h1 style={{ textAlign: "center" }}>Welcome, {loggedInUser.name}!</h1>
                {protectedData && (
                    <div>
                        <h3>Protected Data:</h3>
                        <pre>{JSON.stringify(protectedData, null, 2)}</pre>
                    </div>
                )}
                <button onClick={handleLogout}>Logout</button>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="form-container">
                {formType === "login" && (
                    <form onSubmit={handleSubmit}>
                        <h1>LOGIN</h1>
                        {error && <p className="error-message">• {error}</p>}
                        <label htmlFor="email">EMAIL</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                        <label htmlFor="password">PASSWORD</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
                        <button className="signin" type="submit">SIGN IN</button>
                        <p className="switch-form" onClick={() => setFormType("signup")}>Create account</p>
                    </form>
                )}

                {formType === "signup" && (
                    <form onSubmit={handleSubmit}>
                        <h1>REGISTER</h1>
                        {error && <p className="error-message">• {error}</p>}
                        <label htmlFor="firstName">FIRST NAME</label>
                        <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
                        <label htmlFor="lastName">LAST NAME</label>
                        <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
                        <label htmlFor="email">EMAIL</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                        <label htmlFor="password">PASSWORD</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
                        <button className="signin" type="submit">CREATE</button>
                        <p className="switch-form" onClick={() => setFormType("login")}>Already have an account? Login</p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default User;
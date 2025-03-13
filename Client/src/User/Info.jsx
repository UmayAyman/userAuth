import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
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

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (storedUser) {
            setLoggedInUser(storedUser);
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formType === "login") {
            if (!formData.email || !formData.password) {
                setError("Please enter a valid email and password.");
                return;
            }

            const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
            const user = storedUsers.find(
                (u) => u.email === formData.email && u.password === formData.password
            );

            if (user) {
                localStorage.setItem("loggedInUser", JSON.stringify(user));
                dispatch(login());
                setLoggedInUser(user);
                alert("Logged in successfully!");
                
                navigate(location.state?.from || "/", { state: { fromCart: location.state?.fromCart } });
            } else {
                setError("Invalid email or password.");
                return;
            }
        } else if (formType === "signup") {
            if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
                setError("All fields are required.");
                return;
            }

            const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
            const userExists = storedUsers.some((u) => u.email === formData.email);

            if (userExists) {
                setError("User already exists with this email.");
                return;
            }

            storedUsers.push(formData);
            localStorage.setItem("users", JSON.stringify(storedUsers));
            alert("Account created successfully!");
            setFormType("login");
        } else if (formType === "forgot") {
            if (!formData.email) {
                setError("Please enter your email.");
                return;
            }

            const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
            const userExists = storedUsers.some((u) => u.email === formData.email);

            if (userExists) {
                alert("Password reset link sent!");
            } else {
                setError("Email not found.");
                return;
            }
        }

        setError("");
        setFormData({ firstName: "", lastName: "", email: "", password: "" });
    };

    const handleLogout = () => {
        localStorage.removeItem("loggedInUser");
        dispatch(logout());
        setLoggedInUser(null);
        setFormType("login");
    };

    if (loggedInUser) {
        return (
            <div className="user-details">
                <h1 style={{ textAlign: "center" }}>Welcome, {loggedInUser.firstName}!</h1>
                <button onClick={handleLogout}>
                    Logout
                </button>
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
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <div className="password-container">
                            <label htmlFor="password">PASSWORD</label>
                            <a onClick={() => setFormType("forgot")} className="forgot-password">
                                Forgot password?
                            </a>
                        </div>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <button className="signin" type="submit">SIGN IN</button>
                        <p className="switch-form" onClick={() => setFormType("signup")}>
                            Create account
                        </p>
                    </form>
                )}

                {formType === "signup" && (
                    <form onSubmit={handleSubmit}>
                        <h1>CREATE ACCOUNT</h1>
                        {error && <p className="error-message">• {error}</p>}
                        <label htmlFor="firstName">FIRST NAME</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                        <label htmlFor="lastName">LAST NAME</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                        <label htmlFor="email">EMAIL</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <label htmlFor="password">PASSWORD</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <button className="signin" type="submit">CREATE</button>
                        <p className="switch-form" onClick={() => setFormType("login")}>
                            Already have an account? Login
                        </p>
                    </form>
                )}

                {formType === "forgot" && (
                    <form onSubmit={handleSubmit}>
                        <h1>FORGOT PASSWORD</h1>
                        {error && <p className="error-message">• {error}</p>}
                        <label htmlFor="email">EMAIL</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <button className="signin" type="submit">RESET PASSWORD</button>
                        <p className="switch-form" onClick={() => setFormType("login")}>
                            Back to Login
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default User;
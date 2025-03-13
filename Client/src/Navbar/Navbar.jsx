import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BsCart3 } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import { SlUser } from "react-icons/sl";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
    const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const toggleSearchBar = () => {
        setIsSearchBarVisible(!isSearchBarVisible);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = () => {
        if (searchQuery.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
            setIsSearchBarVisible(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearchSubmit();
        }
    };

    return (
        <div className="navbar">
            <div className="navbar-left">
                <div className="logo">
                    <h1>DARK</h1>
                </div>
                <div className="nav-links">
                <Link to="/home" className="nav-link">Home</Link>
                <Link to="/link" className="nav-link">Link</Link>
                </div>
            </div>

            <div className="navbar-right">
                <CiSearch onClick={toggleSearchBar} className="search-icon-clickable" />
                <Link to="/User" className="user-icon">
                    <SlUser />
                </Link>
                <Link to="/Cart" className="cart-icon">
                    <BsCart3 />
                </Link>
            </div>

            {isSearchBarVisible && (
                <div className="search-modal">
                    <div className="search-modal-content">
                        <input
                            type="text"
                            placeholder="Search"
                            className="search-input"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onKeyPress={handleKeyPress}
                        />
                        <CiSearch className="search-icon-in-bar" onClick={handleSearchSubmit} />
                        <AiOutlineClose onClick={toggleSearchBar} className="close-icon" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;

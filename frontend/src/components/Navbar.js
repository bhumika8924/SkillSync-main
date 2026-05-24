import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) =>
        location.pathname === path ? "#00c6ff" : "#888";

    const handleLogout = () => {
        navigate("/login");
    };

    return (
        <nav style={navStyles.container}>
            <div style={navStyles.logoSection}>
                <span style={navStyles.logoText}>SkillSwap</span>
            </div>

            <ul style={navStyles.menu}>
                <li>
                    <Link to="/" style={{ ...navStyles.link, color: isActive("/") }}>
                        Home
                    </Link>
                </li>
                <li>
                    <Link
                        to="/discover"
                        style={{ ...navStyles.link, color: isActive("/discover") }}
                    >
                        Discover
                    </Link>
                </li>
                <li>
                    <Link
                        to="/messages"
                        style={{ ...navStyles.link, color: isActive("/messages") }}
                    >
                        Messages
                    </Link>
                </li>
                <li>
                    <Link
                        to="/skills"
                        style={{ ...navStyles.link, color: isActive("/skills") }}
                    >
                        My Skills
                    </Link>
                </li>
                <li>
                    <Link
                        to="/profile"
                        style={{ ...navStyles.link, color: isActive("/profile") }}
                    >
                        Profile
                    </Link>
                </li>
            </ul>

            <div style={navStyles.rightSection}>
                {/* Avatar with letter S */}
                <div style={navStyles.avatarSmall}>B</div>

                {/* Logout Button */}
                <button onClick={handleLogout} style={navStyles.logoutBtn}>
                    Logout
                </button>
            </div>
        </nav>
    );
};

const navStyles = {
    container: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "rgba(15,15,18,0.95)",
        padding: "12px 25px",
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "1px solid rgba(255,255,255,0.05)",
    },
    logoSection: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    logoText: {
        fontSize: "1.3rem",
        fontWeight: "700",
        color: "#fff",
    },
    menu: {
        display: "flex",
        gap: "30px",
        listStyle: "none",
        margin: 0,
        padding: 0,
    },
    link: {
        textDecoration: "none",
        fontSize: "0.95rem",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        transition: "0.2s",
    },
    rightSection: {
        display: "flex",
        alignItems: "center",
        gap: "18px",
    },
    avatarSmall: {
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        background: "linear-gradient(135deg,#00c6ff,#0072ff)",
        color: "#000",
        display: "flex",
        fontWeight: "700",
        justifyContent: "center",
        alignItems: "center",
    },
    logoutBtn: {
        background: "transparent",
        border: "1px solid #00c6ff",
        borderRadius: "6px",
        color: "#00c6ff",
        padding: "5px 12px",
        cursor: "pointer",
    },
};

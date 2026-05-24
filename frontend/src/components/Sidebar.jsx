// src/components/Sidebar.jsx — with Schedule nav item + notification bell
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    Home, Compass, MessageSquare, Users, User,
    LogOut, Zap, Sun, Moon, Bell,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

const NAV_ITEMS = [
    { to: "/dashboard", icon: Home, label: "Home", end: true },
    { to: "/dashboard/discover", icon: Compass, label: "Discover", end: false },
    { to: "/dashboard/messages", icon: MessageSquare, label: "Messenger", end: false },
    { to: "/dashboard/network", icon: Users, label: "My Network", end: false },
    { to: "/dashboard/profile", icon: User, label: "Profile", end: false },
];

export default function Sidebar() {
    const { user, logout, theme, toggleTheme } = useAuth();
    const { notifications, acceptRequest, clearNotification } = useSocket() || { notifications: [] };
    const navigate = useNavigate();
    const [showNotifs, setShowNotifs] = useState(false);

    const unreadCount = notifications?.filter((n) => !n.read).length || 0;

    const handleLogout = () => { logout(); navigate("/"); };

    const handleAccept = (n) => {
        acceptRequest?.(n.id, user?.id);
        clearNotification?.(n.id);
    };

    return (
        <aside style={sidebarStyle(theme)}>
            {/* Brand */}
            <div style={S.brand}>
                <div style={S.brandIcon}><Zap size={20} color="#fff" fill="#fff" /></div>
                <span style={S.brandText}>SkillSync</span>
            </div>

            {/* Nav */}
            <nav style={S.nav}>
                {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
                    <NavLink key={to} to={to} end={end} style={({ isActive }) => navItemStyle(isActive, theme)}>
                        <NavInner Icon={Icon} label={label} />
                    </NavLink>
                ))}
            </nav>

            {/* Bottom */}
            <div style={S.bottom}>
                {/* Notification bell */}
                {unreadCount > 0 && (
                    <div style={{ position: "relative", margin: "0 14px 10px" }}>
                        <button style={{ ...themeToggleStyle(theme), justifyContent: "space-between" }} onClick={() => setShowNotifs(!showNotifs)}>
                            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <Bell size={16} color="#f5c518" />
                                <span style={{ fontSize: "0.82rem", fontWeight: 500 }}>Notifications</span>
                            </span>
                            <span style={{ background: "#e74c3c", color: "#fff", borderRadius: 99, fontSize: "0.68rem", fontWeight: 700, padding: "2px 7px" }}>{unreadCount}</span>
                        </button>
                        {showNotifs && (
                            <div style={{ position: "absolute", bottom: "110%", left: 0, right: 0, background: theme === "dark" ? "#1a1a2e" : "#fff", border: "1px solid rgba(108,99,255,0.2)", borderRadius: 12, padding: "12px", zIndex: 200, boxShadow: "0 12px 36px rgba(0,0,0,0.4)", maxHeight: 260, overflowY: "auto" }}>
                                {notifications.filter((n) => !n.read).map((n, i) => (
                                    <div key={i} style={{ padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: "0.78rem" }}>
                                        <span style={{ fontWeight: 600 }}>{n.type === "swap" ? "⇄ Swap Request" : "💬 Message Request"}</span>
                                        <p style={{ color: "rgba(255,255,255,0.5)", marginTop: 2 }}>from {n.fromName || n.from}</p>
                                        {n.status === "pending" && (
                                            <button
                                                onClick={() => handleAccept(n)}
                                                style={{ marginTop: 6, padding: "5px 14px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#6C63FF,#00c6ff)", color: "#fff", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Inter',sans-serif" }}
                                            >
                                                ✓ Accept
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Theme Toggle */}
                <button style={themeToggleStyle(theme)} onClick={toggleTheme}>
                    {theme === "dark"
                        ? <><Sun size={16} color="#f5c518" /><span style={{ fontSize: "0.82rem", fontWeight: 500 }}>Light Mode</span></>
                        : <><Moon size={16} color="#6C63FF" /><span style={{ fontSize: "0.82rem", fontWeight: 500 }}>Dark Mode</span></>}
                </button>

                {/* User chip */}
                {user && (
                    <div style={userChipStyle(theme)}>
                        <div style={S.userAvatar}>{(user.avatar || user.name?.[0] || "U").toString()[0]}</div>
                        <div style={{ overflow: "hidden" }}>
                            <p style={S.userName}>{user.name || "User"}</p>
                            <p style={S.userSub}>{user.email || user.role || ""}</p>
                        </div>
                    </div>
                )}

                {/* Logout */}
                <button style={logoutStyle()} onClick={handleLogout}>
                    <LogOut size={16} /><span>Logout</span>
                </button>
            </div>
        </aside>
    );
}

function NavInner({ Icon, label }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={S.iconBox}><Icon size={18} /></div>
            <span>{label}</span>
        </div>
    );
}

/* Styles */
const sidebarStyle = (theme) => ({
    width: 240, minWidth: 240, height: "100vh", position: "sticky", top: 0,
    display: "flex", flexDirection: "column",
    background: theme === "dark" ? "rgba(12,12,20,0.97)" : "rgba(240,242,255,0.98)",
    backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
    borderRight: theme === "dark" ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(108,99,255,0.15)",
    padding: "28px 0 20px", zIndex: 100, overflowY: "auto",
    transition: "background 0.25s",
});

const navItemStyle = (isActive, theme) => ({
    display: "flex", alignItems: "center", padding: "10px 20px",
    cursor: "pointer", textDecoration: "none",
    color: isActive ? (theme === "dark" ? "#fff" : "#1A1A30") : (theme === "dark" ? "rgba(255,255,255,0.5)" : "rgba(26,26,48,0.55)"),
    fontSize: "0.92rem", fontWeight: isActive ? 600 : 400,
    background: isActive ? (theme === "dark" ? "rgba(108,99,255,0.15)" : "rgba(108,99,255,0.10)") : "transparent",
    borderRadius: "0 12px 12px 0", marginRight: 12,
    borderLeft: isActive ? "3px solid #6C63FF" : "3px solid transparent",
    transition: "all 0.2s",
});

const themeToggleStyle = (theme) => ({
    display: "flex", alignItems: "center", gap: 10,
    width: "calc(100% - 28px)", margin: "0 14px 10px",
    padding: "10px 14px",
    background: theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(108,99,255,0.08)",
    border: theme === "dark" ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(108,99,255,0.2)",
    borderRadius: 10, cursor: "pointer",
    color: theme === "dark" ? "rgba(255,255,255,0.75)" : "#4A4A6A",
    fontFamily: "'Inter',sans-serif", fontSize: "0.82rem",
});

const userChipStyle = (theme) => ({
    display: "flex", alignItems: "center", gap: 10,
    margin: "0 14px 10px", padding: "10px 12px",
    background: theme === "dark" ? "rgba(255,255,255,0.04)" : "rgba(108,99,255,0.06)",
    borderRadius: 12, border: theme === "dark" ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(108,99,255,0.12)",
});

const logoutStyle = () => ({
    display: "flex", alignItems: "center", gap: 10,
    width: "calc(100% - 28px)", margin: "0 14px",
    padding: "10px 14px", background: "transparent",
    border: "1px solid rgba(231,76,60,0.25)", borderRadius: 10,
    color: "#e74c3c", cursor: "pointer", fontSize: "0.88rem",
    fontWeight: 500, fontFamily: "'Inter',sans-serif",
});

const S = {
    brand: { display: "flex", alignItems: "center", gap: 12, padding: "0 24px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 12 },
    brandIcon: { width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#6C63FF,#00c6ff)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(108,99,255,0.4)" },
    brandText: { fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: "1.18rem", background: "linear-gradient(135deg,#6C63FF,#00c6ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" },
    nav: { display: "flex", flexDirection: "column", gap: 4, flex: 1 },
    iconBox: { width: 34, height: 34, borderRadius: 10, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
    bottom: { marginTop: "auto", paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)" },
    userAvatar: { width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#6C63FF,#00c6ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", fontWeight: 700, color: "#fff", flexShrink: 0 },
    userName: { fontSize: "0.85rem", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", margin: 0 },
    userSub: { fontSize: "0.7rem", opacity: 0.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", margin: 0 },
};

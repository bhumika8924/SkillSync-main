import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MessageSquare, UserMinus, Star, MapPin, GraduationCap } from "lucide-react";
import UserModal from "../components/UserModal";

export default function Network() {
    const { removeFromNetwork, isInNetwork, theme, user, allUsers } = useAuth();
    const navigate = useNavigate();
    const [selectedUser, setSelectedUser] = React.useState(null);
    const isDark = theme === "dark";

    const connectedFriends = allUsers.filter((f) => f.id !== user?.id && isInNetwork(f.id));

    const card = {
        background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.85)",
        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(108,99,255,0.13)",
        backdropFilter: "blur(12px)",
        borderRadius: 18,
    };

    return (
        <div style={{ padding: "36px 40px", minHeight: "100vh", color: isDark ? "#F0F0FF" : "#1A1A30", fontFamily: "'Inter',sans-serif" }}>
            {selectedUser && <UserModal user={selectedUser} isDark={isDark} onClose={() => setSelectedUser(null)} />}

            <h1 style={{ fontSize: "1.9rem", fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 6, color: isDark ? "#F0F0FF" : "#1A1A30" }}>My Network</h1>
            <p style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)", marginBottom: 36, fontSize: "0.92rem" }}>
                {connectedFriends.length} established connection{connectedFriends.length !== 1 ? "s" : ""}
            </p>

            {connectedFriends.length === 0 ? (
                <div style={{ ...card, padding: "80px 32px", textAlign: "center" }}>
                    <div style={{ fontSize: "3rem", marginBottom: 16 }}>🤝</div>
                    <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 10 }}>Your network is empty</h2>
                    <p style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)", marginBottom: 24 }}>
                        Head to Discover to find and add skill exchange partners.
                    </p>
                    <button
                        style={{ padding: "12px 28px", borderRadius: 30, background: "linear-gradient(135deg,#6C63FF,#00c6ff)", border: "none", color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "'Inter',sans-serif" }}
                        onClick={() => navigate("/dashboard/discover")}
                    >
                        Go to Discover →
                    </button>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", gap: 20 }}>
                    {connectedFriends.map((f) => (
                        <NetworkCard
                            key={f.id} user={f} card={card} isDark={isDark}
                            onMessage={() => navigate(`/dashboard/messages?user=${f.id}`)}
                            onRemove={() => {
                                if (window.confirm(`Are you sure you want to remove ${f.name} from your network?`)) {
                                    removeFromNetwork(f.id);
                                }
                            }}
                            onSelect={() => setSelectedUser(f)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function NetworkCard({ user, card, isDark, onMessage, onRemove, onSelect }) {
    const [hovered, setHovered] = React.useState(false);
    const muted = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)";

    return (
        <div
            style={{ ...card, padding: "24px", transition: "transform 0.25s, box-shadow 0.25s", transform: hovered ? "translateY(-5px)" : "none", boxShadow: hovered ? "0 20px 48px rgba(108,99,255,0.15)" : "none" }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Cover bar */}
            <div style={{ height: 6, borderRadius: "12px 12px 0 0", background: `linear-gradient(135deg, ${user.avatarColor}, #6C63FF)`, margin: "-24px -24px 20px" }} />

            <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
                <div style={{ position: "relative", cursor: "pointer" }} onClick={onSelect}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: user.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: "1.1rem" }}>
                        {user.avatar}
                    </div>
                    <div style={{ position: "absolute", bottom: 0, right: -1, width: 13, height: 13, borderRadius: "50%", background: user.online ? "#2ecc71" : "#555", border: "2px solid var(--bg-surface)" }} />
                </div>
                <div style={{ flex: 1, cursor: "pointer" }} onClick={onSelect}>
                    <p style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 2 }}>{user.name}</p>
                    <p style={{ fontSize: "0.8rem", color: muted, marginBottom: 4 }}>{user.role} · {user.course}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Star size={12} fill="#f5c518" color="#f5c518" />
                        <span style={{ fontSize: "0.78rem", color: muted }}>{user.rating} rating</span>
                    </div>
                </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", color: muted, marginBottom: 14 }}>
                <GraduationCap size={12} />{user.course} &nbsp;·&nbsp; <MapPin size={12} /> NCU Gurgaon
            </div>

            {/* Skills */}
            <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: "0.72rem", color: muted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>Offers</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {user.skillsOffered.map((s) => (
                        <span key={s} style={{ padding: "4px 10px", borderRadius: 99, fontSize: "0.72rem", fontWeight: 500, background: "rgba(0,198,255,0.1)", color: "#00c6ff", border: "1px solid rgba(0,198,255,0.2)" }}>{s}</span>
                    ))}
                </div>
            </div>
            <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: "0.72rem", color: muted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>Wants</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {user.skillsWanted.map((s) => (
                        <span key={s} style={{ padding: "4px 10px", borderRadius: 99, fontSize: "0.72rem", fontWeight: 500, background: "rgba(108,99,255,0.1)", color: "#9B8FFF", border: "1px solid rgba(108,99,255,0.2)" }}>{s}</span>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 8 }}>
                <button
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px", borderRadius: 10, background: "linear-gradient(135deg,#6C63FF,#00c6ff)", border: "none", color: "#fff", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer", fontFamily: "'Inter',sans-serif" }}
                    onClick={onMessage}
                >
                    <MessageSquare size={15} /> Message
                </button>
                <button
                    style={{ padding: "9px 14px", borderRadius: 10, background: "rgba(231,76,60,0.08)", border: "1px solid rgba(231,76,60,0.2)", color: "#e74c3c", cursor: "pointer", fontFamily: "'Inter',sans-serif" }}
                    onClick={onRemove}
                    title="Remove from network"
                >
                    <UserMinus size={16} />
                </button>
            </div>
        </div>
    );
}

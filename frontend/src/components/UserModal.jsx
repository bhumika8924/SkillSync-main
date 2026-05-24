import React from "react";
import { X, MapPin, Github, Star, Mail, Briefcase, User } from "lucide-react";

export default function UserModal({ user, onClose, isDark }) {
    if (!user) return null;
    const bg = isDark ? "rgba(26,26,40,0.75)" : "rgba(255,255,255,0.75)";
    const txt = isDark ? "#F0F0FF" : "#1A1A30";
    const border = isDark ? "rgba(255,255,255,0.12)" : "rgba(108,99,255,0.2)";
    const muted = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.5)";

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)" }} onClick={onClose}>
            <div style={{ width: 440, maxWidth: "90%", background: bg, backdropFilter: "blur(24px)", borderRadius: 24, padding: "28px", color: txt, border: `1px solid ${border}`, boxShadow: "0 24px 64px rgba(0,0,0,0.5)", position: "relative" }} onClick={(e) => e.stopPropagation()}>
                <button style={{ position: "absolute", top: 18, right: 18, background: "transparent", border: "none", color: muted, cursor: "pointer", display: "flex", padding: 4 }} onClick={onClose}>
                    <X size={20} />
                </button>

                <div style={{ display: "flex", gap: 18, alignItems: "center", marginBottom: 24 }}>
                    <div style={{ width: 72, height: 72, borderRadius: 20, background: user.avatarColor || "#6C63FF", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "1.8rem", fontWeight: 700, flexShrink: 0 }}>
                        {user.avatar || "?"}
                    </div>
                    <div>
                        <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 2 }}>{user.name}</h2>
                        <p style={{ color: muted, fontSize: "0.88rem", fontWeight: 500 }}>{user.role} · {user.course}</p>
                    </div>
                </div>

                {user.about && (
                    <div style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", padding: "14px 16px", borderRadius: 14, marginBottom: 24 }}>
                        <p style={{ fontSize: "0.85rem", lineHeight: 1.6, color: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)" }}>"{user.about}"</p>
                    </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, fontSize: "0.82rem", color: muted, marginBottom: 24 }}>
                    {user.location && <div style={{ display: "flex", alignItems: "center", gap: 8 }}><MapPin size={15} color="#6C63FF" />{user.location}</div>}
                    {user.status && <div style={{ display: "flex", alignItems: "center", gap: 8 }}><User size={15} color="#2ecc71" />{user.status}</div>}
                    {user.experience && <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Briefcase size={15} color="#e67e22" />{user.experience}</div>}
                    {user.email && <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Mail size={15} color="#00c6ff" />{user.email}</div>}
                    {user.github && <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Github size={15} color={isDark ? "#F0F0FF" : "#1A1A30"} />{user.github}</div>}
                    {user.stats?.rating && <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Star size={15} color="#f5c518" fill="#f5c518" />{user.stats.rating} / 5.0 Rating</div>}
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                    <div style={{ flex: 1, padding: 14, borderRadius: 16, background: isDark ? "rgba(0,198,255,0.05)" : "rgba(0,198,255,0.08)", border: "1px solid rgba(0,198,255,0.15)" }}>
                        <p style={{ fontSize: "0.72rem", color: muted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8, fontWeight: 600 }}>Offers</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {(user.skillsOffered || []).map(s => <span key={s} style={{ fontSize: "0.75rem", fontWeight: 500, background: "rgba(0,198,255,0.12)", color: "#00c6ff", padding: "4px 10px", borderRadius: 10 }}>{s}</span>)}
                        </div>
                    </div>
                    <div style={{ flex: 1, padding: 14, borderRadius: 16, background: isDark ? "rgba(108,99,255,0.05)" : "rgba(108,99,255,0.08)", border: "1px solid rgba(108,99,255,0.15)" }}>
                        <p style={{ fontSize: "0.72rem", color: muted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8, fontWeight: 600 }}>Wants</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {(user.skillsWanted || []).map(s => <span key={s} style={{ fontSize: "0.75rem", fontWeight: 500, background: "rgba(108,99,255,0.12)", color: "#9B8FFF", padding: "4px 10px", borderRadius: 10 }}>{s}</span>)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// src/pages/Home.js  — Dashboard Feed (post-login)
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { SUGGESTED_SWAPS } from "../data/mockData";
import { Check, X, TrendingUp, Bell, Star, Zap } from "lucide-react";

export default function Home() {
  const { user, theme } = useAuth();
  const [swaps, setSwaps] = useState(SUGGESTED_SWAPS);
  const [accepted, setAccepted] = useState([]);

  const dismiss = (id) => setSwaps((s) => s.filter((sw) => sw.id !== id));
  const accept = (id) => {
    setAccepted((a) => [...a, id]);
    setTimeout(() => dismiss(id), 900);
  };

  const isDark = theme === "dark";
  const card = {
    background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.85)",
    border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(108,99,255,0.15)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderRadius: 18,
  };

  return (
    <div style={{ ...S.page, color: isDark ? "#F0F0FF" : "#1A1A30", background: "var(--bg-base)" }}>

      {/* Header */}
      <div style={S.header}>
        <div>
          <p style={{ fontSize: "0.82rem", color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", marginBottom: 4 }}>
            {new Date().toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <h1 style={{ ...S.greeting, color: isDark ? "#F0F0FF" : "#1A1A30" }}>
            Good {getTimeOfDay()}, <span style={S.gradientName}>{firstName(user?.name)}</span> 👋
          </h1>
          <p style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)", fontSize: "0.92rem" }}>
            You have <b style={{ color: "#6C63FF" }}>{swaps.length}</b> new swap suggestions waiting.
          </p>
        </div>
        <button style={S.notifBtn}>
          <Bell size={18} />
          <span style={S.notifDot} />
        </button>
      </div>

      {/* Stats bar */}
      <div style={{ ...S.statsBar, ...card }}>
        {[
          { label: "Swaps Done", value: user?.stats?.swaps ?? 3, icon: <Zap size={16} color="#6C63FF" /> },
          { label: "Rating", value: `${user?.stats?.rating ?? 4.5} ★`, icon: <Star size={16} color="#f5c518" /> },
          { label: "Network", value: "4 friends", icon: <TrendingUp size={16} color="#2ecc71" /> },
        ].map((s) => (
          <div key={s.label} style={S.statItem}>
            {s.icon}
            <span style={{ fontSize: "1.4rem", fontWeight: 800 }}>{s.value}</span>
            <span style={{ fontSize: "0.75rem", color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", textTransform: "uppercase", letterSpacing: "1px" }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Swap Feed */}
      <h2 style={{ ...S.sectionH, color: isDark ? "#F0F0FF" : "#1A1A30" }}>
        <Zap size={20} color="#6C63FF" fill="#6C63FF" /> Suggested Swaps
      </h2>

      <div style={S.feedGrid}>
        {swaps.length === 0 ? (
          <div style={{ ...card, padding: "60px 32px", textAlign: "center", gridColumn: "1 / -1", color: "rgba(255,255,255,0.3)" }}>
            <p style={{ fontSize: "2rem" }}>🎉</p>
            <p style={{ marginTop: 12 }}>You've reviewed all swap suggestions for today!</p>
          </div>
        ) : (
          swaps.map((sw) => {
            const isAccepted = accepted.includes(sw.id);
            return (
              <div
                key={sw.id}
                style={{
                  ...card, padding: "24px",
                  transition: "all 0.4s ease",
                  opacity: isAccepted ? 0 : 1,
                  transform: isAccepted ? "scale(0.95) translateY(-8px)" : "none",
                  border: isAccepted ? "1px solid rgba(46,204,113,0.4)" : card.border,
                  background: isAccepted ? (isDark ? "rgba(46,204,113,0.08)" : "rgba(46,204,113,0.05)") : card.background,
                }}
              >
                {/* User info */}
                <div style={S.swapUserRow}>
                  <div style={{ ...S.avatar, background: sw.from.avatarColor }}>
                    {sw.from.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: "0.98rem" }}>{sw.from.name}</p>
                    <p style={{ fontSize: "0.78rem", color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)" }}>{sw.from.role} · {sw.from.course}</p>
                  </div>
                  <div style={{ ...S.matchScore, color: matchColor(sw.matchScore), background: `${matchColor(sw.matchScore)}15`, border: `1px solid ${matchColor(sw.matchScore)}30` }}>
                    {sw.matchScore}% match
                  </div>
                </div>

                {/* Swap chips */}
                <div style={S.swapChips}>
                  <span style={S.chipOffer}>🎓 Offers: {sw.offer}</span>
                  <span style={S.swapArrow}>⇄</span>
                  <span style={S.chipWant}>✦ Wants: {sw.want}</span>
                </div>

                {/* Message */}
                <p style={{ ...S.swapMsg, color: isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)" }}>
                  "{sw.message}"
                </p>

                {/* Date + actions */}
                <div style={S.swapFooter}>
                  <span style={{ fontSize: "0.75rem", color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)" }}>{sw.date}</span>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button style={S.skipBtn} onClick={() => dismiss(sw.id)}>
                      <X size={15} /> Skip
                    </button>
                    <button style={S.acceptBtn} onClick={() => accept(sw.id)}>
                      <Check size={15} /> Accept Swap
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}

function firstName(name = "") { return name.split(" ")[0] || "there"; }
function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
function matchColor(score) {
  if (score >= 90) return "#2ecc71";
  if (score >= 75) return "#f5c518";
  return "#e74c3c";
}

const S = {
  page: { padding: "36px 40px", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 },
  greeting: { fontSize: "1.9rem", fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 6 },
  gradientName: {
    background: "linear-gradient(135deg,#6C63FF,#00c6ff)", WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent", backgroundClip: "text",
  },
  notifBtn: {
    position: "relative", width: 42, height: 42, borderRadius: "50%",
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", color: "#F0F0FF",
  },
  notifDot: {
    position: "absolute", top: 8, right: 8, width: 8, height: 8,
    borderRadius: "50%", background: "#e74c3c", border: "2px solid var(--bg-base)",
  },
  statsBar: {
    display: "flex", gap: 0, marginBottom: 40,
    overflow: "hidden",
  },
  statItem: {
    flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
    gap: 4, padding: "20px 16px",
    borderRight: "1px solid rgba(255,255,255,0.06)",
  },
  sectionH: {
    fontSize: "1.2rem", fontWeight: 700, marginBottom: 20,
    display: "flex", alignItems: "center", gap: 8,
  },
  feedGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20,
  },
  swapUserRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 16 },
  avatar: {
    width: 44, height: 44, borderRadius: 12,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, color: "#fff", fontSize: "1rem", flexShrink: 0,
  },
  matchScore: {
    padding: "4px 10px", borderRadius: 99, fontSize: "0.72rem",
    fontWeight: 700, whiteSpace: "nowrap",
  },
  swapChips: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 14 },
  chipOffer: {
    padding: "5px 12px", borderRadius: 99, fontSize: "0.78rem", fontWeight: 500,
    background: "rgba(0,198,255,0.12)", color: "#00c6ff", border: "1px solid rgba(0,198,255,0.25)",
  },
  chipWant: {
    padding: "5px 12px", borderRadius: 99, fontSize: "0.78rem", fontWeight: 500,
    background: "rgba(108,99,255,0.12)", color: "#9B8FFF", border: "1px solid rgba(108,99,255,0.25)",
  },
  swapArrow: { fontSize: "1.1rem", color: "rgba(255,255,255,0.3)" },
  swapMsg: { fontSize: "0.88rem", lineHeight: 1.6, fontStyle: "italic", marginBottom: 18 },
  swapFooter: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  skipBtn: {
    display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8,
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
    color: "rgba(255,255,255,0.55)", fontWeight: 500, fontSize: "0.82rem", cursor: "pointer",
    fontFamily: "'Inter',sans-serif",
  },
  acceptBtn: {
    display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8,
    background: "linear-gradient(135deg,#6C63FF,#00c6ff)", border: "none",
    color: "#fff", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer",
    fontFamily: "'Inter',sans-serif", boxShadow: "0 4px 14px rgba(108,99,255,0.3)",
  },
};
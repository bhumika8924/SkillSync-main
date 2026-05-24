// src/pages/Discover.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MapPin, GraduationCap, Star, UserPlus, MessageSquare, Check, Search } from "lucide-react";
import UserModal from "../components/UserModal";

const ALL_SKILLS = ["All", "React", "Python", "ML", "Figma", "Node.js", "Flutter", "DevOps", "DSA", "Design"];

export default function Discover() {
  const navigate = useNavigate();
  const { removeFromNetwork, isInNetwork, theme, user, allUsers } = useAuth();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);
  const [requestSent, setRequestSent] = useState({});

  const isDark = theme === "dark";

  const filterUser = (u) => {
    if (u.id === user?.id) return false;
    const q = query.toLowerCase();
    const matchQ = !q || u.name.toLowerCase().includes(q) || u.skillsOffered.some((s) => s.toLowerCase().includes(q));
    const matchF = filter === "All" || u.skillsOffered.some((s) => s.toLowerCase().includes(filter.toLowerCase()));
    return matchQ && matchF;
  };

  const friends = allUsers.filter(u => isInNetwork(u.id)).filter(filterUser);
  const globals = allUsers.filter(u => !isInNetwork(u.id)).filter(filterUser);

  const card = {
    background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.85)",
    border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(108,99,255,0.13)",
    backdropFilter: "blur(12px)", borderRadius: 18,
  };

  return (
    <div style={{ ...S.page, color: isDark ? "#F0F0FF" : "#1A1A30" }}>
      {selectedUser && <UserModal user={selectedUser} isDark={isDark} onClose={() => setSelectedUser(null)} />}

      <h1 style={{ ...S.pageTitle, color: isDark ? "#F0F0FF" : "#1A1A30" }}>Discover</h1>
      <p style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)", marginBottom: 28 }}>
        Find your next skill exchange partner at NCU.
      </p>

      {/* Search + Filter */}
      <div style={S.searchRow}>
        <div style={{ ...S.searchBox, background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)", border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(108,99,255,0.15)" }}>
          <Search size={16} style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }} />
          <input
            style={{ ...S.searchInput, color: isDark ? "#F0F0FF" : "#1A1A30", background: "transparent" }}
            placeholder="Search by name or skill..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div style={S.filterChips}>
          {ALL_SKILLS.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                ...S.filterChip,
                background: filter === s ? "linear-gradient(135deg,#6C63FF,#00c6ff)" : (isDark ? "rgba(255,255,255,0.05)" : "rgba(108,99,255,0.08)"),
                color: filter === s ? "#fff" : (isDark ? "rgba(255,255,255,0.6)" : "#4A4A6A"),
                border: filter === s ? "none" : (isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(108,99,255,0.2)"),
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* My Network / Friends */}
      {friends.length > 0 && (
        <>
          <SectionHeader label="My Network" count={friends.length} />
          <div style={S.grid}>
            {friends.map((u) => (
              <UserCard key={u.id} user={u} isConnected card={card} isDark={isDark}
                onMessage={() => navigate(`/dashboard/messages?user=${u.id}`)}
                onRemove={() => {
                  if (window.confirm(`Are you sure you want to remove ${u.name} from your network?`)) {
                    removeFromNetwork(u.id);
                  }
                }}
                onSelect={() => setSelectedUser(u)}
              />
            ))}
          </div>
        </>
      )}

      {/* Global */}
      {globals.length > 0 && (
        <>
          <SectionHeader label="Global Discover" count={globals.length} />
          <div style={S.grid}>
            {globals.map((u) => {
              const inNet = isInNetwork(u.id);
              return (
                <UserCard key={u.id} user={u} isConnected={inNet} isRequested={requestSent[u.id]} card={card} isDark={isDark}
                  onAdd={() => setRequestSent(r => ({ ...r, [u.id]: true }))}
                  onRemove={() => {
                    if (window.confirm(`Are you sure you want to remove ${u.name} from your network?`)) {
                      removeFromNetwork(u.id);
                    }
                  }}
                  onMessage={() => navigate(`/dashboard/messages?user=${u.id}`)}
                  onSwap={() => setRequestSent(r => ({ ...r, [u.id]: true }))}
                  onSelect={() => setSelectedUser(u)}
                />
              );
            })}
          </div>
        </>
      )}

      {friends.length === 0 && globals.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.3)" }}>
          <p style={{ fontSize: "2rem" }}>🔍</p>
          <p>No results for "{query}"</p>
        </div>
      )}
    </div>
  );
}

const SectionHeader = ({ label, count }) => (
  <div style={S.sectionHeader}>
    <h2 style={S.sectionTitle}>{label}</h2>
    <span style={S.countBadge}>{count}</span>
  </div>
);

function UserCard({ user, isConnected, isRequested, card, isDark, onAdd, onRemove, onMessage, onSwap, onSelect }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        ...card,
        padding: "24px",
        transition: "transform 0.25s, box-shadow 0.25s",
        transform: hovered ? "translateY(-5px)" : "none",
        boxShadow: hovered ? "0 16px 40px rgba(108,99,255,0.15)" : "0 4px 20px rgba(0,0,0,0.2)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
        <div style={{ position: "relative", cursor: "pointer" }} onClick={onSelect}>
          <div style={{ ...S.avatar, background: user.avatarColor }}>{user.avatar}</div>
          <div style={{ ...S.onlineDot, background: user.online ? "#2ecc71" : "#555" }} />
        </div>
        <div style={{ flex: 1, minWidth: 0, cursor: "pointer" }} onClick={onSelect}>
          <p style={{ fontWeight: 700, fontSize: "0.98rem", marginBottom: 2 }}>{user.name}</p>
          <p style={{ fontSize: "0.78rem", color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)", marginBottom: 6 }}>{user.role}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Star size={12} fill="#f5c518" color="#f5c518" />
            <span style={{ fontSize: "0.78rem", color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>{user.rating}</span>
          </div>
        </div>
        {isConnected && (
          <div style={S.connectedBadge}><Check size={12} /> Connected</div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, fontSize: "0.75rem", color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
        <GraduationCap size={12} />{user.course} · <MapPin size={12} /> NCU Gurgaon
      </div>

      {/* Skills */}
      <div style={S.skillRow}>
        {user.skillsOffered.slice(0, 2).map((s) => (
          <span key={s} style={S.chipOffer}>{s}</span>
        ))}
        {user.skillsWanted.slice(0, 1).map((s) => (
          <span key={s} style={S.chipWant}>{s}</span>
        ))}
      </div>
      <div style={{ marginTop: 20 }}>
        {isConnected ? (
          <div style={S.actionRow}>
            <button style={S.msgBtn} onClick={(e) => { e.stopPropagation(); onMessage(); }}><MessageSquare size={13} /> Message</button>
            <button style={{ ...S.msgBtn, color: "#e74c3c" }} onClick={(e) => { e.stopPropagation(); onRemove(); }}><span style={{ fontSize: "1rem", lineHeight: 1 }}>×</span></button>
          </div>
        ) : (
          <div style={S.actionRow}>
            {isRequested ? (
              <button disabled style={{ ...S.addBtn, background: "rgba(46,204,113,0.15)", color: "#2ecc71", boxShadow: "none", cursor: "default" }} onClick={(e) => e.stopPropagation()}>✓ Request Sent</button>
            ) : (
              <>
                <button style={S.addBtn} onClick={(e) => { e.stopPropagation(); onAdd(); }}><UserPlus size={13} /> Add</button>
                <button style={S.swapBtn} onClick={(e) => { e.stopPropagation(); onSwap(); }}>⇄ Swap</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const S = {
  page: { padding: "36px 40px", minHeight: "100vh" },
  pageTitle: { fontSize: "1.9rem", fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 6 },
  searchRow: { marginBottom: 36 },
  searchBox: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "12px 16px", borderRadius: 12, marginBottom: 14,
  },
  searchInput: {
    flex: 1, border: "none", outline: "none", fontSize: "0.92rem",
    fontFamily: "'Inter',sans-serif",
  },
  filterChips: { display: "flex", gap: 8, flexWrap: "wrap" },
  filterChip: {
    padding: "6px 14px", borderRadius: 99, fontSize: "0.8rem",
    fontWeight: 500, cursor: "pointer", fontFamily: "'Inter',sans-serif",
    transition: "all 0.2s",
  },
  sectionHeader: { display: "flex", alignItems: "center", gap: 10, marginBottom: 16 },
  sectionTitle: { fontSize: "1.1rem", fontWeight: 700 },
  countBadge: {
    padding: "3px 10px", borderRadius: 99, fontSize: "0.75rem",
    background: "rgba(108,99,255,0.15)", color: "#9B8FFF", fontWeight: 600,
  },
  grid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))",
    gap: 18, marginBottom: 40,
  },
  avatar: {
    width: 46, height: 46, borderRadius: 13,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, color: "#fff", fontSize: "1rem",
  },
  onlineDot: {
    position: "absolute", width: 10, height: 10, borderRadius: "50%",
    bottom: 0, right: 0, border: "2px solid var(--bg-surface)",
  },
  connectedBadge: {
    display: "flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 99,
    background: "rgba(46,204,113,0.12)", color: "#2ecc71", fontSize: "0.72rem",
    border: "1px solid rgba(46,204,113,0.25)", fontWeight: 600, flexShrink: 0,
  },
  skillRow: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 },
  chipOffer: {
    padding: "4px 10px", borderRadius: 99, fontSize: "0.72rem", fontWeight: 500,
    background: "rgba(0,198,255,0.1)", color: "#00c6ff", border: "1px solid rgba(0,198,255,0.2)",
  },
  chipWant: {
    padding: "4px 10px", borderRadius: 99, fontSize: "0.72rem", fontWeight: 500,
    background: "rgba(108,99,255,0.1)", color: "#9B8FFF", border: "1px solid rgba(108,99,255,0.2)",
  },
  actionRow: { display: "flex", gap: 8, flexWrap: "wrap" },
  msgBtn: {
    display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: 8,
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
    color: "rgba(255,255,255,0.7)", fontSize: "0.78rem", fontWeight: 500, cursor: "pointer",
    fontFamily: "'Inter',sans-serif",
  },
  addBtn: {
    display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: 8,
    background: "linear-gradient(135deg,#6C63FF,#00c6ff)", border: "none",
    color: "#fff", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer",
    fontFamily: "'Inter',sans-serif", boxShadow: "0 3px 10px rgba(108,99,255,0.3)",
  },
  swapBtn: {
    padding: "7px 12px", borderRadius: 8,
    background: "rgba(0,198,255,0.12)", border: "1px solid rgba(0,198,255,0.25)",
    color: "#00c6ff", fontSize: "0.78rem", fontWeight: 500, cursor: "pointer",
    fontFamily: "'Inter',sans-serif",
  },
  removeBtn: {
    padding: "7px 12px", borderRadius: 8,
    background: "rgba(231,76,60,0.08)", border: "1px solid rgba(231,76,60,0.2)",
    color: "#e74c3c", fontSize: "0.78rem", fontWeight: 500, cursor: "pointer",
    fontFamily: "'Inter',sans-serif",
  },
};

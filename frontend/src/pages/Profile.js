import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Edit2, Save, Camera, Github, Linkedin, Mail,
  Briefcase, Star, X, Plus, Calendar, Clock, User, Video,
} from "lucide-react";
import { API_URL } from "../config";

const API = API_URL;
const MONTHS_S = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function Profile() {
  const { user: authUser, theme } = useAuth();
  const isDark = theme === "dark";

  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState({
    name: authUser?.name || "Bhumika Sharma",
    tagline: "B.Tech CSE '25 · Full Stack Developer",
    bio: "Passionate about building scalable web applications. I love teaching React and looking to trade knowledge for advanced Python backend skills.",
    skillsOffered: authUser?.skillsOffered?.length ? authUser.skillsOffered : ["React", "JavaScript", "UI/UX Design", "CSS"],
    skillsWanted: authUser?.skillsWanted?.length ? authUser.skillsWanted : ["Python", "Machine Learning", "AWS"],
    stats: authUser?.stats || { swaps: 12, rating: 4.8, reviews: 24 },
  });
  const [newOffer, setNewOffer] = useState("");
  const [newWant, setNewWant] = useState("");
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    if (!authUser?.id) return;
    fetch(`${API}/api/meetings/${authUser.id}`)
      .then((r) => r.json())
      .then((data) => setMeetings(data.sort((a, b) => a.date?.localeCompare(b.date)).slice(0, 5)))
      .catch(() => {
        // demo data when server offline
        const today = new Date();
        const pad = (n) => String(n).padStart(2, "0");
        const f = (d) => `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate() + d)}`;
        setMeetings([
          { id: "d1", title: "React ↔ Python Swap", with: "Nikhil Mehta", date: f(3), time: "15:00" },
          { id: "d2", title: "ML Study Session", with: "Priya Agarwal", date: f(6), time: "11:00" },
        ]);
      });
  }, [authUser]);

  const set = (f) => (e) => setUser({ ...user, [f]: e.target.value });

  const addSkill = (type) => {
    const val = type === "offer" ? newOffer.trim() : newWant.trim();
    if (!val) return;
    if (type === "offer") { setUser({ ...user, skillsOffered: [...user.skillsOffered, val] }); setNewOffer(""); }
    else { setUser({ ...user, skillsWanted: [...user.skillsWanted, val] }); setNewWant(""); }
  };
  const removeSkill = (type, skill) => {
    if (type === "offer") setUser({ ...user, skillsOffered: user.skillsOffered.filter((s) => s !== skill) });
    else setUser({ ...user, skillsWanted: user.skillsWanted.filter((s) => s !== skill) });
  };

  const txt = isDark ? "#F0F0FF" : "#1A1A30";
  const muted = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)";
  const card = {
    background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.85)",
    border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(108,99,255,0.13)",
    backdropFilter: "blur(12px)",
    borderRadius: 20,
    padding: "28px",
  };

  return (
    <div style={{ minHeight: "100vh", color: txt, fontFamily: "'Inter',sans-serif", paddingBottom: 60 }}>
      {/* Cover */}
      <div style={{ height: 180, background: "linear-gradient(135deg, #6C63FF 0%, #00c6ff 100%)", position: "relative", display: "flex", alignItems: "flex-end", justifyContent: "flex-end", padding: 20 }}>
        <button style={{ background: "rgba(0,0,0,0.4)", border: "none", borderRadius: 20, padding: "7px 14px", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: "0.82rem", backdropFilter: "blur(8px)", fontFamily: "'Inter',sans-serif" }}>
          <Camera size={14} /> Change Cover
        </button>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
        {/* Profile header card */}
        <div style={{ ...card, marginTop: -60, position: "relative" }}>
          {/* Avatar */}
          <div style={{ position: "relative", width: 110, height: 110, marginTop: -80, marginBottom: 16, zIndex: 2 }}>
            <div style={{ width: "100%", height: "100%", borderRadius: 22, background: `linear-gradient(135deg, #6C63FF, #00c6ff)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.8rem", fontWeight: 700, color: "#fff", border: "4px solid var(--bg-surface)", boxShadow: "0 8px 24px rgba(108,99,255,0.4)" }}>
              {user.name[0]}
            </div>
            {editing && (
              <div style={{ position: "absolute", inset: 0, borderRadius: 22, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Camera size={20} color="#fff" />
              </div>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              {editing ? (
                <input style={{ ...inputStyle(isDark), fontSize: "1.6rem", fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 8 }} value={user.name} onChange={set("name")} />
              ) : (
                <h1 style={{ fontSize: "1.9rem", fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 4 }}>{user.name}</h1>
              )}
              {editing ? (
                <input style={{ ...inputStyle(isDark), color: muted }} value={user.tagline} onChange={set("tagline")} />
              ) : (
                <p style={{ color: muted, fontSize: "0.95rem", marginBottom: 16 }}>{user.tagline}</p>
              )}

              {/* Meta */}
              <div style={{ display: "flex", gap: 20, color: muted, fontSize: "0.85rem", marginBottom: 16 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Briefcase size={13} /> Student / Freelancer</span>
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Mail size={13} /> {authUser?.email || "bhumika@ncuindia.edu"}</span>
              </div>

              {/* Social icons */}
              <div style={{ display: "flex", gap: 8 }}>
                {[Github, Linkedin, Mail].map((Icon, i) => (
                  <div key={i} style={{ width: 34, height: 34, borderRadius: 9, background: isDark ? "rgba(255,255,255,0.06)" : "rgba(108,99,255,0.08)", border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(108,99,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <Icon size={16} />
                  </div>
                ))}
              </div>
            </div>

            <button
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 10, background: isDark ? "rgba(255,255,255,0.06)" : "rgba(108,99,255,0.1)", border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(108,99,255,0.2)", color: isDark ? "#F0F0FF" : "#6C63FF", fontWeight: 600, cursor: "pointer", fontFamily: "'Inter',sans-serif", fontSize: "0.88rem" }}
              onClick={() => setEditing(!editing)}
            >
              {editing ? <><Save size={15} /> Save</> : <><Edit2 size={15} /> Edit Profile</>}
            </button>
          </div>

          {/* Stats bar */}
          <div style={{ display: "flex", gap: 0, marginTop: 24, background: isDark ? "rgba(255,255,255,0.03)" : "rgba(108,99,255,0.05)", borderRadius: 14, overflow: "hidden", border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(108,99,255,0.1)" }}>
            {[
              { label: "Swaps Done", val: user.stats.swaps },
              { label: "Rating", val: <span style={{ display: "flex", alignItems: "center", gap: 4 }}>{user.stats.rating} <Star size={13} fill="#f5c518" color="#f5c518" /></span> },
              { label: "Reviews", val: user.stats.reviews },
            ].map((s, i) => (
              <div key={s.label} style={{ flex: 1, textAlign: "center", padding: "16px 8px", borderRight: i < 2 ? (isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(108,99,255,0.1)") : "none" }}>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 3 }}>{s.val}</div>
                <div style={{ fontSize: "0.72rem", color: muted, textTransform: "uppercase", letterSpacing: "1px" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* About section */}
        <div style={{ ...card, marginTop: 20 }}>
          <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: 14, paddingBottom: 10, borderBottom: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(108,99,255,0.1)" }}>About Me</h3>
          {editing ? (
            <textarea style={{ ...inputStyle(isDark), width: "100%", minHeight: 90, resize: "vertical", lineHeight: 1.6 }} value={user.bio} onChange={set("bio")} />
          ) : (
            <p style={{ color: isDark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.6)", lineHeight: 1.7, fontSize: "0.95rem" }}>{user.bio}</p>
          )}
        </div>

        {/* Skills row */}
        <div style={{ display: "flex", gap: 20, marginTop: 20, flexWrap: "wrap" }}>
          {/* Skills I Teach */}
          <SkillSection
            title="Skills I Teach" color="#00c6ff" chipStyle="offer"
            skills={user.skillsOffered} editing={editing}
            newVal={newOffer} onNewChange={(e) => setNewOffer(e.target.value)}
            onAdd={() => addSkill("offer")} onRemove={(s) => removeSkill("offer", s)}
            card={card} isDark={isDark} muted={muted}
          />
          {/* Skills I Want */}
          <SkillSection
            title="Skills I Want" color="#9B8FFF" chipStyle="want"
            skills={user.skillsWanted} editing={editing}
            newVal={newWant} onNewChange={(e) => setNewWant(e.target.value)}
            onAdd={() => addSkill("want")} onRemove={(s) => removeSkill("want", s)}
            card={card} isDark={isDark} muted={muted}
          />
        </div>
      </div>

      {/* ── Upcoming Sessions ── */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 56px" }}>
        <div style={{ ...card, padding: "22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <Calendar size={17} color="#6C63FF" />
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: txt }}>Upcoming Sessions</h2>
          </div>
          {meetings.length === 0 ? (
            <p style={{ color: muted, fontSize: "0.85rem", textAlign: "center", padding: "12px 0" }}>
              No upcoming sessions. Schedule one from the Messenger!
            </p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 12 }}>
              {meetings.map((m) => {
                const parts = m.date?.split("-") || [];
                const dayNum = parts[2] ? parseInt(parts[2]) : "—";
                const monIdx = parts[1] ? parseInt(parts[1]) - 1 : 0;
                return (
                  <div key={m.id} style={{ padding: "14px", borderRadius: 14, background: isDark ? "rgba(108,99,255,0.07)" : "rgba(108,99,255,0.05)", border: "1px solid rgba(108,99,255,0.18)", display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 42, height: 42, borderRadius: 10, background: "linear-gradient(135deg,rgba(108,99,255,0.2),rgba(0,198,255,0.12))", border: "1px solid rgba(108,99,255,0.25)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: "0.56rem", fontWeight: 700, color: "#9B8FFF", textTransform: "uppercase", lineHeight: 1 }}>{MONTHS_S[monIdx]}</span>
                      <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "#6C63FF", lineHeight: 1.3 }}>{dayNum}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 600, fontSize: "0.83rem", color: txt, marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.title || "Skill Session"}</p>
                      {m.with && <p style={{ fontSize: "0.71rem", color: muted, display: "flex", alignItems: "center", gap: 4 }}><User size={10} />{m.with}</p>}
                      {m.time && <p style={{ fontSize: "0.71rem", color: muted, display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}><Clock size={10} />{m.time}</p>}
                      {m.link && (
                        <a href={m.link} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 6, background: "rgba(46,204,113,0.1)", border: "1px solid rgba(46,204,113,0.3)", color: "#2ecc71", fontSize: "0.65rem", fontWeight: 700, textDecoration: "none", marginTop: 6, transition: "background 0.2s" }}>
                          <Video size={10} /> Join Meet
                        </a>
                      )}
                      {m.note && <p style={{ fontSize: "0.75rem", color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)", marginTop: 8, fontStyle: "italic", lineHeight: 1.4 }}>"{m.note}"</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );

}

function SkillSection({ title, color, chipStyle, skills, editing, newVal, onNewChange, onAdd, onRemove, card, isDark, muted }) {
  const bg = chipStyle === "offer" ? "rgba(0,198,255,0.12)" : "rgba(108,99,255,0.12)";
  const border = chipStyle === "offer" ? "1px solid rgba(0,198,255,0.25)" : "1px solid rgba(108,99,255,0.25)";
  return (
    <div style={{ ...card, flex: 1, minWidth: 240 }}>
      <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 14, paddingBottom: 10, borderBottom: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(108,99,255,0.1)", color }}>
        {title}
      </h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: editing ? 14 : 0 }}>
        {skills.map((s) => (
          <span key={s} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 99, fontSize: "0.82rem", fontWeight: 500, background: bg, color, border }}>
            {s}
            {editing && <button style={{ background: "transparent", border: "none", cursor: "pointer", color, padding: 0, display: "flex" }} onClick={() => onRemove(s)}><X size={12} /></button>}
          </span>
        ))}
      </div>
      {editing && (
        <div style={{ display: "flex", gap: 8 }}>
          <input
            style={{ ...inputStyle(isDark), flex: 1, padding: "8px 12px", fontSize: "0.85rem" }}
            placeholder="Add skill..."
            value={newVal}
            onChange={onNewChange}
            onKeyDown={(e) => e.key === "Enter" && onAdd()}
          />
          <button style={{ width: 34, height: 34, borderRadius: 9, background: `${color}20`, border: `1px solid ${color}40`, color, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onAdd}>
            <Plus size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

function inputStyle(isDark) {
  return {
    width: "100%", padding: "10px 14px", borderRadius: 10, fontSize: "0.92rem",
    background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
    border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(108,99,255,0.2)",
    color: isDark ? "#F0F0FF" : "#1A1A30", outline: "none",
    fontFamily: "'Inter',sans-serif", boxSizing: "border-box",
    transition: "border-color 0.2s",
    display: "block",
  };
}

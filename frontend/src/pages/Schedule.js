// src/pages/Schedule.js — Glassmorphic Calendar with Meeting Integration
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { ChevronLeft, ChevronRight, Plus, Clock, X, User, Video } from "lucide-react";
import { API_URL } from "../config";

const API = API_URL;
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Schedule() {
    const { user, theme } = useAuth();
    const isDark = theme === "dark";
    const today = new Date();

    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());
    const [meetings, setMeetings] = useState([]);
    const [selectedDay, setSelectedDay] = useState(today.getDate());
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({ title: "", with: "", time: "10:00", note: "" });

    const fetchMeetings = async () => {
        if (!user) return;
        try {
            const data = await fetch(`${API}/api/meetings/${user.id}`).then((r) => r.json());
            setMeetings(data);
        } catch {
            // demo meetings if server offline
            setMeetings([
                { id: "m1", title: "React ↔ Python Session", with: "Nikhil Mehta", date: `${year}-${String(month + 1).padStart(2, "0")}-${String(today.getDate() + 2).padStart(2, "0")}`, time: "15:00", note: "Bring your React project." },
                { id: "m2", title: "ML Study Swap", with: "Priya Agarwal", date: `${year}-${String(month + 1).padStart(2, "0")}-${String(today.getDate() + 5).padStart(2, "0")}`, time: "11:00", note: "Focus on scikit-learn." },
            ]);
        }
    };

    useEffect(() => { fetchMeetings(); }, [user, month, year]);

    // Listen for new meetings from Messages page "Meet" button
    useEffect(() => {
        const handler = (e) => setMeetings((m) => [...m, e.detail]);
        window.addEventListener("ss_meeting_created", handler);
        return () => window.removeEventListener("ss_meeting_created", handler);
    }, []);

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const isToday = (d) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    const dateStr = (d) => `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const meetingsOnDay = (d) => meetings.filter((m) => m.date === dateStr(d));
    const selectedMeetings = meetingsOnDay(selectedDay);

    const addMeeting = async () => {
        if (!form.title || !user) return;
        const mtg = { from: user.id, to: form.with, title: form.title, date: dateStr(selectedDay), time: form.time, note: form.note };
        try {
            const saved = await fetch(`${API}/api/meetings`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(mtg) }).then((r) => r.json());
            setMeetings((m) => [...m, saved]);
        } catch {
            setMeetings((m) => [...m, { ...mtg, id: `local_${Date.now()}` }]);
        }
        setForm({ title: "", with: "", time: "10:00", note: "" });
        setShowAdd(false);
    };

    const txt = isDark ? "#F0F0FF" : "#1A1A30";
    const muted = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)";
    const glass = {
        background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.75)",
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        border: isDark ? "1px solid rgba(255,255,255,0.09)" : "1px solid rgba(108,99,255,0.15)",
        borderRadius: 20,
    };

    return (
        <div style={{ padding: "36px 40px", minHeight: "100vh", color: txt, fontFamily: "'Inter',sans-serif" }}>
            <h1 style={{ fontSize: "1.9rem", fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 6, color: txt }}>Schedule</h1>
            <p style={{ color: muted, marginBottom: 32, fontSize: "0.92rem" }}>Manage your skill exchange sessions and meetings.</p>

            <div style={{ display: "flex", gap: 28, flexWrap: "wrap", alignItems: "flex-start" }}>

                {/* ── CALENDAR ── */}
                <div style={{ ...glass, flex: 1.4, minWidth: 340, padding: "28px" }}>
                    {/* Month nav */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                        <button style={navBtn(isDark)} onClick={() => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); }}><ChevronLeft size={18} /></button>
                        <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: "1.1rem" }}>{MONTHS[month]} {year}</h2>
                        <button style={navBtn(isDark)} onClick={() => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); }}><ChevronRight size={18} /></button>
                    </div>

                    {/* Day headers */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 8 }}>
                        {DAYS.map((d) => (
                            <div key={d} style={{ textAlign: "center", fontSize: "0.72rem", fontWeight: 600, color: muted, padding: "4px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>{d}</div>
                        ))}
                    </div>

                    {/* Day grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
                        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
                            const hasMtg = meetingsOnDay(d).length > 0;
                            const isSelected = d === selectedDay;
                            const isTod = isToday(d);
                            return (
                                <button
                                    key={d}
                                    onClick={() => setSelectedDay(d)}
                                    style={{
                                        aspectRatio: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                        borderRadius: 10, border: "none", cursor: "pointer", position: "relative",
                                        fontFamily: "'Inter',sans-serif", fontWeight: isTod ? 700 : 400, fontSize: "0.88rem",
                                        background: isSelected
                                            ? "linear-gradient(135deg,#6C63FF,#00c6ff)"
                                            : isTod
                                                ? (isDark ? "rgba(108,99,255,0.2)" : "rgba(108,99,255,0.12)")
                                                : "transparent",
                                        color: isSelected ? "#fff" : (isTod ? "#6C63FF" : txt),
                                        boxShadow: isSelected ? "0 4px 12px rgba(108,99,255,0.35)" : "none",
                                        transition: "all 0.15s",
                                    }}
                                >
                                    {d}
                                    {hasMtg && (
                                        <div style={{ position: "absolute", bottom: 3, width: 5, height: 5, borderRadius: "50%", background: isSelected ? "#fff" : "#6C63FF" }} />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Add meeting button */}
                    <button
                        style={{ marginTop: 20, width: "100%", padding: "11px", borderRadius: 12, background: "linear-gradient(135deg,#6C63FF,#00c6ff)", border: "none", color: "#fff", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", fontFamily: "'Inter',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 14px rgba(108,99,255,0.3)" }}
                        onClick={() => setShowAdd(true)}
                    >
                        <Plus size={17} /> Schedule Meeting — {MONTHS[month].slice(0, 3)} {selectedDay}
                    </button>
                </div>

                {/* ── SELECTED DAY PANEL ── */}
                <div style={{ flex: 1, minWidth: 280 }}>
                    <div style={{ ...glass, padding: "24px", marginBottom: 20 }}>
                        <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 4 }}>
                            {MONTHS[month]} {selectedDay}, {year}
                        </h3>
                        <p style={{ fontSize: "0.8rem", color: muted, marginBottom: 16 }}>
                            {selectedMeetings.length === 0 ? "No sessions scheduled" : `${selectedMeetings.length} session${selectedMeetings.length > 1 ? "s" : ""} scheduled`}
                        </p>
                        {selectedMeetings.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "24px 0", color: muted }}>
                                <p style={{ fontSize: "1.8rem", marginBottom: 8 }}>📅</p>
                                <p style={{ fontSize: "0.85rem" }}>Free day! Schedule a session.</p>
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {selectedMeetings.map((mtg) => (
                                    <div key={mtg.id} style={{ padding: "14px", borderRadius: 14, background: isDark ? "rgba(108,99,255,0.08)" : "rgba(108,99,255,0.06)", border: "1px solid rgba(108,99,255,0.2)" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                            <p style={{ fontWeight: 700, fontSize: "0.9rem" }}>{mtg.title || "Skill Session"}</p>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                            <span style={{ fontSize: "0.78rem", color: muted, display: "flex", alignItems: "center", gap: 5 }}><Clock size={12} />{mtg.time}</span>
                                            {mtg.with && <span style={{ fontSize: "0.78rem", color: muted, display: "flex", alignItems: "center", gap: 5 }}><User size={12} />{mtg.with}</span>}
                                            {mtg.note && <span style={{ fontSize: "0.78rem", color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>{mtg.note}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Upcoming meetings */}
                    <div style={{ ...glass, padding: "20px" }}>
                        <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: 14 }}>All Upcoming</h3>
                        {meetings.filter((m) => m.date >= dateStr(1)).length === 0 ? (
                            <p style={{ color: muted, fontSize: "0.82rem", textAlign: "center", padding: "12px 0" }}>No upcoming sessions this month</p>
                        ) : (
                            meetings.filter((m) => m.date >= dateStr(1) && m.date <= dateStr(31)).sort((a, b) => a.date.localeCompare(b.date)).map((m) => (
                                <div key={m.id} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
                                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(108,99,255,0.12)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <span style={{ fontSize: "0.6rem", color: "#9B8FFF", fontWeight: 700 }}>{MONTHS[parseInt(m.date?.split("-")[1]) - 1]?.slice(0, 3)}</span>
                                        <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "#6C63FF" }}>{m.date?.split("-")[2]}</span>
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 600, fontSize: "0.85rem", marginBottom: 2 }}>{m.title || "Skill Session"}</p>
                                        <span style={{ fontSize: "0.72rem", color: muted }}>{m.time} {m.with ? `· with ${m.with}` : ""}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Add Meeting Modal */}
            {showAdd && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(6px)" }} onClick={() => setShowAdd(false)}>
                    <div style={{ ...glass, width: 380, padding: "28px", boxShadow: "0 24px 64px rgba(0,0,0,0.5)", background: isDark ? "rgba(18,14,35,0.95)" : "rgba(255,255,255,0.98)" }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                            <h3 style={{ fontWeight: 700, fontSize: "1.05rem" }}>New Session — {MONTHS[month].slice(0, 3)} {selectedDay}</h3>
                            <button style={{ background: "transparent", border: "none", cursor: "pointer", color: muted }} onClick={() => setShowAdd(false)}><X size={18} /></button>
                        </div>
                        {[
                            { label: "Session Title", key: "title", placeholder: "React ↔ Python Swap" },
                            { label: "With (name)", key: "with", placeholder: "Nikhil Mehta" },
                            { label: "Time", key: "time", type: "time" },
                            { label: "Notes", key: "note", placeholder: "What to cover..." },
                        ].map(({ label, key, placeholder, type }) => (
                            <div key={key} style={{ marginBottom: 14 }}>
                                <label style={{ display: "block", fontSize: "0.8rem", color: muted, marginBottom: 6, fontWeight: 500 }}>{label}</label>
                                <input
                                    type={type || "text"}
                                    placeholder={placeholder}
                                    value={form[key]}
                                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                                    style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(108,99,255,0.2)"}`, background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)", color: txt, outline: "none", fontSize: "0.88rem", fontFamily: "'Inter',sans-serif", boxSizing: "border-box" }}
                                />
                            </div>
                        ))}
                        <button style={{ width: "100%", padding: "13px", borderRadius: 12, background: "linear-gradient(135deg,#6C63FF,#00c6ff)", border: "none", color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "'Inter',sans-serif", marginTop: 4 }} onClick={addMeeting}>
                            <Video size={15} style={{ marginRight: 8, verticalAlign: "middle" }} />
                            Confirm Session
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

const navBtn = (isDark) => ({
    width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
    background: isDark ? "rgba(255,255,255,0.06)" : "rgba(108,99,255,0.08)",
    border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(108,99,255,0.18)",
    cursor: "pointer", color: "inherit",
});

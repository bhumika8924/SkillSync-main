// src/pages/Messages.js — fixes: no duplicate msgs, name always visible, Meet → inline calendar
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { Send, Calendar, Search, Plus, X, Phone, Video, Lock, UserPlus, ChevronLeft, ChevronRight } from "lucide-react";
import { MOCK_FRIENDS, GLOBAL_USERS } from "../data/mockData";
import UserModal from "../components/UserModal";
import { API_URL } from "../config";

const API = API_URL;
const ALL_MOCK = [...MOCK_FRIENDS, ...GLOBAL_USERS];

const renderMessageWithLinks = (text) => {
  if (!text) return null;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).map((part, i) => {
    if (part.match(urlRegex)) {
      return <a key={i} href={part} target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "underline", fontWeight: 600 }}>{part}</a>;
    }
    return part;
  });
};

/* ── tiny inline calendar panel ── */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS_SHORT = ["S", "M", "T", "W", "T", "F", "S"];

function MeetingPanel({ isDark, authUser, partnerUser, onClose, onMeetingCreated }) {
  const today = new Date();
  const [yr, setYr] = useState(today.getFullYear());
  const [mo, setMo] = useState(today.getMonth());
  const [selDay, setSelDay] = useState(today.getDate());
  const [meetings, setMeetings] = useState([]);
  const [time, setTime] = useState("10:00");
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const [buffering, setBuffering] = useState(false);

  const daysInMo = new Date(yr, mo + 1, 0).getDate();
  const firstDay = new Date(yr, mo, 1).getDay();
  const dateStr = (d) => `${yr}-${String(mo + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const hasMtg = (d) => meetings.some((m) => m.date === dateStr(d));

  useEffect(() => {
    fetch(`${API}/api/meetings/${authUser?.id}`)
      .then((r) => r.json()).then(setMeetings).catch(() => { });
  }, [authUser]);

  const MEET_LINKS = [
    "https://meet.google.com/uaw-dobj-xff",
    "https://meet.google.com/yaq-mnxm-mnq",
    "https://meet.google.com/han-aojm-ygy",
    "https://meet.google.com/hvm-oziz-hbu"
  ];

  const confirm = () => {
    setBuffering(true);
    const link = MEET_LINKS[Math.floor(Math.random() * MEET_LINKS.length)];
    const mtg = { from: authUser?.id, to: partnerUser?.id, title: `Session with ${partnerUser?.name}`, with: partnerUser?.name, date: dateStr(selDay), time, note, link };

    setTimeout(async () => {
      try {
        const res = await fetch(`${API}/api/meetings`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(mtg) });
        const savedMtg = await res.json();
        if (res.ok) {
          setMeetings((m) => [...m, savedMtg]);
          if (onMeetingCreated) onMeetingCreated(savedMtg);
        }
      } catch {
        setMeetings((m) => [...m, { ...mtg, id: `l_${Date.now()}` }]);
        if (onMeetingCreated) onMeetingCreated(mtg);
      }
      setBuffering(false);
      setSaved(true);
      setTimeout(onClose, 1500);
    }, 4500);
  };

  const g = { background: isDark ? "rgba(16,12,30,0.97)" : "rgba(245,246,255,0.98)", border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(108,99,255,0.2)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" };
  const txt = isDark ? "#F0F0FF" : "#1A1A30";
  const muted = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)";

  return (
    <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 300, zIndex: 50, ...g, borderRadius: "0 0 0 0", display: "flex", flexDirection: "column", boxShadow: "-8px 0 32px rgba(0,0,0,0.4)", animation: "fadeUp 0.25s ease" }}>
      {/* Header */}
      <div style={{ padding: "16px 18px 12px", borderBottom: isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(108,99,255,0.12)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ fontWeight: 700, fontSize: "0.9rem", color: txt }}>Schedule a Session</p>
          <p style={{ fontSize: "0.72rem", color: muted }}>with {partnerUser?.name}</p>
        </div>
        <button style={{ background: "transparent", border: "none", color: muted, cursor: "pointer" }} onClick={onClose}><X size={16} /></button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px 0" }}>
        {/* Month nav */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <button style={navB(isDark)} onClick={() => { if (mo === 0) { setMo(11); setYr(y => y - 1); } else setMo(m => m - 1); }}><ChevronLeft size={14} /></button>
          <span style={{ fontSize: "0.82rem", fontWeight: 700, color: txt }}>{MONTHS[mo]} {yr}</span>
          <button style={navB(isDark)} onClick={() => { if (mo === 11) { setMo(0); setYr(y => y + 1); } else setMo(m => m + 1); }}><ChevronRight size={14} /></button>
        </div>

        {/* Day labels */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 4 }}>
          {DAYS_SHORT.map((d, i) => <div key={i} style={{ textAlign: "center", fontSize: "0.6rem", color: muted, fontWeight: 600 }}>{d}</div>)}
        </div>

        {/* Days grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3 }}>
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: daysInMo }, (_, i) => i + 1).map((d) => {
            const isToday = d === today.getDate() && mo === today.getMonth() && yr === today.getFullYear();
            const isSel = d === selDay;
            const busy = hasMtg(d);
            return (
              <button key={d} onClick={() => setSelDay(d)} style={{ aspectRatio: "1", borderRadius: 7, border: "none", cursor: "pointer", fontFamily: "'Inter',sans-serif", fontSize: "0.75rem", position: "relative", fontWeight: isSel || isToday ? 700 : 400, background: isSel ? "linear-gradient(135deg,#6C63FF,#00c6ff)" : isToday ? (isDark ? "rgba(108,99,255,0.2)" : "rgba(108,99,255,0.12)") : "transparent", color: isSel ? "#fff" : isToday ? "#6C63FF" : txt, boxShadow: isSel ? "0 2px 8px rgba(108,99,255,0.4)" : "none" }}>
                {d}
                {busy && <div style={{ position: "absolute", bottom: 2, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", background: isSel ? "#fff" : "#6C63FF" }} />}
              </button>
            );
          })}
        </div>

        {/* Existing meetings for selected day */}
        {meetings.filter((m) => m.date === dateStr(selDay)).length > 0 && (
          <div style={{ marginTop: 10, padding: "8px 10px", borderRadius: 10, background: isDark ? "rgba(231,76,60,0.08)" : "rgba(231,76,60,0.06)", border: "1px solid rgba(231,76,60,0.2)" }}>
            <p style={{ fontSize: "0.72rem", color: "#e74c3c", fontWeight: 600, marginBottom: 4 }}>⚠ Existing sessions this day:</p>
            {meetings.filter((m) => m.date === dateStr(selDay)).map((m) => (
              <p key={m.id} style={{ fontSize: "0.7rem", color: muted }}>{m.time} — {m.title || "Session"}</p>
            ))}
          </div>
        )}

        {/* Time + note */}
        <div style={{ marginTop: 12 }}>
          <label style={{ display: "block", fontSize: "0.72rem", color: muted, marginBottom: 4, fontWeight: 500 }}>Time</label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(108,99,255,0.2)", background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)", color: txt, fontSize: "0.82rem", fontFamily: "'Inter',sans-serif", outline: "none", boxSizing: "border-box", marginBottom: 10 }} />
          <label style={{ display: "block", fontSize: "0.72rem", color: muted, marginBottom: 4, fontWeight: 500 }}>Note (optional)</label>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="What to cover..." style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(108,99,255,0.2)", background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)", color: txt, fontSize: "0.8rem", fontFamily: "'Inter',sans-serif", outline: "none", resize: "none", height: 60, boxSizing: "border-box" }} />
        </div>
      </div>

      {/* Confirm button */}
      <div style={{ padding: "12px 14px 16px" }}>
        <style>{`@keyframes spinMtg { 100% { transform: rotate(360deg); } }`}</style>
        {saved ? (
          <p style={{ textAlign: "center", color: "#2ecc71", fontWeight: 600, fontSize: "0.88rem" }}>✓ Session scheduled!</p>
        ) : buffering ? (
          <button disabled style={{ width: "100%", padding: "11px", borderRadius: 10, background: "rgba(108,99,255,0.5)", border: "none", color: "#fff", fontWeight: 700, fontSize: "0.85rem", cursor: "wait", fontFamily: "'Inter',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spinMtg 1s linear infinite" }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg> Generating Link...
          </button>
        ) : (
          <button onClick={confirm} style={{ width: "100%", padding: "11px", borderRadius: 10, background: "linear-gradient(135deg,#6C63FF,#00c6ff)", border: "none", color: "#fff", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", fontFamily: "'Inter',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <Calendar size={15} /> Confirm — {MONTHS[mo]} {selDay} at {time}
          </button>
        )}
      </div>
    </div>
  );
}

const navB = (isDark) => ({ width: 24, height: 24, borderRadius: "50%", border: "none", background: isDark ? "rgba(255,255,255,0.08)" : "rgba(108,99,255,0.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "inherit" });

/* ── MAIN MESSAGES PAGE ── */
export default function Messages() {
  const { theme, user: authUser, isInNetwork } = useAuth();
  const { isOnline, sendMessage: socketSend, sendTyping, addMessageListener, addBlockedListener, sendSwapRequest, sendMessageRequest } = useSocket() || {};
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const openUserId = params.get("user");

  const [allUsers, setAllUsers] = useState([]);
  const [convs, setConvs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [input, setInput] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [typing, setTyping] = useState(false);
  const [requestSent, setRequestSent] = useState({});
  const [blockedUsers, setBlockedUsers] = useState({});
  const [showMeetPanel, setShowMeetPanel] = useState(false);
  const [selectedUserModal, setSelectedUserModal] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);
  const isDark = theme === "dark";

  /* Fetch all users — fall back to mock data if server offline */
  useEffect(() => {
    fetch(`${API}/api/users`)
      .then((r) => r.json())
      .then(setAllUsers)
      .catch(() => setAllUsers(ALL_MOCK));
  }, []);

  /* Fetch all ongoing conversations on mount */
  useEffect(() => {
    if (!authUser || allUsers.length === 0) return;
    fetch(`${API}/api/conversations/${authUser.id}`)
      .then(r => r.json())
      .then(data => {
        const built = data.map(d => ({
          userId: d.userId,
          user: findUser(d.userId) || { id: d.userId, name: "Unknown", avatar: "?", avatarColor: "#555" },
          messages: d.messages,
          lastMsg: d.lastMsg,
          time: d.time
        }));
        setConvs(built);
      })
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser, allUsers.length]);

  /* Helper: get user object from any source */
  const findUser = useCallback((id) =>
    allUsers.find((u) => u.id === id) || ALL_MOCK.find((u) => u.id === id) || { id, name: id, avatar: "?", avatarColor: "#555" }
    , [allUsers]);

  const loadConv = useCallback(async (targetUser) => {
    if (!authUser || !targetUser?.id) return;
    const existing = convs.find((c) => c.userId === targetUser.id);
    if (existing) { setSelected(existing); return; }

    let msgs = [];
    try {
      msgs = await fetch(`${API}/api/messages/${authUser.id}/${targetUser.id}`).then((r) => r.json());
    } catch { }

    const newConv = {
      userId: targetUser.id,
      user: targetUser,
      messages: msgs,
      lastMsg: msgs.at(-1)?.text || "No messages yet",
      time: msgs.at(-1)?.time || "",
    };
    setConvs((cs) => [newConv, ...cs.filter((c) => c.userId !== targetUser.id)]);
    setSelected(newConv);
  }, [authUser, convs]);

  /* Auto-open from ?user= param */
  useEffect(() => {
    if (openUserId && allUsers.length) {
      const target = findUser(openUserId);
      if (target?.id) loadConv(target);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openUserId, allUsers]);

  /* Socket: incoming messages — DO NOT re-add own messages (already done optimistically) */
  useEffect(() => {
    if (!addMessageListener) return;
    const remove = addMessageListener(({ convId: cid, message }) => {
      // Skip messages sent by ME — already added optimistically
      if (message.from === authUser?.id) return;

      const [aId, bId] = cid.split("_");
      const partnerId = aId === authUser?.id ? bId : aId;

      setConvs((cs) => {
        const exists = cs.find((c) => c.userId === partnerId);
        if (exists) {
          return cs.map((c) =>
            c.userId === partnerId
              ? { ...c, messages: [...c.messages, message], lastMsg: message.text, time: message.time }
              : c
          );
        }
        // new conversation opened by partner — create it
        const partnerUser = findUser(partnerId);
        return [{ userId: partnerId, user: partnerUser, messages: [message], lastMsg: message.text, time: message.time }, ...cs];
      });

      setSelected((s) => {
        if (!s || s.userId !== partnerId) return s;
        return { ...s, messages: [...(s.messages || []), message], lastMsg: message.text, time: message.time };
      });
      setTyping(false);
    });
    return remove;
  }, [addMessageListener, authUser, findUser]);

  /* Socket: message_blocked — roll back optimistic message and flag the user as blocked */
  useEffect(() => {
    if (!addBlockedListener) return;
    const remove = addBlockedListener(({ from, to, reason }) => {
      // Remove optimistic message (last message from me to that user)
      const partnerId = to;
      setConvs((cs) => cs.map((c) =>
        c.userId === partnerId
          ? { ...c, messages: c.messages.slice(0, -1), lastMsg: c.messages.at(-2)?.text || "No messages yet", time: c.messages.at(-2)?.time || "" }
          : c
      ));
      setSelected((s) => {
        if (!s || s.userId !== partnerId) return s;
        const msgs = s.messages.slice(0, -1);
        return { ...s, messages: msgs, lastMsg: msgs.at(-1)?.text || "", time: msgs.at(-1)?.time || "" };
      });
      setBlockedUsers((b) => ({ ...b, [partnerId]: reason }));
    });
    return remove;
  }, [addBlockedListener]);

  /* Scroll to bottom */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selected?.messages]);

  const handleSend = () => {
    if (!input.trim() || !selected || !authUser) return;
    if (!isInNetwork(selected.userId)) return;

    const now = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    const msg = { id: `local_${Date.now()}`, from: authUser.id, to: selected.userId, text: input.trim(), time: now, createdAt: Date.now() };

    // Optimistic — append to convs if exists, else add new conv
    setConvs((cs) => {
      if (cs.some((c) => c.userId === selected.userId)) {
        return cs.map((c) => c.userId === selected.userId
          ? { ...c, messages: [...c.messages, msg], lastMsg: msg.text, time: now } : c);
      } else {
        return [{ userId: selected.userId, user: selected.user, messages: [msg], lastMsg: msg.text, time: now }, ...cs];
      }
    });

    setSelected((s) => ({ ...s, messages: [...(s?.messages || []), msg] }));

    socketSend?.(authUser.id, selected.userId, input.trim());
    setInput("");
  };

  const handleTyping = () => {
    if (!selected || !authUser) return;
    sendTyping?.(authUser.id, selected.userId);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => setTyping(false), 2500);
  };

  const handleRequestToMessage = () => {
    if (!selected || !authUser) return;
    sendMessageRequest?.(authUser.id, selected.userId);
    setRequestSent((r) => ({ ...r, [selected.userId]: "message" }));
  };

  const handleRequestToSwap = (targetUser) => {
    if (!authUser) return;
    sendSwapRequest?.(authUser.id, targetUser.id, authUser.skillsOffered?.[0] || "React", targetUser.skillsWanted?.[0] || "Help");
    setRequestSent((r) => ({ ...r, [targetUser.id]: "swap" }));
  };

  const isBlocked = selected ? !!blockedUsers[selected.userId] : false;
  const canMessage = selected ? (isInNetwork(selected.userId) && !isBlocked) : false;
  const contactsForModal = allUsers.filter(
    (u) => u.id !== authUser?.id && !convs.some((c) => c.userId === u.id) &&
      u.name.toLowerCase().includes(searchQ.toLowerCase())
  );

  // Theme vars
  const bg = isDark ? "#0c0c10" : "#F0F2FF";
  const sideBg = isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.92)";
  const border = isDark ? "rgba(255,255,255,0.07)" : "rgba(108,99,255,0.15)";
  const txt = isDark ? "#F0F0FF" : "#1A1A30";
  const muted = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)";

  return (
    <div style={{ height: "100vh", display: "flex", background: bg, fontFamily: "'Inter',sans-serif", color: txt, position: "relative", overflow: "hidden" }}>
      {selectedUserModal && <UserModal user={selectedUserModal} isDark={isDark} onClose={() => setSelectedUserModal(null)} />}

      {/* New Chat Modal */}
      {showNewChat && (
        <div style={S.overlay} onClick={() => setShowNewChat(false)}>
          <div style={{ ...S.modal, background: isDark ? "#1a1a28" : "#fff", border: `1px solid ${border}`, color: txt }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ fontWeight: 700 }}>Start New Chat</h3>
              <button style={S.iconBtn} onClick={() => setShowNewChat(false)}><X size={16} /></button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 10, background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", border: `1px solid ${border}`, marginBottom: 10 }}>
              <Search size={14} style={{ color: muted }} />
              <input style={{ border: "none", outline: "none", background: "transparent", color: txt, flex: 1, fontSize: "0.88rem", fontFamily: "'Inter',sans-serif" }}
                placeholder="Search..." value={searchQ} onChange={(e) => setSearchQ(e.target.value)} autoFocus />
            </div>
            <div style={{ maxHeight: 300, overflowY: "auto" }}>
              {contactsForModal.map((u) => (
                <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 8px", borderRadius: 10, cursor: "pointer" }}
                  onClick={() => { loadConv(u); setShowNewChat(false); }}>
                  <div style={{ position: "relative" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: u.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: "0.85rem" }}>{u.avatar}</div>
                    <div style={{ position: "absolute", bottom: -1, right: -1, width: 10, height: 10, borderRadius: "50%", background: isOnline?.(u.id) ? "#2ecc71" : "#555", border: "2px solid #1a1a28" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "0.88rem", fontWeight: 600, marginBottom: 1 }}>{u.name}</p>
                    <p style={{ fontSize: "0.72rem", color: muted }}>{u.role}</p>
                  </div>
                  {!isInNetwork(u.id) && <Lock size={13} color="#f5c518" />}
                </div>
              ))}
              {contactsForModal.length === 0 && <p style={{ textAlign: "center", color: muted, padding: "16px", fontSize: "0.85rem" }}>No more contacts</p>}
            </div>
          </div>
        </div>
      )}

      {/* LEFT — conversation list */}
      <div style={{ width: 280, minWidth: 280, borderRight: `1px solid ${border}`, background: sideBg, display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "18px 14px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 700 }}>Messages</h2>
          <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, border: "none", background: isDark ? "rgba(108,99,255,0.2)" : "rgba(108,99,255,0.1)", color: "#6C63FF", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer", fontFamily: "'Inter',sans-serif" }}
            onClick={() => { setShowNewChat(true); setSearchQ(""); }}>
            <Plus size={15} /> New
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {convs.length === 0 && (
            <p style={{ textAlign: "center", color: muted, padding: "24px 16px", fontSize: "0.82rem" }}>No conversations yet.<br />Tap + New to start one.</p>
          )}
          {convs.map((c) => {
            /* Always derive name from user object — fall back to id if missing */
            const displayName = c.user?.name || findUser(c.userId)?.name || c.userId;
            const displayAvatar = c.user?.avatar || findUser(c.userId)?.avatar || "?";
            const displayColor = c.user?.avatarColor || findUser(c.userId)?.avatarColor || "#555";
            const online = isOnline?.(c.userId);
            const connected = isInNetwork(c.userId);
            return (
              <div key={c.userId}
                style={{ padding: "11px 14px", cursor: "pointer", background: selected?.userId === c.userId ? (isDark ? "rgba(108,99,255,0.12)" : "rgba(108,99,255,0.07)") : "transparent", borderLeft: selected?.userId === c.userId ? "3px solid #6C63FF" : "3px solid transparent", display: "flex", gap: 10, alignItems: "center", transition: "background 0.15s" }}
                onClick={() => setSelected(c)}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: displayColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: "0.88rem" }}>{displayAvatar}</div>
                  <div style={{ position: "absolute", bottom: -1, right: -1, width: 10, height: 10, borderRadius: "50%", background: online ? "#2ecc71" : "#555", border: `2px solid ${bg}` }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                    {/* ✅ Always renders the name */}
                    <span style={{ fontWeight: 600, fontSize: "0.87rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: txt }}>{displayName}</span>
                    <span style={{ fontSize: "0.68rem", color: muted, flexShrink: 0, marginLeft: 4 }}>{c.time}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    {!connected && <Lock size={10} color="#f5c518" />}
                    <span style={{ fontSize: "0.74rem", color: muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.lastMsg}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT — chat area (relative so panel can position inside) */}
      {selected ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, position: "relative" }}>
          {/* Header */}
          <div style={{ padding: "14px 20px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", gap: 12, background: sideBg, zIndex: 10, position: "relative" }}>
            <div style={{ position: "relative", cursor: "pointer" }} onClick={() => setSelectedUserModal(selected.user || findUser(selected.userId))}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: selected.user?.avatarColor || "#555", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff" }}>{selected.user?.avatar || "?"}</div>
              <div style={{ position: "absolute", bottom: -1, right: -1, width: 11, height: 11, borderRadius: "50%", background: isOnline?.(selected.userId) ? "#2ecc71" : "#555", border: `2px solid ${bg}` }} />
            </div>
            <div style={{ flex: 1, cursor: "pointer" }} onClick={() => setSelectedUserModal(selected.user || findUser(selected.userId))}>
              <p style={{ fontWeight: 700, fontSize: "0.95rem" }}>{selected.user?.name || findUser(selected.userId)?.name}</p>
              <p style={{ fontSize: "0.75rem", color: isOnline?.(selected.userId) ? "#2ecc71" : muted }}>
                {isOnline?.(selected.userId) ? "● Online" : "○ Away"} · {selected.user?.role || ""}
              </p>
            </div>
            <button style={S.iconBtn}><Phone size={15} /></button>
            <button style={S.iconBtn}><Video size={15} /></button>
            <button
              style={{ ...S.iconBtn, color: showMeetPanel ? "#6C63FF" : "rgba(255,255,255,0.6)", borderColor: showMeetPanel ? "rgba(108,99,255,0.4)" : "rgba(255,255,255,0.1)", background: showMeetPanel ? "rgba(108,99,255,0.1)" : "transparent" }}
              onClick={() => setShowMeetPanel((v) => !v)}
            >
              <Calendar size={15} /> <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>Meet</span>
            </button>
          </div>

          {/* Messages area */}
          <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
            {selected.messages.length === 0 && (
              <div style={{ margin: "auto", textAlign: "center", color: muted }}>
                <div style={{ fontSize: "2.5rem", marginBottom: 10 }}>👋</div>
                <p style={{ fontSize: "0.9rem" }}>Say hello to {selected.user?.name}!</p>
              </div>
            )}
            {selected.messages.map((m, i) => {
              const isMe = m.from === authUser?.id || m.sender === "You";
              return (
                <div key={m.id || i} style={{ display: "flex", flexDirection: isMe ? "row-reverse" : "row", gap: 8, alignItems: "flex-end" }}>
                  {!isMe && (
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: selected.user?.avatarColor || "#555", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: "0.72rem", flexShrink: 0 }}>
                      {selected.user?.avatar || "?"}
                    </div>
                  )}
                  <div>
                    <div style={{ padding: "10px 15px", borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: isMe ? "linear-gradient(135deg,#6C63FF,#00c6ff)" : (isDark ? "rgba(255,255,255,0.07)" : "rgba(108,99,255,0.07)"), color: isMe ? "#fff" : txt, maxWidth: 360, fontSize: "0.88rem", lineHeight: 1.55, boxShadow: isMe ? "0 3px 10px rgba(108,99,255,0.2)" : "none", whiteSpace: "pre-wrap" }}>
                      {renderMessageWithLinks(m.text)}
                    </div>
                    <p style={{ fontSize: "0.65rem", color: muted, marginTop: 3, textAlign: isMe ? "right" : "left" }}>{m.time}</p>
                  </div>
                </div>
              );
            })}
            {typing && <p style={{ fontSize: "0.75rem", color: muted, fontStyle: "italic" }}>{selected.user?.name} is typing…</p>}
            <div ref={messagesEndRef} />
          </div>

          {/* Input / Restriction */}
          <div style={{ padding: "12px 20px 14px", borderTop: `1px solid ${border}`, background: sideBg, zIndex: 10, position: "relative" }}>
            {canMessage ? (
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input
                  style={{ flex: 1, padding: "12px 16px", borderRadius: 12, border: `1px solid ${border}`, background: isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.8)", color: txt, outline: "none", fontSize: "0.88rem", fontFamily: "'Inter',sans-serif" }}
                  placeholder={`Message ${selected.user?.name || ""}...`}
                  value={input}
                  onChange={(e) => { setInput(e.target.value); handleTyping(); }}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button style={{ width: 44, height: 44, borderRadius: 12, border: "none", background: "linear-gradient(135deg,#6C63FF,#00c6ff)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }} onClick={handleSend}>
                  <Send size={17} />
                </button>
              </div>
            ) : isBlocked ? (
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px", borderRadius: 12, background: "rgba(231,76,60,0.06)", border: "1px solid rgba(231,76,60,0.25)" }}>
                <Lock size={18} color="#e74c3c" style={{ flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: "0.88rem", marginBottom: 3, color: "#e74c3c" }}>User has removed you from connection</p>
                  <p style={{ fontSize: "0.78rem", color: muted }}>You can no longer send messages to this user.</p>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px", borderRadius: 12, background: "rgba(245,197,24,0.05)", border: "1px solid rgba(245,197,24,0.18)" }}>
                <Lock size={18} color="#f5c518" style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: "0.88rem", marginBottom: 3 }}>Not connected yet</p>
                  <p style={{ fontSize: "0.78rem", color: muted }}>Send a request to start chatting or propose a swap.</p>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: requestSent[selected.userId] === "message" ? "#2ecc71" : txt, fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Inter',sans-serif" }} disabled={!!requestSent[selected.userId]} onClick={handleRequestToMessage}>
                    <UserPlus size={13} />{requestSent[selected.userId] === "message" ? "Sent!" : "Request to Message"}
                  </button>
                  <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 12px", borderRadius: 8, border: "none", background: requestSent[selected.userId] === "swap" ? "rgba(46,204,113,0.15)" : "linear-gradient(135deg,#6C63FF,#00c6ff)", color: "#fff", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Inter',sans-serif" }} disabled={!!requestSent[selected.userId]} onClick={() => handleRequestToSwap(selected.user)}>
                    ⇄ {requestSent[selected.userId] === "swap" ? "Swap Requested!" : "Request Swap"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Inline Meeting Calendar Panel — slides in from right */}
          {showMeetPanel && (
            <MeetingPanel
              isDark={isDark}
              authUser={authUser}
              partnerUser={selected.user || findUser(selected.userId)}
              onClose={() => setShowMeetPanel(false)}
              onMeetingCreated={(mtg) => {
                const noteText = mtg.note ? `\nNote: ${mtg.note}` : "";
                const msgText = `📅 Let's meet on ${mtg.date} at ${mtg.time}.${noteText}\nJoin here: ${mtg.link}`;
                const now = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
                const msg = { id: `local_${Date.now()}`, from: authUser.id, to: selected.userId, text: msgText, time: now, createdAt: Date.now() };

                setConvs((cs) => {
                  if (cs.some((c) => c.userId === selected.userId)) {
                    return cs.map((c) => c.userId === selected.userId
                      ? { ...c, messages: [...c.messages, msg], lastMsg: msg.text, time: now } : c);
                  } else {
                    return [{ userId: selected.userId, user: selected.user, messages: [msg], lastMsg: msg.text, time: now }, ...cs];
                  }
                });

                setSelected((s) => ({ ...s, messages: [...(s?.messages || []), msg] }));

                socketSend?.(authUser.id, selected.userId, msgText);
              }}
            />
          )}
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: muted }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: 12 }}>💬</div>
            <p>Select a conversation or start a new one</p>
          </div>
        </div>
      )}
    </div>
  );
}

const S = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" },
  modal: { width: 370, borderRadius: 18, padding: "22px", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" },
  iconBtn: { display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 8, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontFamily: "'Inter',sans-serif", fontSize: "0.8rem" },
};

// src/context/AuthContext.js — updated to call real backend
import React, { createContext, useContext, useState, useEffect } from "react";
import { MOCK_FRIENDS, GLOBAL_USERS } from "../data/mockData";
import { API_URL } from "../config";

const AuthContext = createContext(null);
const API = API_URL;

const DEMO_FALLBACK = {
  id: "u0", name: "Bhumika Sharma",
  email: "bhumika@ncuindia.edu",
  avatar: "B", avatarColor: "#6C63FF",
  role: "B.Tech CSE", course: "CSE",
  location: "Gurugram, India", github: "github.com/bhumika", about: "Passionate about building scalable web applications.",
  skillsOffered: ["React", "JavaScript", "CSS"],
  skillsWanted: ["Python", "Machine Learning"],
  stats: { swaps: 12, rating: 4.8, reviews: 24 },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ss_user")) || null; } catch { return null; }
  });
  const [theme, setTheme] = useState(() => localStorage.getItem("ss_theme") || "dark");
  const [network, setNetwork] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ss_network")) || MOCK_FRIENDS.map((f) => f.id); } catch { return []; }
  });
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/users`)
      .then((r) => r.json())
      .then(setAllUsers)
      .catch(() => setAllUsers([...MOCK_FRIENDS, ...GLOBAL_USERS]));
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("ss_theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("ss_network", JSON.stringify(network));
  }, [network]);

  useEffect(() => {
    if (user) localStorage.setItem("ss_user", JSON.stringify(user));
    else localStorage.removeItem("ss_user");
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const handleConnUpdate = (e) => {
      const { userId, targetId, connected } = e.detail;
      if (userId !== user.id && targetId !== user.id) return;
      const otherId = userId === user.id ? targetId : userId;
      setNetwork((n) => {
        if (connected && !n.includes(otherId)) return [...n, otherId];
        if (!connected && n.includes(otherId)) return n.filter(id => id !== otherId);
        return n;
      });
    };
    window.addEventListener("ss_connection_update", handleConnUpdate);
    return () => window.removeEventListener("ss_connection_update", handleConnUpdate);
  }, [user]);

  // Try real backend first, fall back to demo mode
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        // Load network from server
        const connRes = await fetch(`${API}/api/connections/${data.user.id}`);
        if (connRes.ok) setNetwork(await connRes.json());
        return { ok: true };
      } else {
        const err = await res.json();
        return { ok: false, error: err.error };
      }
    } catch {
      // Server offline → demo login (any credentials)
      if (email && password && password.length >= 4) {
        const fallback = { ...DEMO_FALLBACK, email, name: email.split("@")[0] };
        setUser(fallback);
        return { ok: true, demo: true };
      }
      return { ok: false, error: "Server offline. Use any email + password (4+ chars) for demo." };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ss_user");
  };

  const signup = async (newUser) => {
    try {
      const res = await fetch(`${API}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (!res.ok) return { ok: false, error: data.error || "Signup failed" };
      setUser(data.user);
      setNetwork([]);
      setAllUsers((users) => [...users.filter((u) => u.id !== data.user.id), data.user]);
      return { ok: true };
    } catch {
      return { ok: false, error: "Server offline. Start the backend to create a new account." };
    }
  };

  const toggleTheme = () =>
    setTheme((t) => (t === "dark" ? "light" : "dark"));

  const addToNetwork = (id) =>
    setNetwork((n) => (n.includes(id) ? n : [...n, id]));

  const removeFromNetwork = (id) =>
    setNetwork((n) => n.filter((x) => x !== id));

  const isInNetwork = (id) => network.includes(id);

  return (
    <AuthContext.Provider value={{
      user, login, logout, signup,
      theme, toggleTheme,
      network, addToNetwork, removeFromNetwork, isInNetwork,
      allUsers,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

// server.js — SkillSync Real-time Backend (Socket.io + Express)
// Run with: node server.js
const express = require("express");
const http = require("http");
const fs = require("fs");
const path = require("path");
const { Server } = require("socket.io");
const cors = require("cors");

const DATA_FILE = path.join(__dirname, "data.json");
const app = express();
const CLIENT_ORIGINS = (process.env.CLIENT_ORIGIN || "http://localhost:3000,http://localhost:3001")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({ origin: CLIENT_ORIGINS, credentials: true }));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: CLIENT_ORIGINS, methods: ["GET", "POST"] },
});

const DEFAULT_USERS = {
    "bhumika@ncuindia.edu": {
        id: "u0", name: "Bhumika Sharma", password: "bhumika123", email: "bhumika@ncuindia.edu",
        avatar: "B", avatarColor: "#6C63FF", role: "Software Engineer", course: "B.Tech CSE",
        location: "Gurugram, India", github: "github.com/bhumika", about: "Passionate about building scalable web applications. Open to learning and sharing knowledge.",
        status: "Professional", experience: "4 Years",
        skillsOffered: ["React", "JavaScript", "CSS"], skillsWanted: ["Python", "Machine Learning"],
        stats: { swaps: 12, rating: 4.8, reviews: 24 },
    },
    "nikhil@ncuindia.edu": {
        id: "u1", name: "Nikhil Mehta", password: "nikhil123", email: "nikhil@ncuindia.edu",
        avatar: "N", avatarColor: "#FF6B6B", role: "Frontend Dev", course: "B.Tech CSE",
        location: "Delhi, India", github: "github.com/nikhilm", about: "Full-stack enthusiast focusing on performant architectures.",
        status: "Student", experience: "2 Years",
        skillsOffered: ["React", "TypeScript", "Node.js"], skillsWanted: ["Python", "ML", "AWS"],
        stats: { swaps: 8, rating: 4.7, reviews: 16 },
    },
    "priya@ncuindia.edu": {
        id: "u2", name: "Priya Agarwal", password: "priya123", email: "priya@ncuindia.edu",
        avatar: "P", avatarColor: "#00c6ff", role: "Data Scientist", course: "B.Tech AI",
        location: "Noida, India", github: "github.com/priya-ai", about: "Data science and AI researcher building smart models.",
        status: "Student", experience: "3 Years",
        skillsOffered: ["Python", "Machine Learning", "Pandas"], skillsWanted: ["React", "Node.js", "Flutter"],
        stats: { swaps: 15, rating: 4.9, reviews: 30 },
    },
    "simran@ncuindia.edu": {
        id: "u3", name: "Simran Kaur", password: "simran123", email: "simran@ncuindia.edu",
        avatar: "S", avatarColor: "#2ecc71", role: "UI/UX Designer", course: "B.Des",
        location: "Chandigarh, India", github: "dribbble.com/simran", about: "UI/UX designer obsessed with pixel-perfect and accessible interfaces.",
        status: "Professional", experience: "1.5 Years",
        skillsOffered: ["Figma", "UI/UX Design", "CSS"], skillsWanted: ["JavaScript", "React"],
        stats: { swaps: 5, rating: 4.6, reviews: 10 },
    },
    "aryan@ncuindia.edu": {
        id: "u4", name: "Aryan Singh", password: "aryan123", email: "aryan@ncuindia.edu",
        avatar: "A", avatarColor: "#f5c518", role: "DevOps Engineer", course: "B.Tech ECE",
        location: "Gurugram, India", github: "github.com/aryan-ops", about: "DevOps specialist focused on CI/CD, Docker, and AWS.",
        status: "Student", experience: "2 Years",
        skillsOffered: ["DevOps", "Docker", "AWS", "Linux"], skillsWanted: ["React", "Python"],
        stats: { swaps: 6, rating: 4.5, reviews: 12 },
    },
};

// userId → socketId
let USERS = { ...DEFAULT_USERS };
const onlineUsers = {};

// Default connections
const DEFAULT_CONNECTIONS = {
    u0: new Set(["u1", "u2", "u3"]),
    u1: new Set(["u0", "u2"]),
    u2: new Set(["u0", "u1"]),
    u3: new Set(["u0"]),
    u4: new Set([]),
};
let connections = cloneConnections(DEFAULT_CONNECTIONS);

function convId(a, b) {
    return [a, b].sort().join("_");
}

// Messages are loaded from and saved to backend/data.json.
let messages = {};

// Meetings
let meetings = [];

// Requests (swap / message)
let requests = [];

function cloneConnections(source) {
    return Object.fromEntries(
        Object.entries(source).map(([id, values]) => [id, new Set([...values])])
    );
}

function serializeConnections(source) {
    return Object.fromEntries(
        Object.entries(source).map(([id, set]) => [id, [...set]])
    );
}

function safeUser(user) {
    const { password: _, ...safe } = user;
    return safe;
}

function loadData() {
    if (!fs.existsSync(DATA_FILE)) return;
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
        USERS = { ...DEFAULT_USERS, ...(data.users || {}) };
        connections = cloneConnections(DEFAULT_CONNECTIONS);
        Object.entries(data.connections || {}).forEach(([id, values]) => {
            connections[id] = new Set(values);
        });
        messages = data.messages || {};
        meetings = data.meetings || [];
        requests = data.requests || [];
    } catch (error) {
        console.warn("Could not load data.json. Starting with demo data only.", error.message);
    }
}

function saveData() {
    const data = {
        users: USERS,
        connections: serializeConnections(connections),
        messages,
        meetings,
        requests,
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

loadData();

/* ── REST API ── */
app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    const user = USERS[email];
    if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid email or password" });
    }
    res.json({ user: safeUser(user), token: Buffer.from(email).toString("base64") });
});

app.post("/api/signup", (req, res) => {
    const { name, email, password } = req.body;
    const cleanName = String(name || "").trim();
    const cleanEmail = String(email || "").trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password) {
        return res.status(400).json({ error: "Name, email, and password are required" });
    }
    if (String(password).length < 4) {
        return res.status(400).json({ error: "Password must be at least 4 characters" });
    }
    if (USERS[cleanEmail]) {
        return res.status(409).json({ error: "An account with this email already exists" });
    }

    const id = `u_${Date.now()}`;
    const user = {
        id,
        name: cleanName,
        password,
        email: cleanEmail,
        avatar: cleanName[0].toUpperCase(),
        avatarColor: "#6C63FF",
        role: "Student",
        course: "Not specified",
        location: "Not specified",
        github: "",
        about: "New SkillSync member.",
        status: "Student",
        experience: "Beginner",
        skillsOffered: [],
        skillsWanted: [],
        stats: { swaps: 0, rating: 0, reviews: 0 },
    };

    USERS[cleanEmail] = user;
    connections[id] = new Set();
    saveData();
    res.status(201).json({ user: safeUser(user), token: Buffer.from(cleanEmail).toString("base64") });
});

app.get("/api/users", (req, res) => {
    const allUsers = Object.values(USERS).map((u) => ({
        ...safeUser(u), online: !!onlineUsers[u.id],
    }));
    res.json(allUsers);
});

app.get("/api/connections/:userId", (req, res) => {
    const set = connections[req.params.userId] || new Set();
    res.json([...set]);
});

app.post("/api/connections/:userId/add/:targetId", (req, res) => {
    const { userId, targetId } = req.params;
    if (!connections[userId]) connections[userId] = new Set();
    if (!connections[targetId]) connections[targetId] = new Set();
    connections[userId].add(targetId);
    connections[targetId].add(userId);
    saveData();
    io.emit("connection_updated", { userId, targetId, connected: true });
    res.json({ ok: true });
});

app.delete("/api/connections/:userId/remove/:targetId", (req, res) => {
    const { userId, targetId } = req.params;
    connections[userId]?.delete(targetId);
    connections[targetId]?.delete(userId);
    saveData();
    io.emit("connection_updated", { userId, targetId, connected: false });
    res.json({ ok: true });
});

app.get("/api/messages/:aId/:bId", (req, res) => {
    const id = convId(req.params.aId, req.params.bId);
    res.json(messages[id] || []);
});

app.get("/api/conversations/:userId", (req, res) => {
    const { userId } = req.params;
    const userConvs = [];
    Object.keys(messages).forEach(cid => {
        if (cid.includes(userId)) {
            const msgs = messages[cid];
            if (msgs.length > 0) {
                const partnerId = cid.replace(userId, "").replace("_", "");
                userConvs.push({
                    userId: partnerId,
                    messages: msgs,
                    lastMsg: msgs.at(-1)?.text,
                    time: msgs.at(-1)?.time
                });
            }
        }
    });
    // Sort by latest message
    userConvs.sort((a, b) => (b.messages.at(-1)?.createdAt || 0) - (a.messages.at(-1)?.createdAt || 0));
    res.json(userConvs);
});

app.get("/api/meetings/:userId", (req, res) => {
    const uid = req.params.userId;
    res.json(meetings.filter((m) => m.from === uid || m.to === uid));
});

app.post("/api/meetings", (req, res) => {
    const mtg = { id: `mtg_${Date.now()}`, ...req.body, createdAt: Date.now() };
    meetings.push(mtg);
    // Notify both participants
    [mtg.from, mtg.to].forEach((uid) => {
        const sid = onlineUsers[uid];
        if (sid) io.to(sid).emit("meeting_created", mtg);
    });
    saveData();
    res.json(mtg);
});

app.get("/api/requests/:userId", (req, res) => {
    res.json(requests.filter((r) => r.to === req.params.userId && r.status === "pending"));
});

/* ── SOCKET.IO ── */
io.on("connection", (socket) => {
    socket.on("authenticate", ({ userId }) => {
        if (!userId) return;
        socket.userId = userId;
        onlineUsers[userId] = socket.id;
        io.emit("user_status", { userId, online: true });
        socket.emit("online_users", Object.keys(onlineUsers));
    });

    socket.on("send_message", ({ from, to, text }) => {
        // Block messaging if users are not connected
        const fromConns = connections[from] || new Set();
        const toConns = connections[to] || new Set();
        if (!fromConns.has(to) || !toConns.has(from)) {
            const sid = onlineUsers[from];
            if (sid) io.to(sid).emit("message_blocked", { from, to, reason: "User has removed you from connection" });
            return;
        }

        const cid = convId(from, to);
        if (!messages[cid]) messages[cid] = [];
        const now = new Date();
        const time = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
        const msg = { id: `m_${Date.now()}`, from, to, text, time, createdAt: Date.now() };
        messages[cid].push(msg);
        saveData();
        // Deliver to both users
        [from, to].forEach((uid) => {
            const sid = onlineUsers[uid];
            if (sid) io.to(sid).emit("new_message", { convId: cid, message: msg });
        });
    });

    socket.on("typing", ({ from, to }) => {
        const sid = onlineUsers[to];
        if (sid) io.to(sid).emit("user_typing", { from });
    });

    socket.on("swap_request", ({ from, to, offer, want }) => {
        const fromUser = Object.values(USERS).find(u => u.id === from);
        const fromName = fromUser ? fromUser.name : from;
        const req = { id: `req_${Date.now()}`, from, to, fromName, offer, want, type: "swap", status: "pending", createdAt: Date.now() };
        requests.push(req);
        saveData();
        const sid = onlineUsers[to];
        if (sid) io.to(sid).emit("incoming_request", req);
    });

    socket.on("message_request", ({ from, to }) => {
        // Look up sender's name from USERS
        const fromUser = Object.values(USERS).find(u => u.id === from);
        const fromName = fromUser ? fromUser.name : from;
        const req = { id: `req_${Date.now()}`, from, to, fromName, type: "message", status: "pending", createdAt: Date.now() };
        requests.push(req);
        saveData();
        const sid = onlineUsers[to];
        if (sid) io.to(sid).emit("incoming_request", req);
    });

    socket.on("accept_request", ({ requestId, userId }) => {
        const req = requests.find((r) => r.id === requestId);
        if (req) {
            req.status = "accepted";
            // Add as connection if swap request
            if (req.type === "swap" || req.type === "message") {
                if (!connections[req.from]) connections[req.from] = new Set();
                if (!connections[req.to]) connections[req.to] = new Set();
                connections[req.from].add(req.to);
                connections[req.to].add(req.from);
                io.emit("connection_updated", { userId: req.from, targetId: req.to, connected: true });
            }
            saveData();
            const sid = onlineUsers[req.from];
            if (sid) io.to(sid).emit("request_accepted", req);
        }
    });

    socket.on("disconnect", () => {
        if (socket.userId) {
            delete onlineUsers[socket.userId];
            io.emit("user_status", { userId: socket.userId, online: false });
        }
    });
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
    console.log(`\n🚀 SkillSync backend running on http://localhost:${PORT}`);
    console.log("\n📋 User Credentials:");
    Object.entries(USERS).forEach(([email, u]) => {
        console.log(`   ${u.name}: ${email} / ${u.password}`);
    });
});

// src/data/mockData.js
// Central mock data for SkillSync

export const MOCK_USER = {
    id: "u0",
    name: "Bhumika Sharma",
    email: "bhumika@ncuindia.edu",
    tagline: "B.Tech CSE '25 · Full Stack Developer",
    avatar: "B",
    skillsOffered: ["React", "JavaScript", "UI/UX Design", "CSS"],
    skillsWanted: ["Python", "Machine Learning", "AWS"],
    stats: { swaps: 12, rating: 4.8, reviews: 24 },
    online: true,
};

export const MOCK_FRIENDS = [
    { id: "u1", name: "Nikhil Mehta", email: "nikhil@ncuindia.edu", avatar: "N", avatarColor: "#FF6B6B", role: "Frontend Dev", course: "B.Tech CSE", location: "Delhi, India", github: "github.com/nikhilm", about: "Full-stack enthusiast focusing on performant architectures.", status: "Student", experience: "2 Years", skillsOffered: ["React", "TypeScript", "Node.js"], skillsWanted: ["Python", "ML", "AWS"], online: true, rating: 4.7 },
    { id: "u2", name: "Priya Agarwal", email: "priya@ncuindia.edu", avatar: "P", avatarColor: "#00c6ff", role: "Data Scientist", course: "B.Tech AI", location: "Noida, India", github: "github.com/priya-ai", about: "Data science and AI researcher building smart models.", status: "Student", experience: "3 Years", skillsOffered: ["Python", "Machine Learning", "Pandas"], skillsWanted: ["React", "Node.js", "Flutter"], online: false, rating: 4.9 },
    { id: "u3", name: "Simran Kaur", email: "simran@ncuindia.edu", avatar: "S", avatarColor: "#2ecc71", role: "UI/UX Designer", course: "B.Des", location: "Chandigarh, India", github: "dribbble.com/simran", about: "UI/UX designer obsessed with pixel-perfect and accessible interfaces.", status: "Professional", experience: "1.5 Years", skillsOffered: ["Figma", "UI/UX Design", "CSS"], skillsWanted: ["JavaScript", "React"], online: true, rating: 4.6 },
    { id: "u4", name: "Aryan Singh", email: "aryan@ncuindia.edu", avatar: "A", avatarColor: "#f5c518", role: "DevOps Engineer", course: "B.Tech ECE", location: "Gurugram, India", github: "github.com/aryan-ops", about: "DevOps specialist focused on CI/CD, Docker, and AWS.", status: "Student", experience: "2 Years", skillsOffered: ["DevOps", "Docker", "AWS", "Linux"], skillsWanted: ["React", "Python"], online: true, rating: 4.5 },
];

export const GLOBAL_USERS = [
    {
        id: "g1",
        name: "Rohan Gupta",
        role: "Backend Developer",
        course: "B.Tech CSE",
        avatar: "R",
        avatarColor: "#f39c12",
        skillsOffered: ["Node.js", "PostgreSQL", "REST APIs"],
        skillsWanted: ["React", "Vue.js"],
        rating: 4.5,
        online: true,
    },
    {
        id: "g2",
        name: "Meera Desai",
        role: "App Developer",
        course: "B.Tech ECE",
        avatar: "M",
        avatarColor: "#9b59b6",
        skillsOffered: ["Flutter", "Dart", "Firebase"],
        skillsWanted: ["Machine Learning", "Python"],
        rating: 4.7,
        online: false,
    },
    {
        id: "g3",
        name: "Yashika Jain",
        role: "Competitive Coder",
        course: "B.Tech CSE",
        avatar: "Y",
        avatarColor: "#1abc9c",
        skillsOffered: ["C++", "DSA", "Competitive Programming"],
        skillsWanted: ["Web Dev", "React"],
        rating: 4.9,
        online: true,
    },
    {
        id: "g4",
        name: "Harsh Verma",
        role: "Marketing Strategist",
        course: "MBA",
        avatar: "H",
        avatarColor: "#e74c3c",
        skillsOffered: ["Digital Marketing", "SEO", "Content"],
        skillsWanted: ["Data Analysis", "Excel Macros"],
        rating: 4.4,
        online: false,
    },
    {
        id: "g5",
        name: "Ananya Rao",
        role: "Graphic Designer",
        course: "B.Des",
        avatar: "An",
        avatarColor: "#e91e8c",
        skillsOffered: ["Illustrator", "Photoshop", "Motion Graphics"],
        skillsWanted: ["React", "Frontend Dev"],
        rating: 4.6,
        online: true,
    },
    {
        id: "g6",
        name: "Karan Talwar",
        role: "Finance Analyst",
        course: "BBA",
        avatar: "K",
        avatarColor: "#3498db",
        skillsOffered: ["Financial Modeling", "Python", "Power BI"],
        skillsWanted: ["Public Speaking", "Leadership"],
        rating: 4.3,
        online: false,
    },
];

export const SUGGESTED_SWAPS = [
    {
        id: "sw1",
        from: MOCK_FRIENDS[0], // Nikhil
        offer: "React Advanced Patterns",
        want: "Machine Learning Basics",
        matchScore: 95,
        message: "Hey! I saw you're learning ML. I can teach you React hooks & performance patterns in return.",
        date: "2h ago",
    },
    {
        id: "sw2",
        from: MOCK_FRIENDS[1], // Priya
        offer: "Python + Data Analysis",
        want: "UI/UX Design principles",
        matchScore: 88,
        message: "I'm building a data app and need design help. Happy to teach Python scraping & pandas!",
        date: "5h ago",
    },
    {
        id: "sw3",
        from: GLOBAL_USERS[0], // Rohan
        offer: "Node.js REST API design",
        want: "React (Frontend)",
        matchScore: 82,
        message: "Want to pair up? I'll teach backend architecture if you walk me through React state management.",
        date: "1d ago",
    },
    {
        id: "sw4",
        from: GLOBAL_USERS[2], // Yashika
        offer: "DSA & Competitive Coding",
        want: "Web Development",
        matchScore: 76,
        message: "Let's do skill swap! I'll help crack DSA rounds, you show me the web dev basics.",
        date: "2d ago",
    },
];

// Pre-seeded conversations (only 2 – others are started via New Chat)
export const MOCK_CONVERSATIONS = [
    {
        id: "c1",
        user: MOCK_FRIENDS[0],
        messages: [
            { sender: "Nikhil Mehta", text: "Hey! Loved your UI/UX portfolio btw 🔥", time: "10:20 AM" },
            { sender: "You", text: "Thanks Nikhil! Saw your React talk, mind blowing.", time: "10:22 AM" },
            { sender: "Nikhil Mehta", text: "Haha, let's set up a swap session this week?", time: "10:23 AM" },
        ],
        lastMessage: "Haha, let's set up a swap session this week?",
        time: "10:23 AM",
    },
    {
        id: "c2",
        user: MOCK_FRIENDS[1],
        messages: [
            { sender: "Priya Agarwal", text: "Hey, I saw your swap request. I'm in!", time: "Yesterday" },
            { sender: "You", text: "Awesome! How about Saturday 3 PM?", time: "Yesterday" },
            { sender: "Priya Agarwal", text: "Works for me 🙌", time: "Yesterday" },
        ],
        lastMessage: "Works for me 🙌",
        time: "Yesterday",
    },
];

// src/pages/LandingPage.js
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight, Zap, Users, RefreshCw, TrendingUp,
    Star, Mail, Github, Linkedin, ChevronDown,
    Brain, MessageSquare, Award, Sparkles,
} from "lucide-react";

/* -------------------------------------------------------
   Floating-particles hero background
------------------------------------------------------- */
function HeroCanvas() {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let w = (canvas.width = window.innerWidth);
        let h = (canvas.height = window.innerHeight);

        const COLORS = ["108,99,255", "0,198,255", "168,158,255"];
        const particles = Array.from({ length: 90 }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.12,
            vy: -(Math.random() * 0.15 + 0.04),
            size: 0.8 + Math.random() * 2.2,
            opacity: 0.15 + Math.random() * 0.45,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            pulse: Math.random() * Math.PI * 2,
        }));

        let raf;
        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                p.pulse += 0.015;
                const op = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));

                if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
                if (p.x < -10) p.x = w + 10;
                if (p.x > w + 10) p.x = -10;

                // Core dot
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.color},${op})`;
                ctx.fill();

                // Soft glow halo
                const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5);
                g.addColorStop(0, `rgba(${p.color},${op * 0.25})`);
                g.addColorStop(1, `rgba(${p.color},0)`);
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2);
                ctx.fillStyle = g;
                ctx.fill();
            });
            raf = requestAnimationFrame(draw);
        };
        draw();

        const onResize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", onResize);
        return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
    }, []);
    return (
        <canvas
            ref={canvasRef}
            style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}
        />
    );
}

/* -------------------------------------------------------
   Scroll-reveal hook
------------------------------------------------------- */
function useReveal() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold: 0.12 }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return [ref, visible];
}

/* ---- Reusable section reveal wrapper ---- */
const Reveal = ({ children, delay = 0, style = {} }) => {
    const [ref, visible] = useReveal();
    return (
        <div
            ref={ref}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(36px)",
                transition: `opacity 0.7s ${delay}s ease, transform 0.7s ${delay}s ease`,
                ...style,
            }}
        >
            {children}
        </div>
    );
};

/* -------------------------------------------------------
   MAIN LANDING PAGE
------------------------------------------------------- */
export default function LandingPage() {
    const scrollToHIW = () =>
        document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });

    return (
        <div style={S.page}>

            {/* ============ SEGMENT 1 — HERO ============ */}
            <section style={S.hero}>
                <HeroCanvas />

                {/* Blob decorations */}
                <div style={S.blob1} />
                <div style={S.blob2} />

                <nav style={S.nav}>
                    <div style={S.navBrand}>
                        <div style={S.navIcon}><Zap size={18} color="#fff" fill="#fff" /></div>
                        <span style={S.navLogo}>SkillSync</span>
                    </div>
                    <div style={S.navLinks}>
                        <a href="#how-it-works" style={S.navLink}>How It Works</a>
                        <a href="#features" style={S.navLink}>Features</a>
                        <a href="#testimonials" style={S.navLink}>Reviews</a>
                        <a href="#contact" style={S.navLink}>Contact</a>
                    </div>
                    <Link to="/login" style={{ textDecoration: "none" }}>
                        <button style={S.navCta}>Enter the Network →</button>
                    </Link>
                </nav>

                <div style={S.heroContent}>
                    <div style={S.heroBadge} className="fade-up">
                        <Sparkles size={14} color="#6C63FF" />
                        <span>NCU's Premier Skill Exchange Platform</span>
                    </div>

                    <h1 style={S.heroTitle} className="fade-up-delay-1">
                        Your Skills are
                        <br />
                        <span style={S.heroGradient}>Currency.</span>
                        <br />
                        Trade them for
                        <span style={S.heroGradient}> Growth.</span>
                    </h1>

                    <p style={S.heroSub} className="fade-up-delay-2">
                        Connect with peers who have what you want to learn.
                        Teach what you know. No money involved — pure knowledge exchange.
                    </p>

                    <div style={S.heroBtns} className="fade-up-delay-3">
                        <Link to="/login" style={{ textDecoration: "none" }}>
                            <button style={S.btnPrimary}>
                                Enter the Network <ArrowRight size={18} />
                            </button>
                        </Link>
                        <button style={S.btnGhost} onClick={scrollToHIW}>
                            See How It Works
                        </button>
                    </div>

                    {/* Stats row */}
                    <div style={S.statsRow} className="fade-up-delay-4">
                        <StatPill label="Active Swappers" value="1,200+" />
                        <div style={S.statDiv} />
                        <StatPill label="Skills Listed" value="340+" />
                        <div style={S.statDiv} />
                        <StatPill label="Sessions Done" value="5,800+" />
                        <div style={S.statDiv} />
                        <StatPill label="Avg Rating" value="4.8 ★" />
                    </div>
                </div>

                <button style={S.scrollDown} onClick={scrollToHIW}>
                    <ChevronDown size={24} style={{ animation: "floatY 2s ease-in-out infinite" }} />
                </button>
            </section>

            {/* ============ SEGMENT 2 — HOW IT WORKS ============ */}
            <section id="how-it-works" style={S.section}>
                <Reveal>
                    <div style={S.sectionLabel}>The Process</div>
                    <h2 style={S.sectionTitle}>How SkillSync Works</h2>
                    <p style={S.sectionSub}>Three steps to your next skill upgrade — no fees, just knowledge.</p>
                </Reveal>

                <div style={S.stepsWrapper}>
                    {STEPS.map((step, i) => (
                        <Reveal key={step.title} delay={i * 0.12} style={{ flex: 1 }}>
                            <StepCard {...step} index={i + 1} />
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* ============ SEGMENT 3 — FEATURES SHOWCASE ============ */}
            <section id="features" style={{ ...S.section, background: "linear-gradient(180deg, transparent 0%, rgba(108,99,255,0.04) 50%, transparent 100%)" }}>
                <Reveal>
                    <div style={S.sectionLabel}>What's Inside</div>
                    <h2 style={S.sectionTitle}>Built for Serious Learners</h2>
                    <p style={S.sectionSub}>Every feature is designed to make skill exchange effortless and rewarding.</p>
                </Reveal>

                <div style={S.featuresStack}>
                    {FEATURES.map((feat, i) => (
                        <FeatureRow key={feat.title} {...feat} reverse={i % 2 !== 0} index={i} />
                    ))}
                </div>
            </section>

            {/* ============ SEGMENT 4 — TESTIMONIALS ============ */}
            <section id="testimonials" style={S.section}>
                <Reveal>
                    <div style={S.sectionLabel}>Social Proof</div>
                    <h2 style={S.sectionTitle}>What NCU Students Say</h2>
                    <p style={S.sectionSub}>Real stories from people who swapped their way to success.</p>
                </Reveal>

                <div style={S.testimonialsGrid}>
                    {TESTIMONIALS.map((t, i) => (
                        <Reveal key={t.name} delay={i * 0.1}>
                            <TestimonialCard {...t} />
                        </Reveal>
                    ))}
                </div>

                {/* Skill tags — 2 rows, different speeds */}
                <Reveal style={{ marginTop: "56px", overflow: "hidden" }}>
                    <p style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "0.78rem", letterSpacing: "2px", marginBottom: "16px" }}>
                        SKILLS ON THE PLATFORM
                    </p>
                    <div style={S.marqueeWrapper}>
                        {/* Row 1 — scrolls left at 50s */}
                        <div style={{ ...S.marqueeTrack, animationDuration: "50s" }}>
                            {[...SKILL_TAGS_ROW1, ...SKILL_TAGS_ROW1].map((tag, i) => (
                                <span key={i} style={S.marqueeTag}>{tag}</span>
                            ))}
                        </div>
                        {/* Row 2 — scrolls right (reversed) at 70s */}
                        <div style={{ ...S.marqueeTrack, animationDuration: "72s", animationDirection: "reverse", marginTop: "10px" }}>
                            {[...SKILL_TAGS_ROW2, ...SKILL_TAGS_ROW2].map((tag, i) => (
                                <span key={i} style={{ ...S.marqueeTag, background: "rgba(0,198,255,0.08)", color: "#7dd3fc", border: "1px solid rgba(0,198,255,0.18)" }}>{tag}</span>
                            ))}
                        </div>
                    </div>
                </Reveal>
            </section>

            {/* ============ SEGMENT 5 — CONTACT + FOOTER ============ */}
            <section id="contact" style={S.contactSection}>
                <div style={S.contactInner}>
                    <Reveal style={{ flex: 1 }}>
                        <div style={S.sectionLabel}>Get In Touch</div>
                        <h2 style={{ ...S.sectionTitle, textAlign: "left", marginBottom: "12px" }}>
                            Have Questions?
                        </h2>
                        <p style={{ ...S.sectionSub, textAlign: "left", marginBottom: "32px" }}>
                            We'd love to hear from you — drop us a message and we'll respond within 24 hours.
                        </p>
                        <div style={S.socialLinks}>
                            <SocialBtn icon={<Mail size={18} />} label="skillsync@ncuindia.edu" href="mailto:skillsync@ncuindia.edu" />
                            <SocialBtn icon={<Github size={18} />} label="github.com/skillsync" href="#" />
                            <SocialBtn icon={<Linkedin size={18} />} label="linkedin/skillsync" href="#" />
                        </div>
                    </Reveal>

                    <Reveal delay={0.15} style={{ flex: 1 }}>
                        <form style={S.contactForm} onSubmit={(e) => e.preventDefault()}>
                            <h3 style={{ fontSize: "1.15rem", fontWeight: 600, marginBottom: "20px" }}>Send a Message</h3>
                            <input style={S.formInput} placeholder="Your Name" />
                            <input style={S.formInput} placeholder="your@email.com" type="email" />
                            <textarea style={{ ...S.formInput, height: "110px", resize: "vertical" }} placeholder="Your message..." />
                            <button type="submit" style={S.btnPrimary}>
                                Send Message <ArrowRight size={16} />
                            </button>
                        </form>
                    </Reveal>
                </div>

                {/* Footer strip */}
                <div style={S.footer}>
                    <div style={S.footerBrand}>
                        <div style={S.navIcon}><Zap size={16} color="#fff" fill="#fff" /></div>
                        <span style={{ fontWeight: 700, fontSize: "1rem", background: "linear-gradient(135deg,#6C63FF,#00c6ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>SkillSync</span>
                    </div>
                    <p style={S.footerText}>© 2025 SkillSync • B.Tech CSE Major Project • NCU Gurgaon</p>
                    <Link to="/login">
                        <button style={S.btnPrimary}>Enter the Network →</button>
                    </Link>
                </div>
            </section>
        </div>
    );
}

/* ---- Helper sub-components ---- */

const StatPill = ({ label, value }) => (
    <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "1.4rem", fontWeight: 800, background: "linear-gradient(135deg,#6C63FF,#00c6ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{value}</div>
        <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)", marginTop: "2px", letterSpacing: "0.5px" }}>{label}</div>
    </div>
);

const StepCard = ({ index, icon: Icon, title, desc, color }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            style={{
                ...S.stepCard,
                transform: hovered ? "translateY(-8px)" : "none",
                boxShadow: hovered ? `0 20px 50px ${color}22` : "0 8px 32px rgba(0,0,0,0.3)",
                borderColor: hovered ? `${color}33` : "rgba(255,255,255,0.08)",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div style={{ ...S.stepNum }}>{String(index).padStart(2, "0")}</div>
            <div style={{ ...S.iconCircle, background: `${color}18`, border: `1px solid ${color}33` }}>
                <Icon size={26} color={color} style={{ animation: hovered ? "spinSlow 2s linear infinite" : "none" }} />
            </div>
            <h3 style={S.stepTitle}>{title}</h3>
            <p style={S.stepDesc}>{desc}</p>
        </div>
    );
};

const FeatureRow = ({ icon: Icon, title, desc, bullets, color, reverse, index }) => {
    const [ref, visible] = useReveal();
    return (
        <div
            ref={ref}
            style={{
                ...S.featureRow,
                flexDirection: reverse ? "row-reverse" : "row",
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : (reverse ? "translateX(40px)" : "translateX(-40px)"),
                transition: `opacity 0.75s ${index * 0.1}s ease, transform 0.75s ${index * 0.1}s ease`,
            }}
        >
            <div style={{ ...S.featureVisual, background: `${color}0D`, border: `1px solid ${color}22` }}>
                <div style={{ ...S.featureIconBig, color }}>
                    <Icon size={52} />
                </div>
                <div style={{ ...S.featureGlow, background: color }} />
            </div>
            <div style={S.featureText}>
                <div style={{ ...S.featureTag, color, background: `${color}15`, border: `1px solid ${color}30` }}>{title}</div>
                <h3 style={S.featureHeading}>{title}</h3>
                <p style={S.featureDesc}>{desc}</p>
                <ul style={S.featureBullets}>
                    {bullets.map((b) => (
                        <li key={b} style={S.featureBullet}>
                            <span style={{ color, marginRight: 8 }}>✦</span>{b}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const TestimonialCard = ({ name, role, text, rating, color }) => (
    <div style={S.testimonialCard}>
        <div style={S.quoteIcon}>"</div>
        <p style={S.testimonialText}>{text}</p>
        <div style={S.testimonialStars}>
            {Array.from({ length: rating }).map((_, i) => (
                <Star key={i} size={14} fill="#f5c518" color="#f5c518" />
            ))}
        </div>
        <div style={S.testimonialAuthor}>
            <div style={{ ...S.testimonialAvatar, background: color }}>{name[0]}</div>
            <div>
                <p style={S.testimonialName}>{name}</p>
                <p style={S.testimonialRole}>{role}</p>
            </div>
        </div>
    </div>
);

const SocialBtn = ({ icon, label, href }) => (
    <a href={href} style={S.socialBtn}>
        {icon}
        <span>{label}</span>
    </a>
);

/* ---- Static data ---- */

const STEPS = [
    {
        icon: Users,
        title: "Connect",
        desc: "Browse profiles of NCU students. Filter by skill, course, or availability. Find your perfect learning partner.",
        color: "#6C63FF",
    },
    {
        icon: RefreshCw,
        title: "Exchange",
        desc: "Propose a swap. You teach what you know, they teach what you want. Schedule sessions via the built-in Messenger.",
        color: "#00c6ff",
    },
    {
        icon: TrendingUp,
        title: "Level Up",
        desc: "Complete the swap. Earn Skill Credits, collect reviews, and build a portfolio of your teaching & learning history.",
        color: "#2ecc71",
    },
];

const FEATURES = [
    {
        icon: Brain,
        title: "Smart Matching Engine",
        desc: "Our algorithm surfaces the best swap candidates based on skills you offer vs. skills you want — giving you a match score for every profile.",
        bullets: ["AI-powered compatibility scoring", "Filter by skill, rating, availability", "Network-first suggestions"],
        color: "#6C63FF",
    },
    {
        icon: MessageSquare,
        title: "Glassmorphic Messenger",
        desc: "A Slack-style dual-pane chat with online status, timestamps, and context-aware shortcuts. Schedule a meeting without leaving the chat.",
        bullets: ["Real-time conversation threads", "'Suggest a Meeting' action button", "Start new conversations from your network"],
        color: "#00c6ff",
    },
    {
        icon: Award,
        title: "Skill Credit System",
        desc: "Every completed swap earns you Skill Credits on your profile. A transparent reputation layer that makes your learning visible to everyone.",
        bullets: ["Earn credits for teaching sessions", "Visible ratings & reviews", "Build a verified skill portfolio"],
        color: "#f5c518",
    },
];

const TESTIMONIALS = [
    {
        name: "Nikhil M.",
        role: "B.Tech CSE · React Specialist",
        text: "Traded React expertise for ML fundamentals. SkillSync made the whole experience effortless — I found a match in under 10 minutes.",
        rating: 5,
        color: "#6C63FF",
    },
    {
        name: "Priya A.",
        role: "B.Tech AI · Data Scientist",
        text: "Finally a platform that takes students seriously. The smart matching actually works — it paired me based on exactly what I needed.",
        rating: 5,
        color: "#00c6ff",
    },
    {
        name: "Simran K.",
        role: "B.Des · UI/UX Designer",
        text: "I taught Figma and learned JavaScript in return. It felt like a fair trade from day one. The messenger UI is gorgeous too!",
        rating: 5,
        color: "#ff6b6b",
    },
];

const SKILL_TAGS_ROW1 = [
    "React", "Python", "Machine Learning", "Figma", "Node.js",
    "Flutter", "Data Science", "DevOps", "TypeScript", "AWS",
];

const SKILL_TAGS_ROW2 = [
    "UI/UX Design", "Docker", "Kotlin", "Photography", "DSA",
    "Finance", "Public Speaking", "Marketing", "Rust", "GraphQL",
];

/* ---- Styles ---- */
const S = {
    page: {
        background: "#0c0c10",
        color: "#F0F0FF",
        fontFamily: "'Inter', sans-serif",
        overflowX: "hidden",
    },

    /* --- Hero --- */
    hero: {
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(108,99,255,0.18) 0%, transparent 65%)",
    },
    blob1: {
        position: "absolute", width: 500, height: 500, borderRadius: "50%",
        background: "rgba(108,99,255,0.08)", filter: "blur(80px)",
        top: -100, right: -100, zIndex: 0, animation: "blob 12s ease-in-out infinite",
    },
    blob2: {
        position: "absolute", width: 400, height: 400, borderRadius: "50%",
        background: "rgba(0,198,255,0.06)", filter: "blur(80px)",
        bottom: 0, left: -100, zIndex: 0, animation: "blob 15s reverse ease-in-out infinite",
    },
    nav: {
        position: "relative", zIndex: 10,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 48px",
    },
    navBrand: { display: "flex", alignItems: "center", gap: 10 },
    navIcon: {
        width: 34, height: 34, borderRadius: 9,
        background: "linear-gradient(135deg,#6C63FF,#00c6ff)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 14px rgba(108,99,255,0.4)",
    },
    navLogo: {
        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.1rem",
        background: "linear-gradient(135deg,#6C63FF,#00c6ff)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
    },
    navLinks: { display: "flex", gap: 32, alignItems: "center" },
    navLink: {
        color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", fontWeight: 500,
        textDecoration: "none", transition: "color 0.2s",
    },
    navCta: {
        padding: "10px 22px", borderRadius: 30,
        background: "linear-gradient(135deg,#6C63FF,#00c6ff)",
        border: "none", color: "#fff", fontWeight: 700, fontSize: "0.88rem",
        cursor: "pointer", boxShadow: "0 6px 20px rgba(108,99,255,0.4)",
        fontFamily: "'Inter',sans-serif",
    },
    heroContent: {
        position: "relative", zIndex: 2, flex: 1,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "60px 24px 80px",
    },
    heroBadge: {
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "8px 18px", borderRadius: 99,
        background: "rgba(108,99,255,0.12)", border: "1px solid rgba(108,99,255,0.3)",
        fontSize: "0.82rem", fontWeight: 500, color: "#9B8FFF", marginBottom: 28,
        backdropFilter: "blur(8px)",
    },
    heroTitle: {
        fontSize: "clamp(2.8rem, 6vw, 5.2rem)", fontWeight: 900, lineHeight: 1.08,
        fontFamily: "'Space Grotesk', sans-serif", marginBottom: 28, letterSpacing: "-1.5px",
    },
    heroGradient: {
        background: "linear-gradient(135deg, #6C63FF 0%, #00c6ff 100%)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
    },
    heroSub: {
        fontSize: "clamp(1rem, 1.6vw, 1.2rem)", color: "rgba(255,255,255,0.55)",
        maxWidth: 560, lineHeight: 1.7, marginBottom: 40,
    },
    heroBtns: { display: "flex", gap: 16, marginBottom: 56, flexWrap: "wrap", justifyContent: "center" },
    btnPrimary: {
        display: "inline-flex", alignItems: "center", gap: 9,
        padding: "14px 30px", borderRadius: 30, border: "none",
        background: "linear-gradient(135deg,#6C63FF,#00c6ff)", color: "#fff",
        fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", fontFamily: "'Inter',sans-serif",
        boxShadow: "0 8px 24px rgba(108,99,255,0.35)",
        transition: "transform 0.2s, box-shadow 0.2s",
    },
    btnGhost: {
        display: "inline-flex", alignItems: "center", gap: 9,
        padding: "14px 30px", borderRadius: 30,
        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)",
        color: "#fff", fontWeight: 600, fontSize: "0.95rem", cursor: "pointer",
        fontFamily: "'Inter',sans-serif", backdropFilter: "blur(8px)",
        transition: "background 0.2s",
    },
    statsRow: {
        display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap", justifyContent: "center",
        padding: "20px 40px", borderRadius: 20,
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(12px)",
    },
    statDiv: { width: 1, height: 36, background: "rgba(255,255,255,0.08)" },
    scrollDown: {
        position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)",
        background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 99, width: 44, height: 44, display: "flex", alignItems: "center",
        justifyContent: "center", cursor: "pointer", color: "#fff", zIndex: 3,
    },

    /* --- Shared section --- */
    section: {
        maxWidth: 1200, margin: "0 auto", padding: "96px 32px",
    },
    sectionLabel: {
        fontSize: "0.75rem", fontWeight: 700, letterSpacing: "3px",
        textTransform: "uppercase", color: "#6C63FF", marginBottom: 12, textAlign: "center",
    },
    sectionTitle: {
        fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800,
        fontFamily: "'Space Grotesk', sans-serif", textAlign: "center", marginBottom: 12, lineHeight: 1.2,
    },
    sectionSub: {
        fontSize: "1.05rem", color: "rgba(255,255,255,0.45)",
        textAlign: "center", maxWidth: 560, margin: "0 auto 60px",
    },

    /* --- Steps --- */
    stepsWrapper: {
        display: "flex", gap: 24,
        flexWrap: "wrap",
    },
    stepCard: {
        flex: 1, minWidth: 260,
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20, padding: "36px 28px", position: "relative",
        transition: "transform 0.3s, box-shadow 0.3s, border-color 0.3s",
        backdropFilter: "blur(10px)",
        cursor: "default",
    },
    stepNum: {
        position: "absolute", top: 18, right: 18,
        fontSize: "3.5rem", fontWeight: 900, color: "rgba(255,255,255,0.04)", lineHeight: 1,
        fontFamily: "'Space Grotesk', sans-serif",
    },
    iconCircle: {
        width: 62, height: 62, borderRadius: 16,
        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22,
        transition: "background 0.3s",
    },
    stepTitle: { fontSize: "1.25rem", fontWeight: 700, marginBottom: 10, fontFamily: "'Space Grotesk',sans-serif" },
    stepDesc: { color: "rgba(255,255,255,0.5)", lineHeight: 1.65, fontSize: "0.95rem" },

    /* --- Features --- */
    featuresStack: { display: "flex", flexDirection: "column", gap: 64 },
    featureRow: {
        display: "flex", alignItems: "center", gap: 56, flexWrap: "wrap",
    },
    featureVisual: {
        flex: 1, minWidth: 260, minHeight: 260, borderRadius: 24,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden",
    },
    featureIconBig: {
        position: "relative", zIndex: 2, opacity: 0.85,
    },
    featureGlow: {
        position: "absolute", width: 180, height: 180, borderRadius: "50%",
        filter: "blur(60px)", opacity: 0.15,
    },
    featureText: { flex: 1.4, minWidth: 260 },
    featureTag: {
        display: "inline-flex", padding: "4px 12px", borderRadius: 99,
        fontSize: "0.72rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase",
        marginBottom: 14,
    },
    featureHeading: {
        fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 800,
        fontFamily: "'Space Grotesk',sans-serif", marginBottom: 12, lineHeight: 1.2,
    },
    featureDesc: { color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: 20, fontSize: "1rem" },
    featureBullets: { listStyle: "none", display: "flex", flexDirection: "column", gap: 8 },
    featureBullet: { fontSize: "0.9rem", color: "rgba(255,255,255,0.65)", display: "flex", alignItems: "center" },

    /* --- Testimonials --- */
    testimonialsGrid: {
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24,
    },
    testimonialCard: {
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20, padding: "32px 28px", backdropFilter: "blur(12px)",
        position: "relative",
    },
    quoteIcon: {
        fontSize: "4rem", lineHeight: 1, color: "rgba(108,99,255,0.3)",
        fontFamily: "Georgia, serif", marginBottom: 8, display: "block",
    },
    testimonialText: { color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: 14, fontSize: "0.96rem" },
    testimonialStars: { display: "flex", gap: 3, marginBottom: 20 },
    testimonialAuthor: { display: "flex", alignItems: "center", gap: 12 },
    testimonialAvatar: {
        width: 40, height: 40, borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 700, color: "#fff", fontSize: "1rem",
    },
    testimonialName: { fontWeight: 600, fontSize: "0.9rem" },
    testimonialRole: { fontSize: "0.76rem", color: "rgba(255,255,255,0.4)", marginTop: 2 },

    /* Marquee */
    marqueeWrapper: { overflow: "hidden" },
    marqueeTrack: {
        display: "flex", gap: 12,
        width: "max-content",
        animation: "marquee 28s linear infinite",
    },
    marqueeTag: {
        padding: "7px 18px", borderRadius: 99, fontSize: "0.82rem", whiteSpace: "nowrap",
        background: "rgba(108,99,255,0.1)", border: "1px solid rgba(108,99,255,0.2)",
        color: "#9B8FFF",
    },

    /* --- Contact --- */
    contactSection: {
        background: "linear-gradient(180deg, transparent 0%, rgba(108,99,255,0.06) 40%, transparent 100%)",
    },
    contactInner: {
        maxWidth: 1100, margin: "0 auto", padding: "96px 32px 48px",
        display: "flex", gap: 64, flexWrap: "wrap",
    },
    socialLinks: { display: "flex", flexDirection: "column", gap: 14 },
    socialBtn: {
        display: "flex", alignItems: "center", gap: 12,
        padding: "12px 18px", borderRadius: 12,
        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
        color: "rgba(255,255,255,0.7)", fontSize: "0.88rem", textDecoration: "none",
        transition: "background 0.2s",
    },
    contactForm: {
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20, padding: "32px", backdropFilter: "blur(12px)",
        display: "flex", flexDirection: "column", gap: 14,
    },
    formInput: {
        padding: "12px 16px", borderRadius: 10, fontSize: "0.92rem",
        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
        color: "#F0F0FF", outline: "none", width: "100%", fontFamily: "'Inter',sans-serif",
    },

    /* Footer */
    footer: {
        maxWidth: 1100, margin: "0 auto", padding: "24px 32px 40px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16,
    },
    footerBrand: { display: "flex", alignItems: "center", gap: 10 },
    footerText: { color: "rgba(255,255,255,0.3)", fontSize: "0.82rem" },
};

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Zap, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

/* ---------- Animated mesh for login left panel ---------- */
function LoginMesh() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);
    const COLS = 8, ROWS = 6, SPEED = 0.00010;
    const pts = [];
    for (let r = 0; r <= ROWS; r++)
      for (let c = 0; c <= COLS; c++)
        pts.push({ ox: (c / COLS) * w, oy: (r / ROWS) * h, phase: Math.random() * Math.PI * 2, amp: 14 + Math.random() * 18 });
    let t = 0, raf;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const m = pts.map(p => ({
        x: p.ox + Math.cos(t * SPEED * 120 + p.phase) * p.amp,
        y: p.oy + Math.sin(t * SPEED * 90 + p.phase) * p.amp * 0.75,
      }));
      for (let r = 0; r <= ROWS; r++) {
        for (let c = 0; c <= COLS; c++) {
          const i = r * (COLS + 1) + c;
          if (c < COLS) {
            ctx.beginPath(); ctx.moveTo(m[i].x, m[i].y); ctx.lineTo(m[i + 1].x, m[i + 1].y);
            ctx.strokeStyle = "rgba(255,255,255,0.08)"; ctx.lineWidth = 0.7; ctx.stroke();
          }
          if (r < ROWS) {
            const j = i + (COLS + 1);
            ctx.beginPath(); ctx.moveTo(m[i].x, m[i].y); ctx.lineTo(m[j].x, m[j].y);
            ctx.strokeStyle = "rgba(0,198,255,0.06)"; ctx.lineWidth = 0.7; ctx.stroke();
          }
        }
      }
      m.forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2); ctx.fillStyle = "rgba(255,255,255,0.2)"; ctx.fill(); });
      t++; raf = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }} />;
}

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const validate = () => {
    const e = {};
    if (!isLogin && !form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 4) e.password = "Minimum 4 characters";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    if (isLogin) {
      const result = await login(form.email, form.password);
      if (!result?.ok) {
        setErrors({ email: result?.error || "Invalid credentials." });
        setLoading(false);
        return;
      }
    } else {
      const result = await signup({ name: form.name, email: form.email, password: form.password });
      if (!result?.ok) {
        setErrors({ email: result?.error || "Signup failed." });
        setLoading(false);
        return;
      }
    }
    navigate("/dashboard");
  };

  return (
    <div style={S.page}>
      {/* LEFT PANEL */}
      <div style={S.left}>
        {/* Animated mesh canvas */}
        <LoginMesh />

        {/* Animated blobs */}
        <div style={S.blob1} />
        <div style={S.blob2} />

        {/* Grid lines overlay */}
        <div style={S.gridOverlay} />

        <div style={S.leftContent}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <div style={S.brand}>
              <div style={S.brandIcon}><Zap size={18} color="#fff" fill="#fff" /></div>
              <span style={S.brandName}>SkillSync</span>
            </div>
          </Link>

          <div style={S.leftMain}>
            <h1 style={S.leftTitle}>Knowledge is the New Currency.</h1>
            <p style={S.leftSub}>Join NCU's premier Skill Exchange Network. Trade expertise. Grow together.</p>

            {/* Feature pills */}
            <div style={S.featurePills}>
              {["Smart Skill Matching", "Real-time Messenger", "Skill Credit System", "1,200+ Members"].map((f) => (
                <div key={f} style={S.pill}>
                  <CheckCircle size={14} color="#6C63FF" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Floating card mockup */}
          <div style={S.floatingCard}>
            <div style={S.cardRow}>
              <div style={{ ...S.fcAvatar, background: "#6C63FF" }}>N</div>
              <div>
                <p style={S.fcName}>Nikhil Mehta</p>
                <p style={S.fcSkill}>Offers: React · TypeScript</p>
              </div>
              <div style={S.matchBadge}>95% match</div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — Form */}
      <div style={S.right}>
        <div style={S.formBox}>
          <h2 style={{ ...S.formTitle, animation: "fadeUp 0.5s ease both" }}>
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p style={{ ...S.formSub, animation: "fadeUp 0.5s 0.08s ease both" }}>
            {isLogin ? "Sign in to your SkillSync account" : "Join the skill exchange network"}
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {!isLogin && (
              <div style={{ animation: "fadeUp 0.5s 0.12s ease both" }}>
                <Field
                  label="Full Name" placeholder="Your name"
                  value={form.name} onChange={set("name")} error={errors.name}
                />
              </div>
            )}
            <div style={{ animation: "fadeUp 0.5s 0.16s ease both" }}>
              <Field
                label="Email" placeholder="you@ncuindia.edu" type="email"
                value={form.email} onChange={set("email")} error={errors.email}
              />
            </div>
            <div style={{ animation: "fadeUp 0.5s 0.22s ease both" }}>
              <label style={S.label}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={set("password")}
                  style={{ ...S.input, ...(errors.password ? S.inputErr : {}) }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={S.eyeBtn}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p style={S.errMsg}>{errors.password}</p>}
            </div>

            <button
              type="submit"
              style={{ ...S.submitBtn, opacity: loading ? 0.7 : 1, animation: "fadeUp 0.5s 0.28s ease both" }}
              disabled={loading}
            >
              {loading ? "Authenticating..." : (isLogin ? "Sign In" : "Create Account")}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p style={{ ...S.switchText, animation: "fadeUp 0.5s 0.34s ease both" }}>
            {isLogin ? "New here? " : "Already registered? "}
            <span style={S.switchLink} onClick={() => { setIsLogin(!isLogin); setErrors({}); }}>
              {isLogin ? "Create Account" : "Sign In"}
            </span>
          </p>

          <details style={{ marginTop: 16 }}>
            <summary style={{ ...S.demoHint, cursor: "pointer", userSelect: "none" }}>
              💡 Demo accounts (click to expand)
            </summary>
            <div style={{ marginTop: 8, padding: "10px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)", fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>
              {[
                ["bhumika@ncuindia.edu", "bhumika123"],
                ["nikhil@ncuindia.edu", "nikhil123"],
                ["priya@ncuindia.edu", "priya123"],
                ["simran@ncuindia.edu", "simran123"],
                ["aryan@ncuindia.edu", "aryan123"],
              ].map(([e, p]) => (
                <div key={e} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", cursor: "pointer" }}
                  onClick={() => { setForm(f => ({ ...f, email: e, password: p })); }}>
                  <span>{e}</span><span style={{ color: "#9B8FFF" }}>{p}</span>
                </div>
              ))}
              <p style={{ marginTop: 6, opacity: 0.6 }}>Click a row to auto-fill credentials</p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}

const Field = ({ label, error, ...props }) => (
  <div>
    <label style={S.label}>{label}</label>
    <input style={{ ...S.input, ...(error ? S.inputErr : {}) }} {...props} />
    {error && <p style={S.errMsg}>{error}</p>}
  </div>
);

const S = {
  page: {
    display: "flex", minHeight: "100vh",
    background: "#0c0c10", fontFamily: "'Inter', sans-serif", color: "#F0F0FF",
  },
  left: {
    flex: 1.1, position: "relative", overflow: "hidden",
    background: "linear-gradient(135deg, #0d0d1f 0%, #0c0820 100%)",
    display: "flex", flexDirection: "column",
    borderRight: "1px solid rgba(108,99,255,0.15)",
    minWidth: 0,
  },
  blob1: {
    position: "absolute", width: 400, height: 400, borderRadius: "50%",
    background: "rgba(108,99,255,0.15)", filter: "blur(80px)",
    top: -80, left: -80, animation: "blob 12s ease-in-out infinite",
  },
  blob2: {
    position: "absolute", width: 300, height: 300, borderRadius: "50%",
    background: "rgba(0,198,255,0.10)", filter: "blur(80px)",
    bottom: -60, right: 40, animation: "blob 18s reverse ease-in-out infinite",
  },
  gridOverlay: {
    position: "absolute", inset: 0,
    backgroundImage: "linear-gradient(rgba(108,99,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(108,99,255,0.05) 1px, transparent 1px)",
    backgroundSize: "48px 48px",
    zIndex: 0,
  },
  leftContent: {
    position: "relative", zIndex: 2, flex: 1,
    display: "flex", flexDirection: "column", padding: "36px 48px 40px",
  },
  brand: { display: "flex", alignItems: "center", gap: 10, marginBottom: "auto" },
  brandIcon: {
    width: 34, height: 34, borderRadius: 9,
    background: "linear-gradient(135deg,#6C63FF,#00c6ff)",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 4px 14px rgba(108,99,255,0.4)",
  },
  brandName: {
    fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: "1.1rem",
    background: "linear-gradient(135deg,#6C63FF,#00c6ff)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  leftMain: { marginTop: "auto", paddingBottom: 32 },
  leftTitle: {
    fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 800,
    fontFamily: "'Space Grotesk',sans-serif", lineHeight: 1.15, marginBottom: 14,
  },
  leftSub: { color: "rgba(255,255,255,0.5)", lineHeight: 1.65, fontSize: "1rem", marginBottom: 28 },
  featurePills: { display: "flex", flexDirection: "column", gap: 10 },
  pill: {
    display: "flex", alignItems: "center", gap: 10, fontSize: "0.88rem",
    color: "rgba(255,255,255,0.7)",
  },
  floatingCard: {
    position: "absolute", bottom: 36, right: 36,
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(108,99,255,0.2)",
    borderRadius: 14, padding: "14px 18px",
    backdropFilter: "blur(16px)", zIndex: 2,
    boxShadow: "0 12px 36px rgba(0,0,0,0.4)",
    animation: "floatY 4s ease-in-out infinite",
  },
  cardRow: { display: "flex", alignItems: "center", gap: 12 },
  fcAvatar: {
    width: 36, height: 36, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, color: "#fff", fontSize: "0.9rem", flexShrink: 0,
  },
  fcName: { fontSize: "0.85rem", fontWeight: 600, marginBottom: 2 },
  fcSkill: { fontSize: "0.72rem", color: "rgba(255,255,255,0.45)" },
  matchBadge: {
    marginLeft: "auto", padding: "4px 10px", borderRadius: 99, fontSize: "0.72rem",
    fontWeight: 700, background: "rgba(46,204,113,0.18)", color: "#2ecc71",
    border: "1px solid rgba(46,204,113,0.3)",
  },

  /* Right form panel */
  right: {
    flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
    padding: "40px 24px", background: "#0c0c10",
  },
  formBox: { width: "100%", maxWidth: 400 },
  formTitle: { fontSize: "1.9rem", fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 6 },
  formSub: { color: "rgba(255,255,255,0.4)", marginBottom: 32, fontSize: "0.92rem" },
  label: { display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", marginBottom: 7, fontWeight: 500 },
  input: {
    width: "100%", padding: "13px 16px", borderRadius: 10, fontSize: "0.92rem",
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
    color: "#F0F0FF", outline: "none", fontFamily: "'Inter',sans-serif",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  },
  inputErr: { borderColor: "#e74c3c", background: "rgba(231,76,60,0.06)" },
  errMsg: { color: "#e74c3c", fontSize: "0.78rem", marginTop: 5, marginLeft: 2 },
  eyeBtn: {
    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
    background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer",
  },
  submitBtn: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    width: "100%", padding: "15px", borderRadius: 12, marginTop: 4,
    background: "linear-gradient(135deg,#6C63FF,#00c6ff)", border: "none",
    color: "#fff", fontWeight: 700, fontSize: "1rem", cursor: "pointer",
    fontFamily: "'Inter',sans-serif", boxShadow: "0 8px 24px rgba(108,99,255,0.35)",
    transition: "opacity 0.2s",
  },
  switchText: { textAlign: "center", color: "rgba(255,255,255,0.4)", marginTop: 24, fontSize: "0.88rem" },
  switchLink: { color: "#6C63FF", cursor: "pointer", fontWeight: 600 },
  demoHint: {
    textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: "0.75rem",
    marginTop: 16, padding: "8px 12px", borderRadius: 8,
    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)",
  },
};

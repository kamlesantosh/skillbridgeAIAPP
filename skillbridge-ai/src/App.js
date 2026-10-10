
import { useState, useRef, useEffect } from "react";

const API = "sk-ant-api03-xxxxxxxxxxxxxx";
const MODEL = "claude-sonnet-4-20250514";

async function callClaude(apiKey, messages, system = "") {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey   // ✅ IMPORTANT (send key to backend)
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1000,
      system,
      messages
    }),
  });

  if (!res.ok) {
    const e = await res.json();
    throw new Error(e.error || "API error");
  }

  const data = await res.json();
  return data.reply;
}
const NAV = [
  { id: "home",      label: "Home",       icon: "⌂" },
  { id: "career",    label: "Career",     icon: "🧭" },
  { id: "skill",     label: "Skills",     icon: "📊" },
  { id: "resume",    label: "Resume",     icon: "📄" },
  { id: "interview", label: "Interview",  icon: "🎤" },
  { id: "jobs",      label: "Jobs",       icon: "💼" },
];

export default function SkillBridgeApp() {
  const [page, setPage] = useState("home");
  const [apiKey, setApiKey] = useState("");
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState("");

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      background: "linear-gradient(135deg, #0d1117 0%, #0a1628 50%, #0d1117 100%)",
      minHeight: "100vh",
      color: "#e2e8f0",
      display: "flex",
      flexDirection: "column",
      maxWidth: 480,
      margin: "0 auto",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background glow */}
      <div style={{ position: "fixed", top: -120, left: -80, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, #1d4ed840 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: -80, right: -60, width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, #06b6d430 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      {/* Header */}
      <header style={{ padding: "16px 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #1e293b", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 10, background: "rgba(13,17,23,0.85)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg, #3b82f6, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, color: "#fff" }}>S</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: "-0.3px", color: "#f1f5f9" }}>SkillBridge <span style={{ color: "#38bdf8" }}>AI</span></div>
            <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.5px" }}>CAREER ASSISTANT</div>
          </div>
        </div>
        <button onClick={() => { setTempKey(apiKey); setShowKeyModal(true); }} style={{ background: apiKey ? "#064e3b" : "#1e293b", border: `1px solid ${apiKey ? "#10b981" : "#334155"}`, borderRadius: 8, padding: "5px 12px", color: apiKey ? "#10b981" : "#94a3b8", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
          🔑 {apiKey ? "Key Set ✓" : "Set API Key"}
        </button>
      </header>

      {/* Page content */}
      <main style={{ flex: 1, overflowY: "auto", padding: "0 0 80px", position: "relative", zIndex: 1 }}>
        {page === "home"      && <HomePage setPage={setPage} apiKey={apiKey} />}
        {page === "career"    && <CareerPage apiKey={apiKey} />}
        {page === "skill"     && <SkillPage apiKey={apiKey} />}
        {page === "resume"    && <ResumePage apiKey={apiKey} />}
        {page === "interview" && <InterviewPage apiKey={apiKey} />}
        {page === "jobs"      && <JobsPage apiKey={apiKey} />}
      </main>

      {/* Bottom nav */}
      <nav style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "rgba(13,17,23,0.95)", backdropFilter: "blur(16px)", borderTop: "1px solid #1e293b", display: "flex", zIndex: 20, padding: "6px 0 10px" }}>
        {NAV.map(n => (
          <button key={n.id} onClick={() => setPage(n.id)} style={{ flex: 1, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "4px 0", transition: "all 0.15s" }}>
            <span style={{ fontSize: 18, filter: page === n.id ? "none" : "grayscale(60%)", opacity: page === n.id ? 1 : 0.5 }}>{n.icon}</span>
            <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.4px", color: page === n.id ? "#38bdf8" : "#475569" }}>{n.label.toUpperCase()}</span>
            {page === n.id && <div style={{ width: 16, height: 2, borderRadius: 2, background: "#38bdf8", marginTop: 1 }} />}
          </button>
        ))}
      </nav>

      {/* API Key Modal */}
      {showKeyModal && (
        <div style={{ position: "fixed", inset: 0, background: "#000a", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 18, padding: 28, width: "100%", maxWidth: 360 }}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>🔑 Anthropic API Key</div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 18 }}>Get your free key at <span style={{ color: "#38bdf8" }}>console.anthropic.com</span>. It stays only in your browser.</div>
            <input
              value={tempKey}
              onChange={e => setTempKey(e.target.value)}
              type="password"
              placeholder="sk-ant-..."
              style={{ width: "100%", background: "#1e293b", border: "1px solid #334155", borderRadius: 10, padding: "11px 14px", color: "#f1f5f9", fontSize: 14, outline: "none", boxSizing: "border-box" }}
            />
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 8, marginBottom: 4 }}>
              Key preview: <span style={{ color: "#94a3b8", fontFamily: "monospace" }}>{tempKey ? tempKey.slice(0, 14) + "..." : "—"}</span>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button onClick={() => setShowKeyModal(false)} style={{ flex: 1, background: "#1e293b", border: "1px solid #334155", borderRadius: 10, padding: "10px", color: "#94a3b8", cursor: "pointer", fontSize: 14 }}>Cancel</button>
              <button onClick={() => { setApiKey(tempKey.trim()); setShowKeyModal(false); }} style={{ flex: 2, background: "linear-gradient(135deg, #3b82f6, #06b6d4)", border: "none", borderRadius: 10, padding: "10px", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>Save Key</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Shared Components ──
function Btn({ children, onClick, disabled, secondary, small }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: secondary ? "transparent" : "linear-gradient(135deg, #3b82f6, #06b6d4)",
      border: secondary ? "1px solid #334155" : "none",
      borderRadius: small ? 8 : 12,
      padding: small ? "7px 16px" : "13px 24px",
      color: secondary ? "#94a3b8" : "#fff",
      fontWeight: 700, fontSize: small ? 13 : 15,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      width: secondary ? "auto" : "100%",
      transition: "all 0.15s",
      fontFamily: "inherit",
    }}>{children}</button>
  );
}

function Card({ children, style = {} }) {
  return <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid #1e293b", borderRadius: 16, padding: 20, ...style }}>{children}</div>;
}

function Label({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1px", color: "#38bdf8", textTransform: "uppercase", marginBottom: 6 }}>{children}</div>;
}

function Input({ value, onChange, placeholder, multiline, rows = 3 }) {
  const style = { width: "100%", background: "#0f172a", border: "1px solid #1e293b", borderRadius: 10, padding: "10px 14px", color: "#f1f5f9", fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box", resize: "vertical" };
  return multiline
    ? <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} style={style} />
    : <input value={value} onChange={onChange} placeholder={placeholder} style={style} />;
}

function Spinner() {
  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ width: 18, height: 18, border: "2px solid #ffffff44", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
    </>
  );
}

function NoKey() {
  return (
    <Card style={{ margin: 20, textAlign: "center" }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>🔑</div>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>API Key Required</div>
      <div style={{ fontSize: 13, color: "#64748b" }}>Tap "Set API Key" in the top right to enable AI features.</div>
      <div style={{ fontSize: 12, color: "#475569", marginTop: 10, lineHeight: 1.6 }}>
        Get your key at <span style={{ color: "#38bdf8" }}>console.anthropic.com</span>
      </div>
    </Card>
  );
}

function ResultBox({ text }) {
  return (
    <Card style={{ marginTop: 16, background: "#051020", border: "1px solid #1d4ed840" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#38bdf8", letterSpacing: "1px", marginBottom: 10 }}>✦ AI RESULT</div>
      <div style={{ fontSize: 13, lineHeight: 1.8, color: "#cbd5e1", whiteSpace: "pre-wrap" }}>{text}</div>
    </Card>
  );
}

function PageHeader({ icon, title, sub, noMargin }) {
  return (
    <div style={{ marginBottom: noMargin ? 0 : 20 }}>
      <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.3px", display: "flex", alignItems: "center", gap: 8 }}>
        <span>{icon}</span>{title}
      </div>
      {sub && <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

// ── HOME PAGE ──
function HomePage({ setPage, apiKey }) {
  const features = [
    { id: "career",    icon: "🧭", title: "Career Guidance",    desc: "Discover the best career paths for your profile" },
    { id: "skill",     icon: "📊", title: "Skill Gap Analyser", desc: "Find what skills you're missing for your dream job" },
    { id: "resume",    icon: "📄", title: "Resume Builder",     desc: "Generate a professional resume with AI in seconds" },
    { id: "interview", icon: "🎤", title: "Mock Interview",     desc: "Practice real interview questions with AI feedback" },
    { id: "jobs",      icon: "💼", title: "Job Board",          desc: "Get matched with relevant entry-level jobs" },
  ];
  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 24, paddingTop: 8 }}>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.2 }}>Hello, Fresher! 👋</div>
        <div style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>Your AI-powered career journey starts here.</div>
      </div>

      {!apiKey && (
        <div style={{ background: "linear-gradient(135deg, #1e3a5f, #0c2340)", border: "1px solid #1d4ed8", borderRadius: 14, padding: 16, marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 22 }}>🔑</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Set your API key to get started</div>
            <div style={{ fontSize: 12, color: "#93c5fd" }}>Tap "Set API Key" → top right corner</div>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {features.map(f => (
          <button key={f.id} onClick={() => setPage(f.id)} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1e293b", borderRadius: 14, padding: 16, cursor: "pointer", textAlign: "left", transition: "all 0.15s", color: "#e2e8f0" }}>
            <div style={{ fontSize: 26, marginBottom: 8 }}>{f.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{f.title}</div>
            <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.4 }}>{f.desc}</div>
          </button>
        ))}
        <div style={{ background: "linear-gradient(135deg, #1d4ed820, #0891b220)", border: "1px solid #0891b240", borderRadius: 14, padding: 16, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 4 }}>
          <div style={{ fontSize: 22 }}>✦</div>
          <div style={{ fontWeight: 700, fontSize: 12, color: "#38bdf8", textAlign: "center" }}>All AI Powered</div>
          <div style={{ fontSize: 10, color: "#475569", textAlign: "center" }}>by Claude API</div>
        </div>
      </div>

      <div style={{ marginTop: 24, padding: "14px 16px", background: "#0f172a", borderRadius: 12, border: "1px solid #1e293b" }}>
        <div style={{ fontSize: 11, color: "#38bdf8", fontWeight: 700, letterSpacing: "1px", marginBottom: 8 }}>HOW TO USE</div>
        {["1. Set your API Key (top right)", "2. Pick any feature below", "3. Fill in your details", "4. Get instant AI results!"].map((s, i) => (
          <div key={i} style={{ fontSize: 12, color: "#94a3b8", padding: "3px 0" }}>{s}</div>
        ))}
      </div>
    </div>
  );
}

// ── CAREER GUIDANCE ──
function CareerPage({ apiKey }) {
  const [form, setForm] = useState({ edu: "", skills: "", interests: "", location: "Chennai, India" });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function run() {
    if (!apiKey) return;
    setLoading(true); setErr(""); setResult("");
    try {
      const text = await callClaude(apiKey, [{
        role: "user",
        content: `Suggest the top 3 career paths for this fresh graduate in India. For each: give the role name, why it suits them, top 3 skills to learn, salary range (LPA), and 2 companies to target. Keep it practical and encouraging.\n\nEducation: ${form.edu}\nCurrent Skills: ${form.skills}\nInterests: ${form.interests}\nLocation: ${form.location}`
      }], "You are SkillBridge AI, a career advisor for fresh graduates in India. Be specific, practical, and encouraging. Use simple language.");
      setResult(text);
    } catch (e) { setErr(e.message); }
    setLoading(false);
  }

  if (!apiKey) return <NoKey />;
  return (
    <div style={{ padding: 20 }}>
      <PageHeader icon="🧭" title="Career Guidance" sub="Tell us about yourself — AI will suggest your best career paths" />
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div><Label>Education / Degree</Label><Input value={form.edu} onChange={e => setForm({ ...form, edu: e.target.value })} placeholder="e.g. B.Sc Computer Science, 2024" /></div>
        <div><Label>Current Skills</Label><Input value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} placeholder="e.g. Python, Excel, basic HTML" /></div>
        <div><Label>Interests / Hobbies</Label><Input value={form.interests} onChange={e => setForm({ ...form, interests: e.target.value })} placeholder="e.g. data, design, problem solving" /></div>
        <div><Label>Location</Label><Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="City, State" /></div>
        <Btn onClick={run} disabled={loading || !form.edu}>{loading ? <Spinner /> : "✦ Find My Career Paths"}</Btn>
        {err && <div style={{ color: "#f87171", fontSize: 13 }}>⚠ {err}</div>}
        {result && <ResultBox text={result} />}
      </div>
    </div>
  );
}

// ── SKILL GAP ──
function SkillPage({ apiKey }) {
  const [form, setForm] = useState({ role: "", currentSkills: "" });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function run() {
    if (!apiKey) return;
    setLoading(true); setErr(""); setResult("");
    try {
      const text = await callClaude(apiKey, [{
        role: "user",
        content: `Perform a skill gap analysis for a fresher in India targeting the role: "${form.role}".\nTheir current skills: ${form.currentSkills || "none listed"}.\n\nProvide: 1) Required skills for this role, 2) Skills they already have (matched), 3) Missing skills (the gap), 4) Free resources to learn each missing skill, 5) Estimated time to bridge the gap. Be specific and practical.`
      }], "You are SkillBridge AI, a career skills advisor for fresh graduates in India. Be direct, specific, and actionable.");
      setResult(text);
    } catch (e) { setErr(e.message); }
    setLoading(false);
  }

  if (!apiKey) return <NoKey />;
  return (
    <div style={{ padding: 20 }}>
      <PageHeader icon="📊" title="Skill Gap Analyser" sub="See exactly what skills you need for your target role" />
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div><Label>Target Job Role</Label><Input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="e.g. Data Analyst, Frontend Developer" /></div>
        <div><Label>Your Current Skills</Label><Input value={form.currentSkills} onChange={e => setForm({ ...form, currentSkills: e.target.value })} placeholder="e.g. Python basics, MS Excel, HTML" multiline rows={3} /></div>
        <Btn onClick={run} disabled={loading || !form.role}>{loading ? <Spinner /> : "📊 Analyse My Skill Gaps"}</Btn>
        {err && <div style={{ color: "#f87171", fontSize: 13 }}>⚠ {err}</div>}
        {result && <ResultBox text={result} />}
      </div>
    </div>
  );
}

// ── RESUME BUILDER ──
function ResumePage({ apiKey }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "", education: "", skills: "", projects: "", achievements: "" });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);

  async function run() {
    if (!apiKey) return;
    setLoading(true); setErr(""); setResult("");
    try {
      const text = await callClaude(apiKey, [{
        role: "user",
        content: `Write a complete, professional, ATS-friendly resume in plain text for this fresh graduate in India. Use UPPERCASE for section headers, dashes for bullets. No markdown symbols.\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nTarget Role: ${form.role}\nEducation: ${form.education}\nSkills: ${form.skills}\nProjects: ${form.projects}\nAchievements: ${form.achievements}\n\nWrite a strong career objective if not provided. Use action verbs. Make it job-ready.`
      }], "You are a professional resume writer for fresh graduates in India. Write clean, ATS-optimised resumes in plain text format.");
      setResult(text);
    } catch (e) { setErr(e.message); }
    setLoading(false);
  }

  function copy() {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!apiKey) return <NoKey />;
  return (
    <div style={{ padding: 20 }}>
      <PageHeader icon="📄" title="Resume Builder" sub="Fill your details — AI writes your professional resume" />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div><Label>Full Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Rahul Sharma" /></div>
          <div><Label>Target Role</Label><Input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="Data Analyst" /></div>
          <div><Label>Email</Label><Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="rahul@email.com" /></div>
          <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" /></div>
        </div>
        <div><Label>Education</Label><Input value={form.education} onChange={e => setForm({ ...form, education: e.target.value })} placeholder="B.Sc CS, Univ of Madras, 2024, 78%" /></div>
        <div><Label>Skills</Label><Input value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} placeholder="Python, SQL, Tableau, MS Excel" /></div>
        <div><Label>Projects / Internships</Label><Input value={form.projects} onChange={e => setForm({ ...form, projects: e.target.value })} placeholder="Sales Dashboard using Python & Tableau" multiline rows={3} /></div>
        <div><Label>Achievements & Certifications</Label><Input value={form.achievements} onChange={e => setForm({ ...form, achievements: e.target.value })} placeholder="Google Data Analytics Cert, Hackathon Winner" multiline rows={2} /></div>
        <Btn onClick={run} disabled={loading || !form.name}>{loading ? <Spinner /> : "✦ Generate My Resume"}</Btn>
        {err && <div style={{ color: "#f87171", fontSize: 13 }}>⚠ {err}</div>}
        {result && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#38bdf8", letterSpacing: "1px" }}>✦ YOUR RESUME</div>
              <button onClick={copy} style={{ background: copied ? "#064e3b" : "#1e293b", border: "1px solid #334155", borderRadius: 7, padding: "5px 12px", color: copied ? "#10b981" : "#94a3b8", fontSize: 12, cursor: "pointer" }}>{copied ? "Copied ✓" : "Copy"}</button>
            </div>
            <div style={{ background: "#fff", color: "#1a1a2e", borderRadius: 12, padding: "24px 20px", fontFamily: "Georgia, serif", fontSize: 12, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{result}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── MOCK INTERVIEW ──
function InterviewPage({ apiKey }) {
  const [role, setRole] = useState("");
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [qNum, setQNum] = useState(0);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function startInterview() {
    if (!role || !apiKey) return;
    setStarted(true);
    setLoading(true);
    setMessages([]);
    setQNum(1);
    try {
      const text = await callClaude(apiKey, [{
        role: "user",
        content: `Start a mock interview for the role: "${role}". Ask question 1 of 8. Keep it real and relevant for a fresher in India.`
      }], `You are an interviewer conducting a mock job interview for the role of ${role} for a fresh graduate in India. Ask one question at a time. After each answer, give brief feedback (2-3 sentences: what was good, what could improve), then ask the next question. After 8 questions, give an overall score out of 10 and final tips.`);
      setMessages([{ role: "ai", text }]);
    } catch (e) { setMessages([{ role: "ai", text: "Error: " + e.message }]); }
    setLoading(false);
  }

  async function sendAnswer() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    const newMsgs = [...messages, { role: "user", text: userMsg }];
    setMessages(newMsgs);
    setLoading(true);
    const nextQ = qNum + 1;
    setQNum(nextQ);
    try {
      const history = newMsgs.map(m => ({ role: m.role === "ai" ? "assistant" : "user", content: m.text }));
      const text = await callClaude(apiKey, history,
        `You are an interviewer for ${role}. Give feedback on the answer, then ${nextQ <= 8 ? `ask question ${nextQ} of 8` : "give final overall score out of 10 and 3 key improvement tips"}.`
      );
      setMessages([...newMsgs, { role: "ai", text }]);
    } catch (e) { setMessages([...newMsgs, { role: "ai", text: "Error: " + e.message }]); }
    setLoading(false);
  }

  if (!apiKey) return <NoKey />;

  if (!started) return (
    <div style={{ padding: 20 }}>
      <PageHeader icon="🎤" title="Mock Interview" sub="Practice real interview questions with instant AI feedback" />
      <Card>
        <Label>Target Job Role</Label>
        <Input value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Data Analyst, Java Developer, HR Executive" />
        <div style={{ marginTop: 16 }}>
          <Btn onClick={startInterview} disabled={!role}>🎤 Start Interview (8 Questions)</Btn>
        </div>
        <div style={{ marginTop: 14, fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>💡 You'll get feedback after each answer and a final score at the end.</div>
      </Card>
    </div>
  );

  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", height: "calc(100vh - 160px)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <PageHeader icon="🎤" title={`Interview: ${role}`} sub={`Question ${Math.min(qNum, 8)} of 8`} noMargin />
        <button onClick={() => { setStarted(false); setMessages([]); setQNum(0); }} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, padding: "5px 12px", color: "#94a3b8", fontSize: 12, cursor: "pointer" }}>Restart</button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, paddingBottom: 8 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "88%",
              background: m.role === "user" ? "linear-gradient(135deg, #3b82f6, #06b6d4)" : "rgba(255,255,255,0.05)",
              border: m.role === "ai" ? "1px solid #1e293b" : "none",
              borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
              padding: "12px 16px",
              fontSize: 13, lineHeight: 1.7, color: "#f1f5f9", whiteSpace: "pre-wrap"
            }}>
              {m.role === "ai" && <div style={{ fontSize: 10, color: "#38bdf8", fontWeight: 700, marginBottom: 6 }}>🤖 INTERVIEWER</div>}
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748b", fontSize: 13 }}>
            <Spinner /> <span>Thinking...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {qNum <= 8 && (
        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendAnswer(); } }}
            placeholder="Type your answer... (Enter to send)"
            rows={2}
            style={{ flex: 1, background: "#0f172a", border: "1px solid #1e293b", borderRadius: 10, padding: "10px 14px", color: "#f1f5f9", fontSize: 13, outline: "none", fontFamily: "inherit", resize: "none" }}
          />
          <button
            onClick={sendAnswer}
            disabled={loading || !input.trim()}
            style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)", border: "none", borderRadius: 10, width: 44, cursor: "pointer", color: "#fff", fontSize: 18, opacity: loading || !input.trim() ? 0.4 : 1 }}
          >↑</button>
        </div>
      )}
    </div>
  );
}

// ── JOBS ──
function JobsPage({ apiKey }) {
  const [form, setForm] = useState({ role: "", skills: "", location: "Chennai" });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function run() {
    if (!apiKey) return;
    setLoading(true); setErr(""); setResult("");
    try {
      const text = await callClaude(apiKey, [{
        role: "user",
        content: `Suggest 5 specific entry-level job opportunities in India for:\nRole: ${form.role}\nSkills: ${form.skills}\nLocation: ${form.location}\n\nFor each: job title, type of company to target, key requirements, where to apply (portals like Naukri, LinkedIn, Internshala, Wellfound, etc.), and 1 tip to stand out. Be practical and specific for 2024-2025 Indian job market.`
      }], "You are a job placement advisor for fresh graduates in India. Give practical, specific, actionable job search advice.");
      setResult(text);
    } catch (e) { setErr(e.message); }
    setLoading(false);
  }

  if (!apiKey) return <NoKey />;
  return (
    <div style={{ padding: 20 }}>
      <PageHeader icon="💼" title="Job Match Board" sub="Get matched with entry-level jobs suited to your profile" />
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div><Label>Target Role</Label><Input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="e.g. Data Analyst, Python Developer" /></div>
        <div><Label>Your Skills</Label><Input value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} placeholder="e.g. Python, SQL, Excel" /></div>
        <div><Label>Preferred Location</Label><Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. Chennai, Bengaluru, Remote" /></div>
        <Btn onClick={run} disabled={loading || !form.role}>{loading ? <Spinner /> : "💼 Find My Job Matches"}</Btn>
        {err && <div style={{ color: "#f87171", fontSize: 13 }}>⚠ {err}</div>}
        {result && <ResultBox text={result} />}
      </div>
    </div>
  );
}

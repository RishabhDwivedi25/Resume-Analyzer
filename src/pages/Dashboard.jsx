import { useEffect, useState, useRef, useCallback } from "react";
import API from "../api/api";
import axios from "axios";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaPen,
  FaBriefcase,
  FaRedo,
  FaClipboardList,
  FaChevronDown,
  FaCopy,
  FaShareAlt,
  FaChevronUp,
  FaInfoCircle,
} from "react-icons/fa";

// ---------------------------------------------------------------
// Small reusable bits hidden in this file to keep the main component below clean and readable
// ---------------------------------------------------------------

/** Animates a number counting up from 0 -> value whenever value changes. */
function useCountUp(value, duration = 900) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef(null);
  const fromRef = useRef(0);

  useEffect(() => {
    fromRef.current = display;
    startRef.current = null;
    let raf;
    const step = (ts) => {
      if (startRef.current === null) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      setDisplay(Math.round(fromRef.current + (value - fromRef.current) * eased));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // NOTE: intentionally omitting `display` from deps — it's only used
    // as the animation's starting point, not something that should
    // re-trigger the effect.
    // eslint-disable-next-line
  }, [value, duration]);

  return display;
}

/** Tiny toast system so actions (copy, refresh) give the user feedback. */
function useToast() {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const showToast = useCallback((message) => {
    setToast(message);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(null), 2200);
  }, []);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return [toast, showToast];
}

function Toast({ message }) {
  if (!message) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0F172A] text-white font-bold text-sm px-5 py-3 rounded-full border-2 border-white shadow-[4px_4px_0px_rgba(0,0,0,0.25)] animate-[fadeInUp_0.25s_ease-out]"
    >
      {message}
    </div>
  );
}

/**
 * A collapsible section card. Shows the first `previewCount` items and lets
 * the user expand to see the rest — keeps long resumes from turning the
 * dashboard into an endless scroll.
 */
function SectionCard({ section, items, renderItem, emptyState }) {
  const { title, color, bg, Icon, rotate } = section;
  const [expanded, setExpanded] = useState(false);
  const previewCount = 4;
  const hasOverflow = items.length > previewCount;
  const visibleItems = expanded ? items : items.slice(0, previewCount);

  return (
    <div
      className={`bg-white rounded-[2rem] border-4 p-6 transition hover:-translate-y-1 hover:rotate-0 ${rotate}`}
      style={{ borderColor: color, backgroundColor: bg, boxShadow: `6px 6px 0px ${color}` }}
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 border-[#0F172A]"
          style={{ backgroundColor: color }}
        >
          <Icon className="text-white text-sm" />
        </div>
        <h2 className="text-lg font-extrabold text-[#0F172A]">{title}</h2>
        {items.length > 0 && (
          <span
            className="ml-auto text-xs font-extrabold text-white px-2.5 py-1 rounded-full border-2 border-[#0F172A]"
            style={{ backgroundColor: color }}
          >
            {items.length}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-sm font-medium text-[#94A3B8] italic">{emptyState}</p>
      ) : (
        <>
          <ul className="space-y-2.5">
            {visibleItems.map((item, i) => renderItem(item, i))}
          </ul>

          {hasOverflow && (
            <button
              onClick={() => setExpanded((e) => !e)}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide hover:underline"
              style={{ color }}
            >
              {expanded ? (
                <>
                  Show less <FaChevronUp className="text-[10px]" />
                </>
              ) : (
                <>
                  Show {items.length - previewCount} more <FaChevronDown className="text-[10px]" />
                </>
              )}
            </button>
          )}
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------
// Main component
// ---------------------------------------------------------------

function Dashboard() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [showScoreInfo, setShowScoreInfo] = useState(false);
  const [toast, showToast] = useToast();

  const fetchResume = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError(null);
    try {
      const response = await API.get("/resumes/my");
      const latest = response.data.resumes[0];
      if (!latest) {
        setError("No resume found. Upload one to see your analysis.");
      } else {
        setResume(latest);
        if (isRefresh) showToast("Analysis refreshed");
      }
    } catch (err) {
      console.log(err);
      setError("Couldn't load your resume analysis. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchResume();
  }, [fetchResume]);

  // Keyboard shortcut: "r" refreshes, like a lot of dashboards support
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "r" && !e.metaKey && !e.ctrlKey && document.activeElement.tagName !== "INPUT") {
        fetchResume(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [fetchResume]);

  // ---- Score math ----
  // IMPORTANT: this hook must run on every render, in the same order,
  // regardless of loading/error state — so it lives above the early
  // returns below instead of after them. We feed it 0 until the resume
  // has actually loaded.
  const score = resume ? resume.atsScore : 0;
  const animatedScore = useCountUp(score);

  // ---- Loading state ----
  if (loading) {
    return (
      <div className="bg-[#F8FAFC] min-h-screen p-8">
        <div className="max-w-6xl mx-auto animate-pulse">
          <div className="h-10 w-72 bg-blue-100 rounded-full mb-8" />
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="h-56 bg-white rounded-[2rem] border-4 border-blue-100" />
            <div className="h-56 bg-white rounded-[2rem] border-4 border-blue-100" />
            <div className="h-56 bg-white rounded-[2rem] border-4 border-blue-100" />
          </div>
        </div>
      </div>
    );
  }

  // ---- Error / empty state ----
  if (error || !resume) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#F8FAFC] text-center px-6">
        <div className="w-20 h-20 rounded-full bg-[#4F46E5] border-4 border-[#0F172A] flex items-center justify-center mb-5 rotate-[-6deg]">
          <FaClipboardList className="text-3xl text-white" />
        </div>
        <p className="text-lg font-bold text-[#0F172A] mb-4">
          {error || "No resume found. Upload one to see your analysis."}
        </p>
        <button
          onClick={() => fetchResume()}
          className="inline-flex items-center gap-2 bg-[#2563EB] text-white px-6 py-3 rounded-full font-bold border-4 border-[#0F172A] hover:-translate-y-1 transition shadow-[4px_4px_0px_#0F172A]"
        >
          <FaRedo className="text-sm" />
          Try again
        </button>
      </div>
    );
  }

  let accent = "#DC2626";
  let scoreLabel = "Needs a boost";
  let grade = "D";
  let emoji = "💪";
  if (score >= 90) {
    accent = "#16A34A"; scoreLabel = "Excellent!"; grade = "A"; emoji = "🎉";
  } else if (score >= 80) {
    accent = "#2563EB"; scoreLabel = "Looking good"; grade = "B"; emoji = "✨";
  } else if (score >= 65) {
    accent = "#4F46E5"; scoreLabel = "Getting there"; grade = "C"; emoji = "👍";
  }

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(resume.summary);
      showToast("Summary copied to clipboard");
    } catch {
      showToast("Couldn't copy — try selecting the text manually");
    }
  };

  const handleShare = async () => {
    const text = `My resume scored ${score}/100 on ATS analysis (Grade ${grade}).`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "My Resume Report", text });
      } catch {
        /* user cancelled share sheet — no toast needed */
      }
    } else {
      await navigator.clipboard.writeText(text);
      showToast("Result copied — paste it anywhere");
    }
  };

  const sectionDefs = {
    strengths: {
      key: "strengths", title: "Strengths", color: "#16A34A", bg: "#F0FDF4",
      Icon: FaCheckCircle, rotate: "-rotate-1",
    },
    missing: {
      key: "missing", title: "Missing Skills", color: "#DC2626", bg: "#FEF2F2",
      Icon: FaTimesCircle, rotate: "rotate-1",
    },
    grammar: {
      key: "grammar", title: "Grammar Suggestions", color: "#2563EB", bg: "#EFF6FF",
      Icon: FaPen, rotate: "-rotate-1",
    },
    roles: {
      key: "roles", title: "Recommended Roles", color: "#4F46E5", bg: "#EEF2FF",
      Icon: FaBriefcase, rotate: "rotate-1",
    },
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-8 relative overflow-hidden">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate(-50%, 8px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      {/* confetti dots */}
      <div className="pointer-events-none absolute top-10 left-1/4 w-4 h-4 rounded-full bg-[#4F46E5]" />
      <div className="pointer-events-none absolute top-24 right-1/3 w-3 h-3 rounded-full bg-[#2563EB]" />
      <div className="pointer-events-none absolute top-16 right-16 w-5 h-5 rounded-full bg-[#DC2626]" />
      <div className="pointer-events-none absolute bottom-24 left-12 w-4 h-4 rotate-45 bg-[#16A34A]" />
      <div className="pointer-events-none absolute bottom-40 right-24 w-3 h-3 rounded-full bg-[#4F46E5]" />

      <div className="max-w-6xl mx-auto relative">
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-[#0F172A]">
              Your Resume Report {emoji}
            </h1>
            <p className="text-[#475569] mt-1 font-medium">
              {resume.fileName || "Your resume"} — fresh off the scanner.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#0F172A] bg-white border-4 border-[#0F172A] px-4 py-2.5 rounded-full hover:-translate-y-1 transition shadow-[3px_3px_0px_#0F172A]"
            >
              <FaShareAlt className="text-xs" />
              Share
            </button>
            <button
              onClick={() => fetchResume(true)}
              disabled={refreshing}
              aria-busy={refreshing}
              title="Press R to refresh"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#0F172A] bg-white border-4 border-[#0F172A] px-4 py-2.5 rounded-full hover:-translate-y-1 transition shadow-[3px_3px_0px_#0F172A] disabled:opacity-60 disabled:hover:translate-y-0"
            >
              <FaRedo className={`text-xs ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing…" : "Refresh"}
            </button>
          </div>
        </div>

        {/* Score + sections grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {/* Score blob card */}
          <div
            className="relative bg-white rounded-[2.5rem] border-4 p-6 text-center flex flex-col items-center justify-center hover:-translate-y-1 transition"
            style={{ borderColor: accent, boxShadow: `6px 6px 0px ${accent}` }}
          >
            <span
              className="absolute -top-4 -right-3 text-xs font-extrabold text-white px-3 py-1.5 rounded-full border-2 border-[#0F172A] rotate-6"
              style={{ backgroundColor: accent }}
            >
              Grade {grade}
            </span>

            <button
              onClick={() => setShowScoreInfo((v) => !v)}
              className="self-start flex items-center gap-1.5 text-sm font-bold text-[#0F172A] uppercase tracking-wide mb-4 hover:opacity-70 transition"
              aria-expanded={showScoreInfo}
            >
              ATS Score
              <FaInfoCircle className="text-xs text-[#94A3B8]" />
            </button>

            {showScoreInfo && (
              <p className="text-xs text-[#64748B] font-medium mb-3 -mt-2 bg-[#F1F5F9] rounded-xl p-2.5">
                ATS score estimates how well your resume parses in applicant-tracking
                systems: keyword match, formatting, and structure.
              </p>
            )}

            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 -rotate-90" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r={radius} fill="none" stroke="#E2E8F0" strokeWidth="14" />
                <circle
                  cx="70" cy="70" r={radius} fill="none"
                  stroke={accent} strokeWidth="14" strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  style={{ transition: "stroke-dashoffset 0.2s linear" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-[#0F172A] tabular-nums">
                  {animatedScore}
                </span>
                <span className="text-[10px] text-[#94A3B8] font-bold">/ 100</span>
              </div>
            </div>

            <p className="mt-4 font-bold text-sm" style={{ color: accent }}>
              {scoreLabel}
            </p>
          </div>

          <SectionCard
            section={sectionDefs.strengths}
            items={resume.strengths}
            emptyState="No standout strengths detected yet."
            renderItem={(item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[#475569] text-sm font-medium">
                <FaCheckCircle className="text-[#16A34A] mt-0.5 shrink-0" />
                {item}
              </li>
            )}
          />

          <SectionCard
            section={sectionDefs.missing}
            items={resume.missingSkills}
            emptyState="Nothing missing — nice work! 🎉"
            renderItem={(item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[#475569] text-sm font-medium">
                <FaTimesCircle className="text-[#DC2626] mt-0.5 shrink-0" />
                {item}
              </li>
            )}
          />
        </div>

        {/* Summary banner */}
        <div
          className="rounded-[2rem] border-4 border-[#0F172A] p-7 mb-6 relative"
          style={{ background: "linear-gradient(135deg, #2563EB, #4F46E5)" }}
        >
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white border-2 border-[#0F172A] flex items-center justify-center shrink-0">
                <FaClipboardList className="text-[#0F172A] text-sm" />
              </div>
              <h2 className="text-xl font-extrabold text-white">Summary</h2>
            </div>
            <button
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-white/90 bg-white/15 hover:bg-white/25 border-2 border-white/40 px-3 py-1.5 rounded-full transition"
            >
              <FaCopy className="text-[10px]" />
              Copy
            </button>
          </div>
          <p className="text-white leading-7 font-medium">{resume.summary}</p>
        </div>

        {/* Grammar + Roles */}
        <div className="grid md:grid-cols-2 gap-6">
          <SectionCard
            section={sectionDefs.grammar}
            items={resume.grammarSuggestions}
            emptyState="No grammar issues found."
            renderItem={(item, i) => (
              <li key={i} className="text-[#475569] text-sm font-medium border-l-4 border-[#2563EB] pl-3">
                {item}
              </li>
            )}
          />

          <SectionCard
            section={sectionDefs.roles}
            items={resume.recommendedRoles}
            emptyState="No role matches yet."
            renderItem={(item, i) => (
              <li key={i} className="inline-block mr-2 mb-2">
                <span className="text-sm font-bold text-[#4F46E5] bg-white px-3 py-1.5 rounded-full border-2 border-[#4F46E5] inline-block hover:bg-[#4F46E5] hover:text-white transition cursor-default">
                  {item}
                </span>
              </li>
            )}
          />
        </div>
      </div>

      <Toast message={toast} />
    </div>
  );
}

export default Dashboard;
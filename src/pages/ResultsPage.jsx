import { useState, useEffect } from "react";
import {
  ArrowLeft, Zap, Target, TrendingUp, AlertTriangle,
  CheckCircle, XCircle, ChevronDown, ChevronUp, Lightbulb,
  RefreshCw, Award, BarChart2
} from "lucide-react";

const VERDICT_CONFIG = {
  "Strong Match": { color: "text-acid-400", bg: "bg-acid-400/10", border: "border-acid-400/30", bar: "bg-acid-400" },
  "Good Match":   { color: "text-sky",      bg: "bg-sky/10",      border: "border-sky/30",      bar: "bg-sky" },
  "Partial Match":{ color: "text-yellow-400",bg: "bg-yellow-400/10",border:"border-yellow-400/30",bar: "bg-yellow-400" },
  "Weak Match":   { color: "text-coral",    bg: "bg-coral/10",    border: "border-coral/30",    bar: "bg-coral" },
};

const IMPORTANCE_CONFIG = {
  Critical: { color: "text-coral",       bg: "bg-coral/10",       border: "border-coral/20" },
  High:     { color: "text-yellow-400",  bg: "bg-yellow-400/10",  border: "border-yellow-400/20" },
  Medium:   { color: "text-sky",         bg: "bg-sky/10",         border: "border-sky/20" },
};

function ScoreRing({ score }) {
  const [displayed, setDisplayed] = useState(0);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = (displayed / 100) * circumference;

  useEffect(() => {
    let start = 0;
    const step = score / 60;
    const interval = setInterval(() => {
      start = Math.min(start + step, score);
      setDisplayed(Math.round(start));
      if (start >= score) clearInterval(interval);
    }, 16);
    return () => clearInterval(interval);
  }, [score]);

  const v = VERDICT_CONFIG[score >= 75 ? "Strong Match" : score >= 55 ? "Good Match" : score >= 35 ? "Partial Match" : "Weak Match"];

  return (
    <div className="relative w-40 h-40 flex items-center justify-center mx-auto">
      <svg className="absolute inset-0 -rotate-90" width="160" height="160" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="rgba(42,58,92,0.4)" strokeWidth="10" />
        <circle
          cx="80" cy="80" r={radius} fill="none"
          stroke={score >= 75 ? "#C8FF57" : score >= 55 ? "#57C8FF" : score >= 35 ? "#facc15" : "#FF6B6B"}
          strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          style={{ transition: "stroke-dashoffset 0.05s linear" }}
        />
      </svg>
      <div className="text-center">
        <div className={`font-display font-800 text-4xl ${v.color}`}>{displayed}</div>
        <div className="font-mono text-xs text-ink-600 mt-0.5">/ 100</div>
      </div>
    </div>
  );
}

function AnimatedBar({ value, color = "bg-acid-400" }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(value), 200);
    return () => clearTimeout(t);
  }, [value]);
  return (
    <div className="h-1.5 bg-ink-800 rounded-full overflow-hidden flex-1">
      <div className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${w}%` }} />
    </div>
  );
}

function BulletRewrite({ item, index }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div className="card rounded-xl overflow-hidden card-glow" style={{ animation: `fadeUp 0.5s ease ${index * 0.1}s both` }}>
      <button
        className="w-full px-5 py-4 flex items-start gap-3 text-left hover:bg-ink-800/40 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-mono text-xs text-acid-400 mt-1 flex-shrink-0">#{String(index + 1).padStart(2, "0")}</span>
        <div className="flex-1 min-w-0">
          <p className="font-mono text-xs text-ink-600 mb-1">ORIGINAL</p>
          <p className="text-sm text-white/60 leading-relaxed line-clamp-2">{item.original}</p>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-ink-600 flex-shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-ink-600 flex-shrink-0 mt-1" />}
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-ink-800/60">
          <div className="mt-4 p-4 rounded-xl bg-acid-400/5 border border-acid-400/20">
            <p className="font-mono text-xs text-acid-400 mb-2">✦ REWRITTEN</p>
            <p className="text-sm text-white leading-relaxed">{item.rewritten}</p>
          </div>
          <div className="mt-3 flex items-start gap-2">
            <Lightbulb className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-ink-600">{item.reason}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResultsPage({ analysis, fileName, onReset }) {
  const {
    ats_score, score_breakdown, verdict, summary,
    matched_keywords, missing_critical_keywords,
    bullet_rewrites, quick_wins, red_flags
  } = analysis;

  const vc = VERDICT_CONFIG[verdict] || VERDICT_CONFIG["Partial Match"];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-20 px-6 py-4 flex items-center justify-between border-b border-ink-800/60 bg-ink-950/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-acid-400 flex items-center justify-center">
            <Zap className="w-4 h-4 text-ink-950" />
          </div>
          <span className="font-display font-700 text-white text-lg tracking-tight">ATScore</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-ink-600 hidden sm:block">{fileName}</span>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-ink-800 hover:bg-ink-700 text-sm text-white/70 hover:text-white transition-all border border-ink-700"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            New Analysis
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-6">

        {/* ── Score Hero ── */}
        <div className="card rounded-3xl p-8" style={{ animation: "fadeUp 0.5s ease forwards" }}>
          <div className="grid sm:grid-cols-3 gap-8 items-center">
            <div className="text-center sm:text-left">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono mb-3 ${vc.bg} ${vc.border} ${vc.color} border`}>
                <Award className="w-3 h-3" />
                {verdict}
              </div>
              <h2 className="font-display text-3xl font-800 text-white leading-tight mb-2">ATS Score</h2>
              <p className="text-sm text-ink-600 leading-relaxed">{summary}</p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <ScoreRing score={ats_score} />
            </div>

            {/* Score breakdown */}
            <div className="space-y-3">
              {Object.entries(score_breakdown).map(([key, val]) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs text-ink-600 capitalize">{key.replace(/_/g, " ")}</span>
                    <span className="font-mono text-xs text-white">{val}</span>
                  </div>
                  <AnimatedBar value={val} color={val >= 70 ? "bg-acid-400" : val >= 45 ? "bg-sky" : "bg-coral"} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Keywords Row ── */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Matched */}
          <div className="card rounded-2xl p-6" style={{ animation: "fadeUp 0.55s ease forwards" }}>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-4 h-4 text-acid-400" />
              <h3 className="font-display font-700 text-white">Matched Keywords</h3>
              <span className="ml-auto font-mono text-xs text-acid-400 bg-acid-400/10 px-2 py-0.5 rounded-full">
                {matched_keywords.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {matched_keywords.map((kw) => (
                <span key={kw} className="px-3 py-1 rounded-full text-xs font-mono bg-acid-400/10 text-acid-400 border border-acid-400/20">
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Missing */}
          <div className="card rounded-2xl p-6" style={{ animation: "fadeUp 0.6s ease forwards" }}>
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="w-4 h-4 text-coral" />
              <h3 className="font-display font-700 text-white">Missing Keywords</h3>
              <span className="ml-auto font-mono text-xs text-coral bg-coral/10 px-2 py-0.5 rounded-full">
                {missing_critical_keywords.length}
              </span>
            </div>
            <div className="space-y-2.5">
              {missing_critical_keywords.map((item) => {
                const ic = IMPORTANCE_CONFIG[item.importance] || IMPORTANCE_CONFIG["Medium"];
                return (
                  <div key={item.keyword} className={`flex items-start gap-3 p-3 rounded-xl ${ic.bg} border ${ic.border}`}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`font-mono text-xs font-600 ${ic.color}`}>{item.keyword}</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${ic.bg} ${ic.color}`}>{item.importance}</span>
                      </div>
                      <p className="text-xs text-ink-600 leading-relaxed">{item.context}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Bullet Rewrites ── */}
        <div style={{ animation: "fadeUp 0.65s ease forwards" }}>
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-acid-400" />
            <h3 className="font-display text-xl font-700 text-white">AI Bullet Rewrites</h3>
            <span className="font-mono text-xs text-ink-600">Click to expand</span>
          </div>
          <div className="space-y-3">
            {bullet_rewrites.map((item, i) => (
              <BulletRewrite key={i} item={item} index={i} />
            ))}
          </div>
        </div>

        {/* ── Quick Wins + Red Flags ── */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="card rounded-2xl p-6" style={{ animation: "fadeUp 0.7s ease forwards" }}>
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-sky" />
              <h3 className="font-display font-700 text-white">Quick Wins</h3>
            </div>
            <ul className="space-y-3">
              {quick_wins.map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-white/70 leading-relaxed">
                  <span className="font-mono text-xs text-sky mt-0.5 flex-shrink-0">→</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {red_flags?.length > 0 && (
            <div className="card rounded-2xl p-6" style={{ animation: "fadeUp 0.75s ease forwards" }}>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <h3 className="font-display font-700 text-white">Red Flags</h3>
              </div>
              <ul className="space-y-3">
                {red_flags.map((flag, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/70 leading-relaxed">
                    <span className="font-mono text-xs text-yellow-400 mt-0.5 flex-shrink-0">!</span>
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="card rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ animation: "fadeUp 0.8s ease forwards" }}>
          <div>
            <p className="font-display font-700 text-white">Ready to improve?</p>
            <p className="text-sm text-ink-600">Apply the rewrites above and run another analysis.</p>
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-acid-400 text-ink-950 font-display font-700 hover:bg-acid-500 transition-all hover:shadow-[0_0_30px_rgba(200,255,87,0.2)]"
          >
            <RefreshCw className="w-4 h-4" />
            Analyse Again
          </button>
        </div>

      </main>
    </div>
  );
}

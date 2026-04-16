import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import {
  Upload, FileText, Zap, AlertCircle, CheckCircle, Loader2, ArrowRight, X
} from "lucide-react";

const LOADING_MESSAGES = [
  "Parsing your resume...",
  "Extracting keywords and skills...",
  "Comparing against job description...",
  "Running ATS simulation...",
  "Generating rewrite suggestions...",
  "Finalising your score...",
];

export default function UploadPage({ onResults }) {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState(0);
  const [error, setError] = useState("");

  const onDrop = useCallback((accepted) => {
    if (accepted[0]) {
      setFile(accepted[0]);
      setError("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    onDropRejected: () => setError("File rejected. Use a PDF or DOCX under 5MB."),
  });

  const handleSubmit = async () => {
    if (!file) return setError("Please upload your resume.");
    if (jd.trim().length < 50) return setError("Please paste a full job description (at least 50 characters).");
    setError("");
    setLoading(true);

    // Cycle loading messages
    let idx = 0;
    const interval = setInterval(() => {
      idx = Math.min(idx + 1, LOADING_MESSAGES.length - 1);
      setLoadMsg(idx);
    }, 2500);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jd);

      const res = await axios.post("https://silver-faun-43fe94.netlify.app/api/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      clearInterval(interval);
      onResults(res.data.analysis, file.name);
    } catch (err) {
      clearInterval(interval);
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-4">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-2 border-acid-400/20" />
          <div className="absolute inset-0 rounded-full border-t-2 border-acid-400 animate-spin360" />
          <div className="absolute inset-2 rounded-full border-t border-sky/40 animate-spin360" style={{ animationDuration: "2s", animationDirection: "reverse" }} />
          <Zap className="absolute inset-0 m-auto w-8 h-8 text-acid-400" />
        </div>
        <div className="text-center">
          <p className="font-display text-xl font-semibold text-white mb-2" key={loadMsg} style={{ animation: "fadeUp 0.4s ease forwards" }}>
            {LOADING_MESSAGES[loadMsg]}
          </p>
          <p className="text-ink-600 text-sm font-mono">AI is analysing your resume</p>
        </div>
        <div className="flex gap-1.5">
          {LOADING_MESSAGES.map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i <= loadMsg ? "w-8 bg-acid-400" : "w-2 bg-ink-700"}`} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-ink-800/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-acid-400 flex items-center justify-center">
            <Zap className="w-4 h-4 text-ink-950" />
          </div>
          <span className="font-display font-700 text-white text-lg tracking-tight">ATScore</span>
        </div>
        <span className="font-mono text-xs text-ink-600 hidden sm:block">Beat the bots. Land the interview.</span>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12 max-w-2xl" style={{ animation: "fadeUp 0.6s ease forwards" }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-acid-400/10 border border-acid-400/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-acid-400 animate-pulse2" />
            <span className="font-mono text-xs text-acid-400">AI-Powered ATS Analysis</span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl font-800 text-white leading-[1.05] mb-4">
            Will your resume<br />
            <span className="text-acid-400">beat the ATS?</span>
          </h1>
          <p className="text-ink-600 text-lg leading-relaxed">
            Upload your resume, paste the job description, and get an instant ATS score with missing keywords and AI-powered bullet rewrites.
          </p>
        </div>

        {/* Form */}
        <div className="w-full max-w-4xl grid sm:grid-cols-2 gap-4" style={{ animation: "fadeUp 0.7s ease forwards" }}>
          {/* Dropzone */}
          <div className="flex flex-col gap-2">
            <label className="font-display text-sm font-600 text-white/70 uppercase tracking-widest">
              01 — Resume
            </label>
            <div
              {...getRootProps()}
              className={`flex-1 min-h-[240px] rounded-2xl card card-glow cursor-pointer flex flex-col items-center justify-center gap-4 p-8 transition-all duration-200
                ${isDragActive ? "border-acid-400/60 bg-acid-400/5" : ""}
                ${file ? "border-acid-400/40" : ""}
              `}
            >
              <input {...getInputProps()} />
              {file ? (
                <>
                  <div className="w-14 h-14 rounded-xl bg-acid-400/10 border border-acid-400/30 flex items-center justify-center">
                    <FileText className="w-7 h-7 text-acid-400" />
                  </div>
                  <div className="text-center">
                    <p className="font-display font-600 text-white text-sm">{file.name}</p>
                    <p className="font-mono text-xs text-ink-600 mt-1">
                      {(file.size / 1024).toFixed(0)} KB · {file.name.endsWith(".pdf") ? "PDF" : "DOCX"}
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="flex items-center gap-1.5 text-xs text-ink-600 hover:text-coral transition-colors"
                  >
                    <X className="w-3 h-3" /> Remove
                  </button>
                </>
              ) : (
                <>
                  <div className={`w-14 h-14 rounded-xl border-2 border-dashed flex items-center justify-center transition-colors ${isDragActive ? "border-acid-400 bg-acid-400/10" : "border-ink-700"}`}>
                    <Upload className={`w-6 h-6 ${isDragActive ? "text-acid-400" : "text-ink-600"}`} />
                  </div>
                  <div className="text-center">
                    <p className="font-display font-600 text-white text-sm">
                      {isDragActive ? "Drop it here" : "Drag & drop your resume"}
                    </p>
                    <p className="font-mono text-xs text-ink-600 mt-1">PDF or DOCX · max 5MB</p>
                  </div>
                  <div className="px-4 py-2 rounded-lg bg-ink-800 border border-ink-700 text-xs text-ink-600 font-mono">
                    or click to browse
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Job Description */}
          <div className="flex flex-col gap-2">
            <label className="font-display text-sm font-600 text-white/70 uppercase tracking-widest">
              02 — Job Description
            </label>
            <textarea
              className="flex-1 min-h-[240px] rounded-2xl card p-5 font-body text-sm text-white/80 placeholder-ink-600 resize-none focus:outline-none focus:border-acid-400/40 transition-colors"
              placeholder="Paste the full job description here…&#10;&#10;Include requirements, responsibilities, and tech stack for the best analysis."
              value={jd}
              onChange={(e) => { setJd(e.target.value); setError(""); }}
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-coral/10 border border-coral/30 text-coral text-sm max-w-4xl w-full">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* CTA */}
        <div className="mt-6 flex flex-col items-center gap-3" style={{ animation: "fadeUp 0.8s ease forwards" }}>
          <button
            onClick={handleSubmit}
            disabled={!file || jd.trim().length < 50}
            className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-acid-400 text-ink-950 font-display font-700 text-lg transition-all duration-200 hover:bg-acid-500 hover:shadow-[0_0_40px_rgba(200,255,87,0.25)] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            Analyse My Resume
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="flex items-center gap-4 text-xs text-ink-600 font-mono">
            <span className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-acid-600" /> Free to use</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-acid-600" /> No signup needed</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-acid-600" /> Files never stored</span>
          </div>
        </div>
      </main>
    </div>
  );
}

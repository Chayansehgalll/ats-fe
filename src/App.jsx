import { useState } from "react";
import UploadPage from "./pages/UploadPage";
import ResultsPage from "./pages/ResultsPage";

export default function App() {
  const [view, setView] = useState("upload"); // "upload" | "loading" | "results"
  const [analysis, setAnalysis] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleResults = (data, name) => {
    setAnalysis(data);
    setFileName(name);
    setView("results");
  };

  const handleReset = () => {
    setAnalysis(null);
    setFileName("");
    setView("upload");
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div className="relative z-10">
        {view === "upload" && (
          <UploadPage onResults={handleResults} />
        )}
        {view === "results" && analysis && (
          <ResultsPage analysis={analysis} fileName={fileName} onReset={handleReset} />
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { Github, FileText, Sparkles, Copy, Check, Info, Code, AlertCircle } from "lucide-react";

const Home = () => {
  const [repoLink, setRepoLink] = useState("");
  const [generatedReadme, setGeneratedReadme] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const colors = {
    jacarta: "#3A345B",
    queenPink: "#F3C8DD",
    middlePurple: "#D183A9",
    oldLavender: "#71557A",
    brownChocolate: "#4B1535",
  };

  const copyToClipboard = () => {
    if (!generatedReadme || generatedReadme.startsWith("Error")) return;
    navigator.clipboard.writeText(generatedReadme);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleGenerate = async () => {
    if (!repoLink.trim()) {
      setGeneratedReadme("Error: Please paste a GitHub link.");
      return;
    }

    setGeneratedReadme("");
    setLoading(true);

    try {
   
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: repoLink }), 
      });

      const result = await response.json();

      if (!response.ok) {
    
        setGeneratedReadme(`Error: ${result.error || "Server issue."}`);
      } else {
       
        let text = result.generated_text;
        
        if (!text) {
          setGeneratedReadme("Error: The AI didn't return any text. Try again.");
          return;
        }

  
        if (text.includes("[/INST]")) {
          text = text.split("[/INST]")[1];
        }

        setGeneratedReadme(text.trim());
      }
    } catch (err) {
      console.error("Frontend Fetch Error:", err);
      setGeneratedReadme("Error: Connection failed.");
    } finally {
      setLoading(false);
    }
  };

 return (
    <div
      className="min-h-screen w-full flex flex-col items-center font-sans"
      style={{ backgroundColor: colors.middlePurple }}
    >
    
      <div className="max-w-5xl w-full grid grid-cols-1 pt-32 pb-20 px-4 md:px-8 lg:grid-cols-12 gap-6">
        
       
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white p-8 rounded-3xl shadow-lg flex-grow">
            <div className="flex items-center gap-2 mb-4" style={{ color: colors.brownChocolate }}>
              <Info size={20} />
              <h2 className="font-bold uppercase tracking-wider">How to use</h2>
            </div>

            <ul className="space-y-4">
              {[
                "Paste your public GitHub Repository URL.",
                "Wait for the AI to analyze the code.",
                "Copy the Markdown and you are done :3",
              ].map((step, idx) => (
                <li key={idx} className="flex gap-4">
                  <span
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: colors.oldLavender }}
                  >
                    {idx + 1}
                  </span>
                  <p style={{ color: colors.oldLavender }}>{step}</p>
                </li>
              ))}
            </ul>

            <div className="mt-8 p-4 rounded-xl" style={{ backgroundColor: colors.queenPink + "40" }}>
              <div className="flex items-center gap-2 mb-2" style={{ color: colors.jacarta }}>
                <Code size={16} />
                <span className="text-xs font-bold uppercase tracking-tighter">Important</span>
              </div>
              <p className="text-sm italic" style={{ color: colors.oldLavender }}>
               Make sure you enter a valid URL and the repo is public
              </p>
            </div>
          </div>
        </div>

       
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div
            className="bg-[#FAF9F6] p-8 rounded-3xl shadow-2xl flex flex-col h-full border-t-8"
            style={{ borderTopColor: colors.jacarta }}
          >
            <div className="mb-8">
              <label className="block text-sm font-bold mb-2 uppercase tracking-widest" style={{ color: colors.oldLavender }}>
                GitHub Repository
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none opacity-40">
                  <Github size={20} />
                </div>
                <input
                  type="text"
                  placeholder="https://github.com/username/projectname"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 outline-none transition-all focus:ring-2"
                  style={{ borderColor: colors.queenPink, color: colors.jacarta }}
                  value={repoLink}
                  onChange={(e) => setRepoLink(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                />
              </div>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full mt-4 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white shadow-lg transition-transform active:scale-95 hover:brightness-110 disabled:opacity-50"
                style={{ backgroundColor: colors.brownChocolate }}
              >
                {loading ? "Forging..." : <><Sparkles size={20} /> Generate README</>}
              </button>
            </div>

            <div className="flex flex-col flex-grow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold uppercase flex items-center gap-2" style={{ color: colors.oldLavender }}>
                  <FileText size={16} /> Output
                </span>
                {generatedReadme && !generatedReadme.startsWith("Error") && (
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-1 text-xs font-bold px-4 py-1.5 rounded-full transition-all active:scale-90 shadow-sm"
                    style={{
                      backgroundColor: isCopied ? "#4ade80" : colors.queenPink,
                      color: isCopied ? "#fff" : colors.brownChocolate,
                    }}
                  >
                    {isCopied ? <Check size={14} /> : <Copy size={14} />}
                    {isCopied ? "Copied!" : "Copy Content"}
                  </button>
                )}
              </div>

              <div
                className="flex-grow rounded-2xl p-6 overflow-auto font-mono text-sm border-2 min-h-[350px] shadow-inner"
                style={{ backgroundColor: colors.jacarta, color: colors.queenPink, borderColor: colors.jacarta }}
              >
                {loading ? (
                  <div className="h-full flex flex-col items-center justify-center italic opacity-60 space-y-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    <p>Writing it for you , please have patience...</p>
                  </div>
                ) : generatedReadme.startsWith("Error") ? (
                  <div className="h-full flex flex-col items-center justify-center text-red-400 text-center p-4">
                    <AlertCircle size={40} className="mb-2" />
                    <p className="font-bold">{generatedReadme}</p>
                    <p className="text-xs mt-2 opacity-70">Check Vercel Environment Variables & Redeploy</p>
                  </div>
                ) : generatedReadme ? (
                  <pre className="whitespace-pre-wrap">{generatedReadme}</pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
                    <Github size={48} className="mb-4" />
                    <p>Paste a link to begin.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
import { useRef, useState } from "react";

const InterestingScanIcon = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: "0 auto 24px", display: "block" }}>
    <circle cx="40" cy="40" r="40" fill="#E0F7F9"/>
    <circle cx="40" cy="40" r="38" fill="url(#paint0_linear)" fillOpacity="0.5"/>
    <path d="M54.5 49.5L60 55" stroke="#5FD4D8" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="44" cy="39" r="15" stroke="#5FD4D8" strokeWidth="3"/>
    <path d="M37 33H51M37 39H51M37 45H51" stroke="#5FD4D8" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
    <path d="M44 32V46" stroke="#5FD4D8" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
    <defs>
      <linearGradient id="paint0_linear" x1="40" y1="2" x2="40" y2="78" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffffff" stopOpacity="0.6"/>
        <stop offset="1" stopColor="#5FD4D8" stopOpacity="0.2"/>
      </linearGradient>
    </defs>
  </svg>
);

function App() {
  const fileInputRef = useRef(null);
  const [isHover, setIsHover] = useState(false);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [activeSection, setActiveSection] = useState("landing");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
      setError("");
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setFile(null);
    setPreview(null);
    setResult(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const navigateTo = (section) => {
    setActiveSection(section);
    window.scrollTo(0, 0);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/predict", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Prediction failed");
      setResult(data);
    } catch (err) {
      setError("Backend connection failed. Please ensure the server is running.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const NavItem = ({ label, target }) => (
    <span
      onClick={() => navigateTo(target)}
      style={{
        marginLeft: "24px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: activeSection === target ? "600" : "400",
        color: activeSection === target ? "#5fd4d8" : "#475569",
        transition: "color 0.2s ease",
      }}
    >
      {label}
    </span>
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3fbfc", fontFamily: 'system-ui, -apple-system, sans-serif', display: "flex", flexDirection: "column" }}>
      
      <header style={{ backgroundColor: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(10px)", borderBottom: "1px solid #e5eef0", position: "fixed", top: 0, width: "100%", zIndex: 1000 }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div onClick={() => navigateTo("landing")} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
            <img src="/logo.png" alt="DermAI Logo" style={{ width: "32px", height: "32px", borderRadius: "6px" }} />
            <strong style={{ fontSize: "18px", color: "#0f172a" }}>DermAI</strong>
          </div>
          <nav>
            <NavItem label="Home" target="home" />
            <NavItem label="How it works" target="how-it-works" />
            <NavItem label="About" target="about" />
          </nav>
        </div>
      </header>

      <main style={{ padding: "120px 16px 64px", flex: 1 }}>
        <div style={{ maxWidth: "850px", margin: "0 auto" }}>
          
          {activeSection === "landing" && (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              {/* Centered Logo and Brand Section */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
                <img 
                  src="/logo.png" 
                  alt="DermAI Logo" 
                  style={{ width: "80px", height: "80px", borderRadius: "16px", boxShadow: "0 10px 20px rgba(0,0,0,0.05)" }} 
                />
                <strong style={{ fontSize: "24px", color: "#0f172a", letterSpacing: "-0.5px" }}>DermAI</strong>
              </div>

              <h1 style={{ fontSize: "56px", fontWeight: "900", color: "#0f172a", marginBottom: "20px", lineHeight: "1.2" }}>
                AI-Powered <br /> <span style={{ color: "#5fd4d8" }}>Skin Health</span> Analysis
              </h1>
              <p style={{ fontSize: "20px", color: "#475569", marginBottom: "40px", maxWidth: "600px", margin: "0 auto 40px" }}>
                Detect potential skin concerns in seconds using advanced artificial intelligence. Private, fast, and easy to use.
              </p>
              <button 
                onClick={() => navigateTo("home")}
                style={{ 
                  padding: "18px 48px", 
                  fontSize: "18px", 
                  fontWeight: "700", 
                  backgroundColor: "#5fd4d8", 
                  color: "white", 
                  border: "none", 
                  borderRadius: "14px", 
                  cursor: "pointer",
                  boxShadow: "0 10px 25px rgba(95, 212, 216, 0.3)"
                }}
              >
                Start Analysis Now
              </button>
            </div>
          )}

          {activeSection === "home" && (
            <div style={{ textAlign: "center" }}>
              <h1 style={{ fontSize: "42px", fontWeight: "800", color: "#0f172a", marginBottom: "12px" }}>AI Skin Detection</h1>
              <p style={{ color: "#475569", marginBottom: "40px" }}>Fast, private, and powered by AI.</p>
              <div style={{ backgroundColor: "#ffffff", borderRadius: "24px", padding: "32px", boxShadow: "0 15px 35px rgba(0,0,0,0.05)" }}>
                <div
                  onClick={() => !isAnalyzing && fileInputRef.current.click()}
                  style={{ border: `2px dashed ${isHover ? "#5fd4d8" : "#cbd5e1"}`, backgroundColor: isHover ? "#faffff" : "transparent", borderRadius: "20px", padding: "50px 20px", cursor: isAnalyzing ? "wait" : "pointer", position: "relative" }}
                  onMouseEnter={() => setIsHover(true)}
                  onMouseLeave={() => setIsHover(false)}
                >
                  {preview ? (
                    <div style={{ position: "relative", display: "inline-block" }}>
                      {!isAnalyzing && (
                        <button
                          onClick={handleRemoveImage}
                          style={{
                            position: "absolute", top: "-10px", right: "-10px", width: "28px", height: "28px",
                            borderRadius: "50%", backgroundColor: "#ff4d4d", color: "white", border: "none",
                            cursor: "pointer", fontSize: "14px", fontWeight: "bold", display: "flex",
                            alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.2)", zIndex: 10
                          }}
                        >✕</button>
                      )}
                      <img src={preview} alt="Preview" style={{ maxWidth: "100%", maxHeight: "300px", borderRadius: "12px", filter: isAnalyzing ? "blur(4px)" : "none" }} />
                      {isAnalyzing && <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "#0f172a", fontWeight: "700", backgroundColor: "rgba(255,255,255,0.7)", padding: "8px 16px", borderRadius: "20px" }}>Analyzing...</div>}
                    </div>
                  ) : (
                    <><InterestingScanIcon /><h4>Upload Image</h4></>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFileChange} />
                </div>
                
                <button 
                  onClick={handleAnalyze} 
                  disabled={!file || isAnalyzing} 
                  style={{ width: "100%", marginTop: "32px", padding: "16px", backgroundColor: "#5fd4d8", color: "#ffffff", border: "none", borderRadius: "14px", fontWeight: "600", cursor: file && !isAnalyzing ? "pointer" : "not-allowed", opacity: file ? 1 : 0.6 }}
                >
                  {isAnalyzing ? "Processing..." : "Analyze Now"}
                </button>

                {error && <p style={{ color: "#ef4444", marginTop: "16px", fontWeight: "500" }}>{error}</p>}

                {result && (
                  <div style={{ marginTop: "24px", background: "#f0f9ff", padding: "24px", borderRadius: "16px", textAlign: "left", border: "1px solid #e0f2fe" }}>
                    <h3 style={{ color: "#0369a1", marginTop: 0 }}>Analysis Result</h3>
                    <p><b>Condition:</b> {result.predicted_class}</p>
                    <p><b>Confidence:</b> {result.confidence}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSection === "how-it-works" && (
            <div>
              <h2 style={{ fontSize: "32px", marginBottom: "24px" }}>How it Works</h2>
              <p style={{ color: "#475569", lineHeight: "1.6" }}>Our system uses deep learning models trained on thousands of clinical images to identify patterns associated with various skin conditions.</p>
            </div>
          )}
        </div>
      </main>

      <footer style={{ backgroundColor: "#ffffff", borderTop: "1px solid #e5eef0", padding: "40px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <img src="/logo.png" alt="Logo" style={{ width: "24px", height: "24px" }} />
              <strong style={{ color: "#0f172a" }}>DermAI</strong>
            </div>
            <p style={{ fontSize: "12px", color: "#94a3b8" }}>© 2026 DermAI Tech. All rights reserved.</p>
          </div>
          <div style={{ fontSize: "14px", color: "#64748b", display: "flex", gap: "24px" }}>
            <span onClick={() => navigateTo("privacy")} style={{ cursor: "pointer", fontWeight: activeSection === "privacy" ? "600" : "400" }}>Privacy Policy</span>
            <span onClick={() => navigateTo("terms")} style={{ cursor: "pointer", fontWeight: activeSection === "terms" ? "600" : "400" }}>Terms of Use</span>
            <span onClick={() => navigateTo("contact")} style={{ cursor: "pointer", fontWeight: activeSection === "contact" ? "600" : "400" }}>Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
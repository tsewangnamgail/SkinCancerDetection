import { useState } from "react";

function ImageUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/api/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
        textAlign: "left",
      }}
    >
      {/* Step 1 */}
      <h3 style={{ marginBottom: "12px", color: "#0f172a" }}>
        1️⃣ Upload Image
      </h3>

      <div
        style={{
          border: "2px dashed #cbd5e1",
          borderRadius: "12px",
          padding: "32px",
          textAlign: "center",
          marginBottom: "24px",
        }}
      >
        <p style={{ fontWeight: "600", marginBottom: "8px" }}>
          Upload Image for Analysis
        </p>
        <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "16px" }}>
          Drag and drop your skin lesion image here, or click to browse files.
        </p>

        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <div
          style={{
            marginTop: "12px",
            fontSize: "12px",
            color: "#64748b",
          }}
        >
          Supports JPG, PNG
        </div>
      </div>

      {/* Step 2 */}
      <h3 style={{ marginBottom: "12px", color: "#0f172a" }}>
        2️⃣ Analyze
      </h3>

      <button
        onClick={handleAnalyze}
        disabled={loading}
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "10px",
          border: "none",
          backgroundColor: "#38bdf8",
          color: "#ffffff",
          fontSize: "16px",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        {loading ? "Analyzing..." : "Analyze Lesion"}
      </button>

      {/* States */}
      {error && (
        <p style={{ marginTop: "16px", color: "red" }}>{error}</p>
      )}

      {loading && (
        <p style={{ marginTop: "16px", color: "#475569" }}>
          🔄 AI is analyzing the image. Please wait...
        </p>
      )}

      {result && (
        <div
          style={{
            marginTop: "24px",
            padding: "16px",
            borderRadius: "12px",
            backgroundColor: "#f0f9ff",
          }}
        >
          <h4 style={{ marginBottom: "8px" }}>Result</h4>
          <p>
          <b>Prediction:</b> {result.class_}
          </p>
          <p>
            <b>Confidence:</b> {result.confidence}
          </p>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;

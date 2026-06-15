import React from "react";

export default function ResultScreen({ loading, aiResult, currentStory, onReset }) {
  if (loading) {
    return (
      <div className="center-layout">
        <div className="spinner-loader"></div>
        <h3>Gemini AI is evaluating your response... 🤖</h3>
      </div>
    );
  }

  return (
    <div className="result-container">
      <h3 style={{ textAlign: "center", color: "#333" }}>Evaluation Dashboard</h3>
      
      <div className="score-badge">
        {aiResult.score} <span style={{ fontSize: "18px" }}>/ 10</span>
      </div>
      
      <div className="text-section">
        <strong style={{ color: "#495057" }}>Original AI Story:</strong>
        <p style={{ marginTop: "8px", color: "#666", lineHeight: "1.5" }}>{currentStory}</p>
      </div>

      <div className="text-section">
        <strong style={{ color: "#495057" }}>Gemini Feedback Analysis:</strong>
        <p className="feedback-text" style={{ color: aiResult.score >= 7 ? "#28a745" : "#d9534f" }}>
          {aiResult.feedback}
        </p>
      </div>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button className="btn-primary" onClick={onReset}>
          Generate Next Story
        </button>
      </div>
    </div>
  );
}
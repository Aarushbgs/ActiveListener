import React from "react";
import { useImpromptuTest } from "../hooks/useImpromptuTest";

export default function RandomStoryTest() {
  const {
    step, randomWords, timeLeft, userSpeech, loading, evalResult,
    startSpeakingTest, stopSpeakingTest, resetTest
  } = useImpromptuTest();

  if (loading && step === 1) {
    return (
      <div className="center-layout">
        <div className="spinner-loader"></div>
        <h3>Gemini is picking random creative words...</h3>
      </div>
    );
  }

  return (
    <div>
    
      {step === 1 && (
        <div className="center-layout">
          <h2 style={{ color: "#333" }}>Impromptu Story Telling 🚀</h2>
          <p className="subtext">Connect these 3 random keywords into a single creative story:</p>
          
          <div style={{ display: "flex", gap: "10px", margin: "15px 0" }}>
            {randomWords.map((word, idx) => (
              <span key={idx} style={{ background: "#eff6ff", color: "#2563eb", padding: "8px 16px", borderRadius: "20px", fontWeight: "700", border: "1px solid #bfdbfe" }}>
                {word}
              </span>
            ))}
          </div>

          <p style={{ color: "#666", fontSize: "14px", maxWidth: "450px" }}>
            Press the button below, your mic will activate instantly. You have 60 seconds to speak your story aloud.
          </p>

          <button className="btn-primary" onClick={startSpeakingTest}>
            Start Speaking Now
          </button>
        </div>
      )}

      
      {step === 2 && (
        <div className="center-layout">
          <h3 style={{ color: "#d9534f" }}>🔴 Record Mode: Start Telling Your Story</h3>
          <div className="timer-text">00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</div>
          
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${(timeLeft / 60) * 100}%` }}></div>
          </div>

          <div style={{ background: "#f8f9fa", width: "100%", padding: "15px", borderRadius: "8px", border: "1px dashed #ccc", minHeight: "80px", textAlign: "left" }}>
            <strong style={{ fontSize: "12px", color: "#999" }}>LIVE SPEECH TRANSCRIPTION:</strong>
            <p style={{ marginTop: "5px", color: "#444" }}>{userSpeech || "Start speaking, words will appear here..."}</p>
          </div>

          <button className="btn-danger" onClick={stopSpeakingTest}>
            Finish & Evaluate
          </button>
        </div>
      )}

      {step === 3 && (
        <div>
          {loading ? (
            <div className="center-layout">
              <div className="spinner-loader"></div>
              <h3>Gemini is decoding your voice metrics... 🧠📊</h3>
            </div>
          ) : (
            evalResult && (
              <div className="result-container">
                <h3 style={{ textAlign: "center", color: "#333", marginBottom: "15px" }}>Behavioral & Fluency Analysis</h3>
                
                <div className="score-badge">
                  {evalResult.overallScore} <span style={{ fontSize: "16px" }}>/ 10</span>
                </div>

               
                <div style={{ margin: "20px 0", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", fontWeight: "600" }}>
                      <span>Confidence & Fluency</span> <span>{evalResult.confidence}/10</span>
                    </div>
                    <div className="progress-container" style={{ height: "6px" }}>
                      <div className="progress-bar" style={{ width: `${evalResult.confidence * 10}%`, backgroundColor: "#2563eb" }}></div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", fontWeight: "600" }}>
                      <span>Creative Plot Generation</span> <span>{evalResult.creativity}/10</span>
                    </div>
                    <div className="progress-container" style={{ height: "6px" }}>
                      <div className="progress-bar" style={{ width: `${evalResult.creativity * 10}%`, backgroundColor: "#eab308" }}></div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", fontWeight: "600" }}>
                      <span>Grammar & Vocabulary</span> <span>{evalResult.grammar}/10</span>
                    </div>
                    <div className="progress-container" style={{ height: "6px" }}>
                      <div className="progress-bar" style={{ width: `${evalResult.grammar * 10}%`, backgroundColor: "#10b981" }}></div>
                    </div>
                  </div>
                </div>

                <div className="text-section">
                  <strong style={{ color: "#495057" }}>Coach Feedback:</strong>
                  <p className="feedback-text" style={{ color: "#333", fontWeight: "normal" }}>{evalResult.analysis}</p>
                </div>

                <div style={{ textAlign: "center" }}>
                  <button className="btn-primary" onClick={resetTest}>Try New Challenge</button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
import React from "react";

export default function StartScreen({ onStart }) {
  return (
    <div className="center-layout">
      <p style={{ color: "#555", lineHeight: "1.6" }}>
        When you click <b>Start Test</b>, Gemini AI will dynamically generate a unique story and read it aloud. 
        Listen carefully! Once it stops, you will have exactly 1 minute to repeat what you heard.
      </p>
      <button className="btn-primary" onClick={onStart}>
        Start Test
      </button>
    </div>
  );
}
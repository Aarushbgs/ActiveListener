import React from "react";

export default function RecordingScreen({ timeLeft, onStop }) {
  return (
    <div className="center-layout">
      <h3 style={{ color: "#d9534f" }}>🔴 Microphone Active: Repeat the Story</h3>
      <div className="timer-text">
        00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
      </div>
      
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${(timeLeft / 60) * 100}%` }}></div>
      </div>
      
      <button className="btn-danger" onClick={onStop}>
        Done / Stop Recording
      </button>
    </div>
  );
}
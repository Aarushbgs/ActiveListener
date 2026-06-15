import React from "react";

export default function ListeningScreen({ statusMessage }) {
  return (
    <div className="center-layout">
      <div className="spinner-loader"></div>
      <h3 style={{ color: "#2563eb" }}>{statusMessage}</h3>
      <p className="subtext">Focus completely on the narration. Your microphone will turn on next.</p>
    </div>
  );
}
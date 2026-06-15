// src/App.js
import React, { useState } from "react";
import ActiveVoiceTest from "./components/ActiveVoiceTest";
import RandomStoryTest from "./components/RandomStoryTest";
import "./App.css";

export default function App() {
  const [activeTab, setActiveTab] = useState("component1");

  return (
    <div className="container">
    
      <div className="navbar">
        <button
          className={activeTab === "component1" ? "active" : ""}
          onClick={() => setActiveTab("component1")}
        >
          Active Voice Test
        </button>

        <button
          className={activeTab === "component2" ? "active" : ""}
          onClick={() => setActiveTab("component2")}
        >
          Spoken Test
        </button>
      </div>

  
   <div className="content-box">
        {activeTab === "component1" ? <ActiveVoiceTest /> : <RandomStoryTest />}
      </div>
    </div>
  );
}
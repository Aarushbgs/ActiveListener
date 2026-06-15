import React from "react";
import StartScreen from "./StartScreen";
import ListeningScreen from "./ListeningScreen";
import RecordingScreen from "./RecordingScreen";
import ResultScreen from "./ResultScreen";
import { useVoiceTest } from "../hooks/useVoiceTest";

export default function ActiveVoiceTest() {
  const {
    step, currentStory, timeLeft, aiResult, loading, statusMessage,
    generateAndPlayStory, stopRecording, resetTest
  } = useVoiceTest();

  return (
    <div>
      {step === 1 && <StartScreen onStart={generateAndPlayStory} />}
      {step === 2 && <ListeningScreen statusMessage={statusMessage} />}
      {step === 3 && <RecordingScreen timeLeft={timeLeft} onStop={stopRecording} />}
      {step === 4 && (
        <ResultScreen 
          loading={loading} 
          aiResult={aiResult} 
          currentStory={currentStory} 
          onReset={resetTest} 
        />
      )}
    </div>
  );
}
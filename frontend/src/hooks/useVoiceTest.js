
import { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const BACKEND_URL = "http://localhost:5000";



export function useVoiceTest() {
  const [currentStory, setCurrentStory] = useState("");
  const [step, setStep] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [aiResult, setAiResult] = useState({ score: null, feedback: "" });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  

  const [userSpokenText, setUserSpokenText] = useState("");

  const timerRef = useRef(null);
  const recognitionRef = useRef(null); 

  const generateAndPlayStory = async () => {
    setStep(2);
    setStatusMessage("Gemini is crafting a unique story... 🤖📝");
    window.speechSynthesis.cancel();

    try {
      const response = await fetch(`${BACKEND_URL}/api/generate-story`);
      const data = await response.json();
      
      setCurrentStory(data.story);
      playAudioStory(data.story);
    } catch (error) {
      console.error("Failed to fetch story from backend:", error);
      const localFallback = "On this beautiful day, a chef named Leo prepared exactly 5 blue cupcakes in his central kitchen.";
      setCurrentStory(localFallback);
      playAudioStory(localFallback);
    }
  };



  const playAudioStory = (storyText) => {
    setStatusMessage("Listen carefully to the story... 🎧");
    const utterance = new SpeechSynthesisUtterance(storyText);
    utterance.lang = "en-US";
    utterance.onend = () => {
      setStep(3);
      startVoiceRecognition();
    };
    window.speechSynthesis.speak(utterance);
  };






  const startVoiceRecognition = () => {
    setTimeLeft(60);
    setUserSpokenText("");


    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition. Please use Google Chrome.");
      setStep(1);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let speechToTextResult = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        speechToTextResult += event.results[i].transcript;
      }
  
      setUserSpokenText((prev) => prev + " " + speechToTextResult);
    };

    recognition.onerror = (err) => {
      console.error("Speech Recognition Error:", err);
    };

    recognition.onend = () => {
    
    };

    recognitionRef.current = recognition;
    recognition.start();

  
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };




  const stopRecording = () => {
    clearInterval(timerRef.current);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    setTimeout(() => {
      evaluateWithGeminiBackend();
    }, 800);
  };



 const evaluateWithGeminiBackend = async () => {
    setLoading(true);
    setStep(4);

    setUserSpokenText((latestSpokenText) => {
      const textToEvaluate = latestSpokenText.trim() || "[User did not say anything or microphone didn't capture]";
      
      (async () => {
        try {
          const response = await fetch(`${BACKEND_URL}/api/evaluate-listening`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              originalStory: currentStory,
              userSpeech: textToEvaluate
            })
          });

          if (!response.ok) {
            throw new Error("Backend response error");
          }

          const parsedData = await response.json();

          setAiResult({
            score: parsedData.score || 4,
            feedback: parsedData.feedback || "Evaluation compiled successfully."
          });
        } catch (error) {
          console.error("Network Evaluation Error:", error);
          setAiResult({ score: 5, feedback: "Failed to fetch evaluation from backend server." });
        } finally {
          setLoading(false);
        }
      })();

      return latestSpokenText;
    });
  };


  const resetTest = () => {
    window.speechSynthesis.cancel();
    clearInterval(timerRef.current);
    if (recognitionRef.current) recognitionRef.current.stop();
    setStep(1);
    setCurrentStory("");
    setUserSpokenText("");
    setAiResult({ score: null, feedback: "" });
    setTimeLeft(60);
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      clearInterval(timerRef.current);
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  return {
    step, currentStory, timeLeft, aiResult, loading, statusMessage,
    generateAndPlayStory, stopRecording, resetTest
  };
}
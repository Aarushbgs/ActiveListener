import { useState, useEffect, useRef } from "react";


const BACKEND_URL = "https://activelistener.onrender.com";

export function useImpromptuTest() {
  const [step, setStep] = useState(1); 
  const [randomWords, setRandomWords] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [userSpeech, setUserSpeech] = useState("");
  const [loading, setLoading] = useState(false);
  const [evalResult, setEvalResult] = useState(null);

  const timerRef = useRef(null);
  const recognitionRef = useRef(null);

 
  const generateTopics = async () => {
  setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/generate-words`);
      const data = await response.json();
      setRandomWords(data.words);
    } catch (error) {
      console.error("Failed to fetch words:", error);
      setRandomWords(["Time-Machine", "Coffee", "Dinosaur"]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateTopics();
  }, []);



  const startSpeakingTest = () => {
    setStep(2);
    setTimeLeft(60);
    setUserSpeech("");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Browser speech recognition not supported. Use Chrome!");
      setStep(1);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let currentResult = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentResult += event.results[i].transcript;
      }
      setUserSpeech((prev) => prev + " " + currentResult);
    };

    recognitionRef.current = recognition;
    recognition.start();

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopSpeakingTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopSpeakingTest = () => {
    clearInterval(timerRef.current);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setTimeout(() => {
      evaluateImpromptuStory();
    }, 500);
  };



  const evaluateImpromptuStory = async () => {

   setLoading(true);
    setStep(3);

    setUserSpeech((latestSpeech) => {
      const textToEvaluate = latestSpeech.trim() || "[User remained silent or microphone was muted]";

      (async () => {
        try {
          const response = await fetch(`${BACKEND_URL}/api/evaluate-impromptu`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              tags: randomWords,
              userSpeech: textToEvaluate
            })
          });

          if (!response.ok) throw new Error("Server communication break");

          const data = await response.json();
          setEvalResult(data);
        } catch (error) {
          console.error("Backend connection crashed:", error);
          setEvalResult({
            overallScore: 5,
            confidence: 5,
            creativity: 5,
            grammar: 5,
            analysis: "Could not connect to backend server. Check if node server.js is running on port 5000."
          });
        } finally {
          setLoading(false);
        }
      })();

      return latestSpeech;
    });
        
      
  };

  const resetTest = () => {
    clearInterval(timerRef.current);
    if (recognitionRef.current) recognitionRef.current.stop();
    setStep(1);
    setEvalResult(null);
    setUserSpeech("");
    setTimeLeft(60);
    generateTopics();
  };

  return {
    step, randomWords, timeLeft, userSpeech, loading, evalResult,
    startSpeakingTest, stopSpeakingTest, resetTest
  };
}

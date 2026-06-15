const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();

app.use(cors()); 
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY ;
const ai = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = ai.getGenerativeModel({  model: "gemini-2.5-flash" }); 



app.get('/login', (req, res) => {
  console.log('Hii I am Aarush'); 
  res.send('Hello from the backend!');
});


app.get('/api/generate-story', async (req, res) => {
  try {
    const generationPrompt = `
      Write a random, unique 3-sentence creative short story in plain English for an active listening test. 
      Vary the themes drastically (space, magic, cooking, animals, sports, history). 
      Include 1 unique character name and 2 specific items. Output ONLY the story text without markdown.
    `;
    
    const result = await model.generateContent(generationPrompt);
    const generatedStory = result.response.text().trim();
    
    return res.status(200).json({ story: generatedStory });
  } catch (error) {
    console.error("Gemini Story Generation Error:", error);
    
    const fallback = `On this beautiful day, a chef named Leo prepared exactly ${Math.floor(Math.random() * 10) + 2} blue cupcakes in his central kitchen. Suddenly, his cat jumped on the counter.`;
    return res.status(200).json({ story: fallback });
  }
});


app.post('/api/evaluate-listening', async (req, res) => {
  try {
    const { originalStory, userSpeech } = req.body;

    const evaluationPrompt = `
      You are an advanced Active Listening Evaluation Expert.
      Carefully compare the 'Original Story' against the 'User Spoken Transcription'.
      
      Original Story: "${originalStory}"
      User Spoken Transcription: "${userSpeech}"

      Calculate an accurate, strict retention score from 1 to 10 based on how many exact facts, names, adjectives, and items the user successfully remembered.
      If the transcription is empty or says user did not say anything, give a score of 1.
      
      Respond exclusively in raw, valid JSON matching the schema below without markdown code blocks.
      {
        "score": <Integer between 1 and 10>,
        "feedback": "<A concise summary in English stating exactly what facts they recalled and what explicit details they overlooked.>"
      }
    `;

    const result = await model.generateContent(evaluationPrompt);
    const cleanJsonText = result.response.text().replace(/```json|```/g, "").trim();
    const parsedData = JSON.parse(cleanJsonText);

    return res.status(200).json(parsedData);
  } catch (error) {
    console.error("Gemini Evaluation Error:", error);
    return res.status(500).json({ score: 5, feedback: "Internal server analysis failed. Please try again." });
  }
});



app.get('/api/generate-words', async (req, res) => {
  try {
    const prompt = "Give me exactly 3 completely random, interesting, and distinct nouns/objects/themes in English for a 1-minute impromptu story telling test. Return them strictly as a comma-separated list without numbers. Example: Rocket, Chocolate, Umbrella";
    
    const result = await model.generateContent(prompt);
    const words = result.response.text().trim().split(",").map(w => w.trim());
    
    if (words.length === 3) {
      return res.status(200).json({ words });
    } else {
      throw new Error("Invalid format received from Gemini");
    }
  } catch (error) {
    console.error("Gemini Words Generation Error:", error);
    // Secure Fallback if API limits hit
    const fallbacks = [
      ["Castle", "Laptop", "Monkey"],
      ["Time-Machine", "Coffee", "Dinosaur"],
      ["Submarine", "Pizza", "Guitar"]
    ];
    const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    return res.status(200).json({ words: randomFallback });
  }
});


app.post('/api/evaluate-impromptu', async (req, res) => {
  try {
    const { tags, userSpeech } = req.body;

    const evaluationPrompt = `
      You are an advanced English Communication Coach and Behavioral Analyst.
      Evaluate this Impromptu Story Told by the user based on these 3 prompt words: ${tags.join(", ")}.
      User's Speech Transcript: "${userSpeech}"

      Analyze their communication on the following metrics out of 10:
      1. Confidence Level (Based on flow, pacing, and presence of hesitations)
      2. Creativity (How nicely they connected the 3 random words into a narrative)
      3. Vocabulary & Grammar

      Respond exclusively in raw, valid JSON format matching this schema without markdown block formatting:
      {
        "overallScore": <Average out of 10>,
        "confidence": <Score out of 10>,
        "creativity": <Score out of 10>,
        "grammar": <Score out of 10>,
        "analysis": "<Detailed, highly practical, constructive breakdown of their delivery, mentioning if they used all 3 words or not.>"
      }
    `;

    const result = await model.generateContent(evaluationPrompt);
    const cleanJson = result.response.text().replace(/```json|```/g, "").trim();
    const parsedData = JSON.parse(cleanJson);

    return res.status(200).json(parsedData);
  } catch (error) {
    console.error("Gemini Impromptu Evaluation Error:", error);
    return res.status(500).json({
      overallScore: 6,
      confidence: 6,
      creativity: 6,
      grammar: 6,
      analysis: "Internal backend error while parsing speech. Great attempt at organizing thoughts under pressure!"
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

router.post("/generate-quiz", async (req, res) => {
  const { categoryName, softwares } = req.body;

  try {

    // Limit to avoid token overflow
    const limitedSoftwares = softwares.slice(0, 10);

    const softwareList = limitedSoftwares
      .map(s => `- ${s.name}: ${s.description}`)
      .join("\n");

    const prompt = `
You are generating quiz questions for a Software Encyclopedia website.

Category: ${categoryName}

These softwares belong to this category:
${softwareList}

Generate 5 multiple choice questions based ONLY on:
- The category
- The softwares listed above
- Their purpose and features

Return strictly in this JSON format:
[
  {
    "question": "string",
    "options": ["option1", "option2", "option3", "option4"],
    "correctAnswer": 0
  }
]

Do NOT add explanation.
Do NOT add markdown.
Return only JSON.
`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      }
    );

    let text = response.data.candidates[0].content.parts[0].text;

    console.log("RAW GEMINI RESPONSE:", text);

    text = text.replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const questions = JSON.parse(text);

    res.json(questions);

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Quiz generation failed" });
  }
});

module.exports = router;

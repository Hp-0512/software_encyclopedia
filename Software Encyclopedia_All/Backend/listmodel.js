require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

(async () => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const models = await genAI.listModels();

    models.forEach(m => {
      console.log(
        m.name,
        "→ supports:",
        m.supportedGenerationMethods
      );
    });
  } catch (err) {
    console.error(err);
  }
})();

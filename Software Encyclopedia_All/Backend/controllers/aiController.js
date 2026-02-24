const aiService = require("../services/aiServices");

exports.handleChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Message is required" });
    }

    const reply = await aiService.generateReply(message);

    res.json({ reply });
  } catch (error) {
    console.error("AI Controller Error:", error);
    res.status(500).json({ reply: "AI service failed" });
  }
};

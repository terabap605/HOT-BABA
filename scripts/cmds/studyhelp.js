const axios = require("axios");

module.exports = {
  config: {
    name: "studyhelp",
    aliases: ["ask", "eduai"],
    role: 0,
    shortDescription: "Get AI-powered answers for study questions",
    category: "study",
    guide: ".studyhelp What is gravity?"
  },
  onStart: async function ({ message, args }) {
    const question = args.join(" ");
    if (!question) return message.reply("❗ Please enter your study question.");

    try {
      const res = await axios.post("https://api.safone.dev/chatgpt", {
        message: question
      });

      const reply = res.data.message || "🤖 Couldn't find a good answer.";
      message.reply(`📘 Answer:\n${reply}`);
    } catch (err) {
      message.reply("❌ Failed to fetch answer. Try again later.");
    }
  }
};

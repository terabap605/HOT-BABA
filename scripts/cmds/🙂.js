const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "🙂",
    version: "1.0",
    author: "Bayjid x ChatGPT",
    countDown: 0,
    role: 0,
    shortDescription: "🙂 emoji pathale video dei",
    longDescription: "User jodi 🙂 emoji pathay, bot ekta video reply dey",
    category: "no prefix",
    guide: "Just send 🙂"
  },

  onStart: async function () {},

  onChat: async function ({ message, event }) {
    try {
      if (event.body === "🙂") {
        const videoPath = path.join(__dirname, "cache", "smile.mp4");

        if (!fs.existsSync(videoPath)) {
          return message.reply("⚠️ Video file paoa jacche na vai!");
        }

        const styledText = "🌟 𝗞𝗜𝗥𝗘 𝗣𝗔𝗚𝗢𝗟?\n𝗔𝗠𝗥 𝗕𝗢𝗦𝗦 𝗥𝗔𝗛𝗔𝗗 𝗞𝗢𝗜 🤗🔥";

        return message.reply({
          body: styledText,
          attachment: fs.createReadStream(videoPath)
        });
      }
    } catch (err) {
      console.error("🙂 CMD Error:", err);
      return message.reply("❌ Bhul hoye gese video pathanor somoy.");
    }
  }
};

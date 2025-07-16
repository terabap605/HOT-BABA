const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "autovoice",
  version: "1.3.0",
  hasPermssion: 0,
  credits: "ChatGPT + Bayjid",
  description: "Send voice when someone sends 😒 (no prefix)",
  commandCategory: "auto",
  usages: "Just send 😒 (without any prefix or text)",
  cooldowns: 0
};

module.exports.handleEvent = async function ({ event, api }) {
  if (!event.body) return;
  const text = event.body.trim();

  if (text === "😒") {
    const filePath = path.join(__dirname, "..", "cache", "autovoice", "voice1.mp3");
    if (fs.existsSync(filePath)) {
      return api.sendMessage({ attachment: fs.createReadStream(filePath) }, event.threadID);
    }
  }
};

// ✅ Add this empty onStart to fix error
module.exports.onStart = async function () {
  // no action needed here
};

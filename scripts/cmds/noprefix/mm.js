const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "mm",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "MrTomXxX",
  description: "Send a voice when 🙂 emoji is used",
  commandCategory: "no prefix",
  usages: "🙂",
  cooldowns: 5,
};

module.exports.handleEvent = function({ api, event }) {
  const { threadID, messageID, body } = event;
  if (!body) return;

  // Trigger when the message contains the 🙂 emoji
  if (body.includes("🙂")) {
    const filePath = path.join(__dirname, "xf.mp3");
    if (!fs.existsSync(filePath)) {
      return api.sendMessage("❌ Voice file not found!", threadID, messageID);
    }

    const msg = {
      body: "Here's your voice 😏",
      attachment: fs.createReadStream(filePath)
    };

    api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("🎧", messageID, () => {}, true);
  }
};

module.exports.run = function() {};

const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "😒",
    version: "1.0",
    author: "Bayjid",
    countDown: 0,
    role: 0,
    shortDescription: "Send voice message",
    longDescription: "Sends a Messenger-style voice when 😒 is typed",
    category: "noPrefix",
    guide: "😒"
  },

  onStart: async function () {},

  onChat: async function ({ event, api }) {
    if (event.body === "😒") {
      const voicePath = path.join(__dirname, "rahad_voice.mp4");
      return api.sendMessage({
        attachment: fs.createReadStream(voicePath)
      }, event.threadID, event.messageID);
    }
  }
};

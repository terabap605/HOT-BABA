const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "😒",
    version: "1.0",
    author: "Bayjid",
    countDown: 0,
    role: 0,
    shortDescription: "Send Messenger-style voice",
    longDescription: "Send converted voice from Drive",
    category: "noPrefix",
    guide: "😒"
  },

  onStart: async function () {
    const voiceUrl = "https://drive.google.com/uc?export=download&id=12B4Fjs11jZQpN1Kh7Gd7msICGwGKTZFq";
    const savePath = path.join(__dirname, "rahad_voice.mp4");

    // Only download if file doesn't exist
    if (!fs.existsSync(savePath)) {
      const res = await axios({ url: voiceUrl, method: "GET", responseType: "stream" });
      const writer = fs.createWriteStream(savePath);
      res.data.pipe(writer);
      await new Promise(resolve => writer.on("finish", resolve));
      console.log("Voice downloaded from Drive");
    }
  },

  onChat: async function ({ event, api }) {
    if (event.body === "😒") {
      const voicePath = path.join(__dirname, "rahad_voice.mp4");
      if (fs.existsSync(voicePath)) {
        return api.sendMessage({
          attachment: fs.createReadStream(voicePath)
        }, event.threadID, event.messageID);
      } else {
        return api.sendMessage("❌ Voice file missing.", event.threadID);
      }
    }
  }
};

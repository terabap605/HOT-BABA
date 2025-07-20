const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "emojiVoice",
    version: "1.3",
    author: "Father Rahad",
    role: 0,
    shortDescription: {
      en: "Send voice when 😄 is detected"
    },
    longDescription: {
      en: "Detect 😄 emoji and reply with a cheerful voice"
    },
    category: "auto",
    guide: {
      en: "Just send 😄 in group to get the vibe!"
    }
  },

  onStart: async function () {},

  onChat: async function ({ message, event }) {
    try {
      const msgBody = event.body || "";

      if (msgBody.includes("😄")) {
        const voiceUrl = "https://drive.google.com/uc?export=download&id=13Jr2kZeMHOaVwsrX-FGBkwHmnOK3YkLm";

        const response = await axios.get(voiceUrl, {
          responseType: "arraybuffer"
        });

        const cacheDir = path.join(__dirname, "cache");
        if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

        const filePath = path.join(cacheDir, `emojiVoice_${event.messageID}.mp3`);
        fs.writeFileSync(filePath, response.data);

        await message.reply({
          body: `╭━━━〔 🎧 MOOD VOICE ALERT 〕━━━╮\n😄 • A cheerful vibe has been detected...\n📥 Enjoy the voice of happiness!\n╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
          attachment: fs.createReadStream(filePath)
        });

        setTimeout(() => {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }, 60 * 1000);
      }

    } catch (err) {
      console.error("EmojiVoice Error:", err);
    }
  }
};

const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "emojiVoice",
    version: "1.0",
    author: "Father Rahad",
    role: 0,
    shortDescription: {
      en: "Send voice when 🙂 is detected"
    },
    longDescription: {
      en: "Detect 🙂 emoji and reply with voice from Drive"
    },
    category: "auto",
    guide: {
      en: "No command needed. Just send 🙂 in group."
    }
  },

  onStart: async function () {},

  onChat: async function ({ message, event, api }) {
    try {
      const msgBody = event.body || "";

      // Detect 🙂 emoji
      if (msgBody.includes("🙂")) {
        const voiceUrl = "https://drive.google.com/uc?export=download&id=13CWeUhyeyX6Yd-AX9IxWuCmkN8u8IDQL";

        const response = await axios.get(voiceUrl, {
          responseType: "arraybuffer"
        });

        const filePath = path.join(__dirname, "cache", `emojiVoice_${event.messageID}.mp3`);
        fs.writeFileSync(filePath, Buffer.from(response.data, "utf-8"));

        await message.reply({
          body: "😄 Here's your mood voice!",
          attachment: fs.createReadStream(filePath)
        });

        // Optional: Delete after send to save space
        setTimeout(() => fs.unlinkSync(filePath), 60 * 1000);
      }

    } catch (err) {
      console.error("EmojiVoice Error:", err);
    }
  }
};

const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "emojiVoice",
    version: "1.1",
    author: "Father Rahad",
    role: 0,
    shortDescription: {
      en: "Send voice when 🥺 is detected"
    },
    longDescription: {
      en: "Detect 🥺 emoji and reply with voice from Drive"
    },
    category: "auto",
    guide: {
      en: "No command needed. Just send 🥺 in group."
    }
  },

  onStart: async function () {},

  onChat: async function ({ message, event }) {
    try {
      const msgBody = event.body || "";

      // Detect 🥺 emoji
      if (msgBody.includes("🥺")) {
        const voiceUrl = "https://drive.google.com/uc?export=download&id=13F1nJNnmyXS-H6kL6-00DPmOzjaDmZmc";

        const response = await axios.get(voiceUrl, {
          responseType: "arraybuffer"
        });

        const cacheDir = path.join(__dirname, "cache");
        if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

        const filePath = path.join(cacheDir, `emojiVoice_${event.messageID}.mp3`);
        fs.writeFileSync(filePath, response.data);

        await message.reply({
          body: `╭──🎧 𝗘𝗠𝗢𝗧𝗜𝗢𝗡𝗔𝗟 𝗥𝗘𝗦𝗣𝗢𝗡𝗦𝗘 ──╮\n🥺 Voice attached for this mood...\n╰────────────────────────────╯`,
          attachment: fs.createReadStream(filePath)
        });

        // Delete the file after 1 minute
        setTimeout(() => {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }, 60 * 1000);
      }

    } catch (err) {
      console.error("EmojiVoice Error:", err);
    }
  }
};

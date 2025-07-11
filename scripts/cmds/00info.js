const axios = require("axios");

module.exports = {
  config: {
    name: "info",
    aliases: ["owner", "dev", "creator"],
    version: "5.6",
    author: "BaYjid",
    role: 0,
    shortDescription: {
      en: "Bot owner info with Date Note style"
    },
    longDescription: {
      en: "Displays owner info with styled title and fonts + random video."
    },
    category: "Info",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event }) {
    const ownerID = "100005193854879";

    // Author protection
    if (this.config.author !== "BaYjid") {
      await api.sendMessage(
        `⚠️ Warning! The command "info" was run but author has been changed from "BaYjid" to "${this.config.author}".`,
        ownerID
      );
      return api.sendMessage(
        "❌ This command is protected. Author mismatch detected.",
        event.threadID
      );
    }

    // Random video ID pool (6 videos)
    const videoIDs = [
      "10QycYgsTagrN90cWJCIWWVwmps2kk_oF",  // 1
      "10BQjmmp2isPM47CtEZVhYySDQ1lSiCjW",  // 2
      "10aeHJzXq0kJIGdh9E7lfUKYD0oHqz2o3",  // 3
      "10Ke-d2H4yhGpwwAgRt0HmFV8lRB-QJ2J",  // 4
      "10Jb5FGt600rNrJgr-XeTfZsCSjknJep1",  // 5
      "10CDv_le5rdnOYXF3Kp6bnvTSyWvuwHFb"   // 6
    ];
    const selectedID = videoIDs[Math.floor(Math.random() * videoIDs.length)];
    const videoURL = `https://drive.google.com/uc?export=download&id=${selectedID}`;

    // Owner Information Text
    const ownerInfo = `
𝐗𝐀𝐒𝐒 𝐑𝐀 𝐇 𝐀 𝐃
━━━━━━━━━━━━━━━━
👤 Name        : 𝙍𝙖𝙝𝙖𝙙 (Itadori Yuji)
🧠 Title       : 𝗖𝘂𝗿𝘀𝗲𝗱 𝗖𝗼𝗱𝗲 𝗠𝗮𝘀𝘁𝗲𝗿
🛠️ Skills      : JavaScript, Bots, UI Sorcery
🎌 From        : 🇧🇩 Bangladesh

🗓️ Join Date   : 01-01-2023
🆚 Version     : v4.5.2
🔗 Website     : https://xass-api.vercel.app/
📞 Contact     : +8801734822042
🎮 Favorite Tech : Node.js, React, AI Bots

🔗 Facebook    : fb.com/Arc D. Blade
📧 Email       : bbzhot11@gmail.com

🔮 Motto       : "𝗖𝗼𝗱𝗲 𝘄𝗶𝘁𝗵 𝗵𝗼𝗻𝗼𝗿, 𝗳𝗶𝗴𝗵𝘁 𝘄𝗶𝘁𝗵 𝗵𝗲𝗮𝗿𝘁."
━━━━━━━━━━━━━━━━
🔥 Team        : 𝐗𝐀𝐒𝐒 𝐑𝐀 𝐇 𝐀 𝐃 🚀
━━━━━━━━━━━━━━━━`;

    try {
      const response = await axios({
        method: "GET",
        url: videoURL,
        responseType: "stream"
      });

      api.sendMessage({
        body: ownerInfo,
        attachment: response.data
      }, event.threadID);
    } catch (error) {
      console.error("❌ Video fetch failed:", error.message);
      api.sendMessage("⚠️ Couldn't load the video. Please check the Drive link and ensure it's public.", event.threadID);
    }
  }
};

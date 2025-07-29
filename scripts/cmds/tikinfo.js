const axios = require("axios");
const fs = require("fs");

async function getBaseApiUrl() {
  try {
    const res = await axios.get("https://raw.githubusercontent.com/itzaryan008/ERROR/refs/heads/main/raw/api.json");
    return res.data.apis;
  } catch {
    return null;
  }
}

module.exports = {
  config: {
    name: "tikinfo",
    version: "0.0.1",
    author: "Rahad",
    countDown: 5,
    role: 0,
    shortDescription: "Get TikTok user info",
    longDescription: "Fetch TikTok user details by username",
    category: "tiktok",
    guide: {
      en: "{pn} username"
    }
  },

  onStart: async function ({ message, event, args }) {
    const username = args.join(" ");
    if (!username) {
      return message.reply("⚠️ Please provide a valid TikTok username.\n\n📌 Usage: tikinfo username");
    }

    const base = await getBaseApiUrl();
    if (!base) {
      return message.reply("❌ Could not fetch API base URL.");
    }

    try {
      const res = await axios.get(`${base}/tikstalk`, {
        params: { username }
      });

      const data = res.data;
      if (!data.username) return message.reply("❌ User not found or API failed.");

      const avatar = data.avatarLarger;
      const stream = (await axios.get(avatar, { responseType: "stream" })).data;

      const messageBody =
`👤 𝗧𝗶𝗸𝗧𝗼𝗸 𝗣𝗿𝗼𝗳𝗶𝗹𝗲 𝗜𝗻𝗳𝗼

🆔 𝗨𝘀𝗲𝗿𝗻𝗮𝗺𝗲: ${data.username}
📛 𝗡𝗶𝗰𝗸𝗻𝗮𝗺𝗲: ${data.nickname || "N/A"}
❤️ 𝗟𝗶𝗸𝗲𝘀: ${data.heartCount || 0}
👥 𝗙𝗼𝗹𝗹𝗼𝘄𝗲𝗿𝘀: ${data.followerCount || 0}
🔁 𝗙𝗼𝗹𝗹𝗼𝘄𝗶𝗻𝗴: ${data.followingCount || 0}
🎬 𝗩𝗶𝗱𝗲𝗼𝘀: ${data.videoCount || 0}
🔗 𝗥𝗲𝗹𝗮𝘁𝗶𝗼𝗻: ${data.relation || "N/A"}`;

      await message.reply({
        body: messageBody,
        attachment: stream
      });

    } catch (err) {
      console.error("❌ TikInfo error:", err);
      return message.reply(`❌ Error: ${err.response?.data?.message || err.message}`);
    }
  }
};

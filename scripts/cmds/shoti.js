const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "shoti",
    version: "1.0.2",
    author: "Rahad",
    countDown: 5,
    role: 0,
    shortDescription: "Send a random TikTok shoti video",
    longDescription: "Random shoti (TikTok short) video with caption details",
    category: "media",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ message, event }) {
    try {
      const apiIndex = await axios.get("https://raw.githubusercontent.com/shaonproject/Shaon/main/api.json");
      const baseUrl = apiIndex.data?.alldl;

      if (!baseUrl) {
        return message.reply("❌ API লিংক পাওয়া যায়নি।");
      }

      const res = await axios.get(`${baseUrl}/api/shoti`);
      let data = res.data;

      if (Array.isArray(data)) {
        if (data.length === 0) {
          return message.reply("❌ কোনো ভিডিও পাওয়া যায়নি।");
        }
        data = data[Math.floor(Math.random() * data.length)];
      }

      const videoUrl = data.shotiurl || data.url;
      if (!videoUrl) {
        return message.reply("❌ ভিডিও URL পাওয়া যায়নি।");
      }

      const caption =
        `🎬 𝗧𝗶𝘁𝗹𝗲: ${data.title || "N/A"}\n` +
        `👤 𝗨𝘀𝗲𝗿: @${data.username || "N/A"}\n` +
        `📛 𝗡𝗶𝗰𝗸𝗻𝗮𝗺𝗲: ${data.nickname || "N/A"}\n` +
        `🌍 𝗥𝗲𝗴𝗶𝗼𝗻: ${data.region || "N/A"}\n` +
        `⏱️ 𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻: ${data.duration || "N/A"} sec\n` +
        `👑 𝗢𝗽𝗲𝗿𝗮𝘁𝗼𝗿: ${data.operator || "N/A"}`;

      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

      const fileName = `shoti_${Date.now()}.mp4`;
      const filePath = path.join(cacheDir, fileName);

      const writer = fs.createWriteStream(filePath);
      const videoStream = await axios.get(videoUrl, { responseType: "stream" });
      videoStream.data.pipe(writer);

      writer.on("finish", async () => {
        await message.reply({
          body: caption,
          attachment: fs.createReadStream(filePath)
        });
        fs.unlinkSync(filePath); // Cleanup
      });

      writer.on("error", (err) => {
        console.error("❌ ভিডিও সেভ করতে সমস্যা:", err);
        message.reply("⚠️ ভিডিও ফাইল সেভ করতে সমস্যা হয়েছে!");
      });

    } catch (err) {
      console.error("❌ Shoti API error:", err.message);
      message.reply("❌ শটী ভিডিও আনতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।");
    }
  }
};

const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "🐍",
    version: "3.0",
    author: "Bayjid x ChatGPT",
    countDown: 0,
    role: 0,
    shortDescription: "🐍 emoji reply with stylish boss line",
    longDescription: "Send random Rahad boss video with styled text on 🐍 emoji",
    category: "no prefix",
    guide: "Just send 🐍"
  },

  onStart: async function () {
    // Prevent load errors
  },

  onChat: async function ({ message, event }) {
    if (event.body !== "🐍") return;

    const videos = [
      { id: "115D_MgCY_NR4Pg8gHa1SHvSJ6EiAifi-", fileName: "rahad1.mp4" },
      { id: "11Fo0vE4CSTawLNWSPUoyK0Ye7-dJ2Z9T", fileName: "rahad2.mp4" },
      { id: "1198auGFbw3ddyYjQh8BR_y5BP3CSml7f", fileName: "rahad3.mp4" }
    ];

    const chosen = videos[Math.floor(Math.random() * videos.length)];
    const cacheDir = path.join(__dirname, "cache");
    const filePath = path.join(cacheDir, chosen.fileName);

    await fs.ensureDir(cacheDir);

    if (!fs.existsSync(filePath)) {
      try {
        const url = `https://drive.google.com/uc?export=download&id=${chosen.id}`;
        const response = await axios({ method: "GET", url, responseType: "stream" });
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);
        await new Promise((resolve, reject) => {
          writer.on("finish", resolve);
          writer.on("error", reject);
        });
      } catch (err) {
        console.error("Download error:", err);
        return message.reply("❌ Boss, video download e error hoise.");
      }
    }

    const bodyText = "🌪️ 𝗞𝗜𝗥𝗘 𝗡𝗔𝗚𝗜𝗡 🐍\n🥵 𝗧𝗨𝗜 𝗞𝗜 𝗔𝗠𝗥 𝗕𝗢𝗦𝗦 𝗥𝗔𝗛𝗔𝗗 𝗞𝗘 𝗞𝗔𝗠𝗢𝗥 𝗗𝗜𝗕𝗜 𝗡𝗔𝗞𝗜 🥺🔥";

    return message.reply({
      body: bodyText,
      attachment: fs.createReadStream(filePath)
    });
  }
};

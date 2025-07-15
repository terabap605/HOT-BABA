const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`
  );
  return base.data.api;
};

module.exports = {
  config: {
    name: "i",
    version: "1.0.6",
    author: "Dipto",
    countDown: 2,
    role: 0,
    description: {
      en: "Download video from TikTok, Facebook, Instagram, YouTube, and more",
    },
    category: "MEDIA",
    guide: {
      en: "[media_link] or reply with link",
    },
  },

  onStart: async function ({ api, args, event }) {
    const input = event.messageReply?.body || args[0];
    if (!input) {
      return api.setMessageReaction("❌", event.messageID, () => {}, true);
    }

    try {
      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      const cleanUrl = input.trim().split("?")[0]; // clean tracking params
      const apiBase = await baseApiUrl();

      // Skip Imgur inside main logic
      if (cleanUrl.includes("i.imgur.com")) {
        const ext = path.extname(cleanUrl);
        const imgName = `dipto${ext}`;
        const imgPath = path.join(__dirname, "cache", imgName);

        const imgRes = await axios.get(cleanUrl, { responseType: "arraybuffer" });
        await fs.ensureDir(path.join(__dirname, "cache"));
        fs.writeFileSync(imgPath, imgRes.data);

        api.sendMessage({
            body: `✅ | Downloaded from Imgur`,
            attachment: fs.createReadStream(imgPath),
          },
          event.threadID,
          () => fs.unlinkSync(imgPath),
          event.messageID
        );
        return;
      }

      // Proceed with general media download
      const res = await axios.get(`${apiBase}/alldl?url=${encodeURIComponent(cleanUrl)}`);
      const fileUrl = res.data?.result;

      if (!fileUrl) {
        throw new Error("🚫 No downloadable media found.");
      }

      const filePath = path.join(__dirname, "cache", "vid.mp4");
      await fs.ensureDir(path.join(__dirname, "cache"));

      const video = (await axios.get(fileUrl, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(filePath, video);

      const shortUrl = await global.utils.shortenURL(fileUrl);

      api.setMessageReaction("✅", event.messageID, () => {}, true);
      api.sendMessage({
          body: `${res.data.cp || "🎬 Video"}\n🔗 Link: ${shortUrl}`,
          attachment: fs.createReadStream(filePath),
        },
        event.threadID,
        () => fs.unlinkSync(filePath),
        event.messageID
      );
    } catch (error) {
      api.setMessageReaction("❎", event.messageID, () => {}, true);
      api.sendMessage(
        `❌ Download failed: ${error.response?.status || ""} ${error.message || "Unknown error"}`,
        event.threadID,
        event.messageID
      );
    }
  },
};

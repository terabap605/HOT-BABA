const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const gdown = require("gdown");

const configPath = __dirname + "/uptime_config.json";

const boldText = (text) => {
  const boldMap = {
    'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚',
    'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡',
    'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨',
    'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
    'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴',
    'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻',
    'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂',
    'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
    '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰',
    '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
  };
  return text.split('').map(c => boldMap[c] || c).join('');
};

async function downloadVideoFromDrive(fileId, dest) {
  const url = `https://drive.google.com/uc?id=${fileId}`;
  return gdown(url, dest);
}

module.exports.config = {
  name: "uptime",
  aliases: ["upt"],
  version: "1.9",
  author: "Mostakim + Cyclopean",
  cooldowns: 5,
  role: 0,
  shortDescription: "Show bot uptime or get a random video.",
  longDescription: "Display bot uptime info or fetch a random video from Google Drive.",
  category: "system",
  guide: "uptime\nuptime video\nuptime --image on/off",
  usePrefix: false
};

module.exports.run = async function({ api, event, args, usersData, threadsData }) {
  try {
    const argStr = args.join(" ").toLowerCase();

    let config = {};
    if (fs.existsSync(configPath)) {
      config = JSON.parse(fs.readFileSync(configPath));
    } else {
      config = { image: false };
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    }

    if (argStr === "video") {
      const videoIDs = [
        "14FiHDIPj8MZqv4itCh1q4uV8Ojz5HWg3",
        "140LKYXVzTK56kkkg8SU4poAIPqTrKdQE",
        "14D-bsfdZYPYvg_Yf8mOgr7cRHHmqP3bA",
        "14BMZtZX7xL1mcmBmkBSfUkIzU8u6dWiL",
        "1438ucuUmT8TVWf4lPlQ1ldwPC5HKxYiK",
        "141TBdkwUdMzB-G4l3nz7naW_JYXyzdOh"
      ];

      const randomId = videoIDs[Math.floor(Math.random() * videoIDs.length)];
      const localPath = path.join(__dirname, `temp_${randomId}.mp4`);

      try {
        await downloadVideoFromDrive(randomId, localPath);

        await api.sendMessage({
          body: `🎬 Here's a random video from Drive! (File ID: ${randomId})`,
          attachment: fs.createReadStream(localPath)
        }, event.threadID);
      } catch (err) {
        console.error("Video download/send error:", err);
        await api.sendMessage("❌ Failed to send video. Please try again.", event.threadID);
      } finally {
        if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
      }
      return;
    }

    // Toggle image mode on/off
    if (argStr.includes("--image on")) {
      config.image = true;
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      return api.sendMessage("✅ Image mode is now ON.", event.threadID);
    } else if (argStr.includes("--image off")) {
      config.image = false;
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      return api.sendMessage("✅ Image mode is now OFF.", event.threadID);
    }

    // Regular uptime display
    const allUsers = await usersData.getAll();
    const allThreads = await threadsData.getAll();
    const uptime = process.uptime();

    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const uptimeFormatted = `${hours}h ${minutes}m ${seconds}s`;
    const totalUsers = allUsers.length.toLocaleString();
    const totalThreads = allThreads.length.toLocaleString();

    const timeZone = "Asia/Dhaka";
    const currentTime = moment().tz(timeZone).format("YYYY-MM-DD HH:mm:ss");
    const startTime = moment().subtract(uptime, "seconds").tz(timeZone).format("YYYY-MM-DD HH:mm:ss");

    const message = `
🎇🎆━━━━━━━━━━━━━━━━━━━━━━━━━━━🎆🎇

🛡️🕹️ 𝕌ℙ𝕋𝕀𝕄𝔼 & 𝔹𝕆𝕋 𝕊𝕋𝔸𝕋𝕌𝕊 🕹️🛡️

───────────────────────────────

⌛ 𝗨𝗽𝘁𝗶𝗺𝗲      : ✨ ${boldText(uptimeFormatted)} ✨
🌍 𝗧𝗶𝗺𝗲𝘇𝗼𝗻𝗲   : 🌐 ${boldText(timeZone)}
⏰ 𝗖𝘂𝗿𝗿𝗲𝗻𝘁 𝘁𝗶𝗺𝗲 : 🕰️ ${boldText(currentTime)}
🚀 𝗦𝘁𝗮𝗿𝘁𝗲𝗱 𝗮𝘁 : 🚀 ${boldText(startTime)}

───────────────────────────────

👥 𝗧𝗼𝘁𝗮𝗹 𝗨𝘀𝗲𝗿𝘀   : 🧑‍🤝‍🧑 ${boldText(totalUsers)}
💬 𝗔𝗰𝘁𝗶𝘃𝗲 𝗧𝗵𝗿𝗲𝗮𝗱𝘀 : 💭 ${boldText(totalThreads)}

───────────────────────────────

🕹️ 𝙏𝙧𝙮 𝙤𝙪𝙩:  ${boldText("uptime video")}  🎬
💡 𝙏𝙤𝗴𝗴𝗹𝗲 𝗜𝗺𝗮𝗴𝗲:  ${boldText("--image on / --image off")}

🎇🎆━━━━━━━━━━━━━━━━━━━━━━━━━━━🎆🎇
`;

    if (config.image) {
      const imageUrl = "http://160.191.129.54:5000/cdn/zYMnhVKfG.jpg";
      const imgPath = __dirname + "/uptime.jpg";
      try {
        const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(imgPath, Buffer.from(response.data));
        return api.sendMessage({
          body: message,
          attachment: fs.createReadStream(imgPath)
        }, event.threadID, () => fs.unlinkSync(imgPath));
      } catch (err) {
        console.error("Image download error:", err);
        return api.sendMessage(message + "\n\n⚠️ Image download failed, showing text only.", event.threadID);
      }
    } else {
      return api.sendMessage(message, event.threadID);
    }

  } catch (error) {
    console.error("Uptime Error:", error);
    return api.sendMessage("❌ Sorry, I couldn't fetch the uptime info right now.", event.threadID);
  }
};

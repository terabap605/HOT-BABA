const os = require("os");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { GoatWrapper } = require("fca-liane-utils");

module.exports = {
  config: {
    name: "uptime",
    aliases: ["up", "upt", "s"],
    version: "2.4",
    author: "Rahad",
    role: 0,
    shortDescription: "Show bot uptime info",
    longDescription: "Display stylish uptime, system stats, RAM, prefix, threads, etc. + 1 random video",
    category: "system",
    guide: "{pn}"
  },

  onStart: async function ({ message, threadsData }) {
    const uptime = process.uptime();
    const days = Math.floor(uptime / (60 * 60 * 24));
    const hours = Math.floor((uptime % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((uptime % (60 * 60)) / 60);
    const seconds = Math.floor(uptime % 60);

    const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    const cpu = os.cpus()[0].model;
    const cores = os.cpus().length;
    const platform = os.platform();
    const arch = os.arch();
    const nodeVersion = process.version;
    const hostname = os.hostname();

    const totalMem = os.totalmem() / 1024 / 1024;
    const freeMem = os.freemem() / 1024 / 1024;
    const usedMem = totalMem - freeMem;

    const prefix = global.GoatBot.config.PREFIX || "/";
    const totalThreads = await threadsData.getAll().then(t => t.length);
    const totalCommands = global.GoatBot.commands.size;

    const line = "═".repeat(40);
    const box = `
╔${line}╗
║ 🛠️  𝗚𝗼𝗮𝘁𝗕𝗼𝘁 𝗨𝗽𝘁𝗶𝗺𝗲 & 𝗦𝘆𝘀𝘁𝗲𝗺 𝗦𝘁𝗮𝘁𝘀
╟${line}╢
║ ⏳ 𝗨𝗽𝘁𝗶𝗺𝗲        : ${uptimeString}
║ ⚙️ 𝗖𝗣𝗨           : ${cpu} (${cores} cores)
║ 🧠 𝗥𝗔𝗠 𝗨𝘀𝗲𝗱     : ${usedMem.toFixed(2)} MB / ${totalMem.toFixed(2)} MB
║ 💾 𝗣𝗹𝗮𝘁𝗳𝗼𝗿𝗺      : ${platform} (${arch})
║ 🖥️ 𝗛𝗼𝘀𝘁𝗻𝗮𝗺𝗲      : ${hostname}
║ 🔢 𝗧𝗵𝗿𝗲𝗮𝗱𝘀      : ${totalThreads}
║ 🧩 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀     : ${totalCommands}
║ 🧪 𝗡𝗼𝗱𝗲.𝗷𝘀       : ${nodeVersion}
║ 🪄 𝗣𝗿𝗲𝗳𝗶𝘅        : ${prefix}
║ 👑 𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗿     : Rahad
╚${line}╝`;

    // Random Google Drive video IDs
    const videoIDs = [
      "15xtmJVgnV17adWasOdA5Sdgg8n0kgE_q",
      "15yKUEaswoAVCfECQTMy9VMPvi8IxkxPx",
      "16Jtul1Ozhmo-FsPCoYSHb_G0kvKhVXvv",
      "16HiaguJf8FYsYpIiBTa9SyRHSM0OlWtT",
      "16FOo9cE7toZIcCuCU9_f_yMuIupbRgAB",
      "16FFiuA4KtYKKDcPr08XHbRLn1nRVjsiW",
      "168LO9aZher8Nhs325OBKrZNdKQdWVcHv"
    ];
    const selectedID = videoIDs[Math.floor(Math.random() * videoIDs.length)];
    const videoUrl = `https://drive.google.com/uc?export=download&id=${selectedID}`;
    const videoPath = path.join(__dirname, "cache", `uptime_${Date.now()}.mp4`);

    try {
      const res = await axios.get(videoUrl, { responseType: "arraybuffer" });
      fs.ensureDirSync(path.dirname(videoPath));
      fs.writeFileSync(videoPath, Buffer.from(res.data, "binary"));

      await message.reply({
        body: box,
        attachment: fs.createReadStream(videoPath)
      }, () => fs.unlinkSync(videoPath));
    } catch (error) {
      console.error("🚫 Video download failed:", error.message);
      await message.reply(`${box}\n⚠️ But video failed to load.`);
    }
  }
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });

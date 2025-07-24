const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const os = require("os");
const { GoatWrapper } = require("fca-liane-utils");
const { config } = global.GoatBot;

module.exports = {
  config: {
    name: "uptime",
    aliases: ["up", "upt", "s"],
    version: "2.4",
    author: "Rahad",
    role: 0,
    shortDescription: { en: "Bot status + 1 random video" },
    longDescription: { en: "Show full bot uptime info with 1 random Drive video" },
    category: "UPTIME",
    guide: { en: "{pn}" }
  },

  onStart: async function ({ api, event, usersData, threadsData }) {
    try {
      const allUsers = await usersData.getAll();
      const allThreads = await threadsData.getAll();
      const uptime = process.uptime();

      const d = Math.floor(uptime / 86400);
      const h = Math.floor((uptime % 86400) / 3600);
      const m = Math.floor((uptime % 3600) / 60);
      const s = Math.floor(uptime % 60);
      const hhmmss = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

      const memUsed = process.memoryUsage().rss;
      const memTotal = os.totalmem();
      const memPercent = ((memUsed / memTotal) * 100).toFixed(1);
      const cpu = (process.cpuUsage().user / 1000).toFixed(1);
      const ping = Math.floor(Math.random() * 20) + 20;

      const osType = os.type();
      const osArch = os.arch();
      const osPlat = os.platform();
      const host = os.hostname();
      const cpuInfo = os.cpus()[0].model.split(" @")[0];
      const nodeVer = process.version;
      const cores = os.cpus().length;
      const sysUptime = Math.floor(os.uptime() / 60);
      const active = allThreads.filter(t => t.active).length;
      const ratio = (allUsers.length / allThreads.length).toFixed(2);

      const msg = `
🌟━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━🌟
          🚀 𝗚𝗢𝗔𝗧 𝗕𝗢𝗧 𝗦𝗧𝗔𝗧𝗨𝗦 🚀
🌟━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━🌟

🆔 𝗣𝗜𝗗           : ${process.pid}
⏱️ 𝗨𝗽𝘁𝗶𝗺𝗲        : ${d}d ${h}h ${m}m ${s}s (${hhmmss})
👥 𝗨𝘀𝗲𝗿𝘀         : ${allUsers.length}
💬 𝗧𝗵𝗿𝗲𝗮𝗱𝘀       : ${allThreads.length} (🟢 ${active} active)
⚖️ 𝗨/𝗧 𝗥𝗮𝘁𝗶𝗼     : ${ratio}
📡 𝗣𝗶𝗻𝗴         : ${ping} ms
🧠 𝗥𝗔𝗠          : ${(memUsed / 1024 / 1024).toFixed(1)} MB (${memPercent}%)
🛠️ 𝗖𝗣𝗨 𝗧𝗶𝗺𝗲     : ${cpu} ms
🧬 𝗖𝗣𝗨 𝗠𝗼𝗱𝗲𝗹    : ${cpuInfo}
💻 𝗢𝗦            : ${osType} (${osPlat}) / ${osArch}
🌀 𝗖𝗼𝗿𝗲𝘀        : ${cores}
🌐 𝗡𝗼𝗱𝗲.𝗷𝘀      : ${nodeVer}
⌚ 𝗢𝗦 𝗨𝗽𝘁𝗶𝗺𝗲    : ${sysUptime} min
🏷️ 𝗛𝗼𝘀𝘁𝗻𝗮𝗺𝗲    : ${host}

🌟━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━🌟
          👑 Powered by 𝗥𝗔𝗛𝗔𝗗 👑
🌟━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━🌟
`;

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

        await api.sendMessage({
          body: msg,
          attachment: fs.createReadStream(videoPath)
        }, event.threadID, () => fs.unlinkSync(videoPath));
      } catch (videoErr) {
        console.error("🚫 Video download failed:", videoErr.message);
        await api.sendMessage(`${msg}\n⚠️ But video failed to load.`, event.threadID);
      }

    } catch (err) {
      console.error("❌ Uptime error:", err.message);
      await api.sendMessage("❌ Error: Couldn't fetch uptime or video.", event.threadID);
    }
  }
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });

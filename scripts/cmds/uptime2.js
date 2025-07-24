const os = require('os');
const util = require('util');
const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const exec = util.promisify(require('child_process').exec);

module.exports = {
  config: {
    name: "uptime2",
    aliases: ["up2", "stats"],
    version: "2.2",
    author: "BaYjid + Rahad Edit",
    role: 0,
    category: "system",
    guide: { en: "Use {p}uptime2" }
  },

  onStart: async function ({ message }) {
    try {
      const botUptime = formatUptimeFull(process.uptime());
      const systemUptime = formatUptimeFull(os.uptime());
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const usedMem = totalMem - freeMem;
      const memPercent = ((usedMem / totalMem) * 100).toFixed(1);
      const cpuUsagePercent = await getCpuUsagePercent();
      const diskUsage = await getDiskUsageSafe();

      const systemInfo = {
        os: `${os.type()} ${os.release()}`,
        arch: os.arch(),
        cpuModel: os.cpus()[0].model.trim(),
        cpuCores: os.cpus().length,
        loadAvg: os.loadavg()[0].toFixed(2),
        botUptime,
        systemUptime,
        processMem: prettyBytes(process.memoryUsage().rss)
      };

      const response = 
`╔═✦✧═✦✧═✦✧═✦✧═✦✧═✦✧═✦✧═✦✧═╗
        ⚡✨ 𝗦𝘆𝘀𝘁𝗲𝗺 𝗜𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻 ✨⚡
╚═✦✧═✦✧═✦✧═✦✧═✦✧═✦✧═✦✧═✦✧═╝

💻 ❯ 𝗢𝗦 & 𝗛𝗮𝗿𝗱𝘄𝗮𝗿𝗲
──────────────────────────────
⚙️ • OS           : ${systemInfo.os}
🧩 • Architecture : ${systemInfo.arch}
🖥️ • Processor    : ${systemInfo.cpuModel} (${systemInfo.cpuCores} cores)
🔥 • Load Average : ${systemInfo.loadAvg}
⚡ • CPU Load %   : ${cpuUsagePercent}%

🧠 ❯ 𝗠𝗲𝗺𝗼𝗿𝘆 𝗨𝘀𝗮𝗴𝗲
──────────────────────────────
💾 • RAM Used     : ${prettyBytes(usedMem)} / ${prettyBytes(totalMem)} (${memPercent}%)
🤖 • Bot RAM     : ${systemInfo.processMem}

💽 ❯ 𝗗𝗶𝘀𝗸 𝗨𝘀𝗮𝗴𝗲
──────────────────────────────
📀 • Storage     : ${diskUsage}

⏳ ❯ 𝗨𝗽𝘁𝗶𝗺𝗲 𝗗𝗲𝘁𝗮𝗶𝗹𝘀
──────────────────────────────
🕒 • Bot        : ${botUptime}
⏰ • Server     : ${systemUptime}

⚙️ ❯ 𝗣𝗿𝗼𝗰𝗲𝘀𝘀 𝗜𝗻𝗳𝗼
──────────────────────────────
🧮 • Memory     : ${systemInfo.processMem}

╚═✦✧═✦✧═✦✧═✦✧═✦✧═✦✧═✦✧═✦✧═╝
              🔥 R𝗮𝗛𝗔𝗗 𝗕𝗢𝗧 🔥`;

      const videoIDs = [
        "1-BPrxFpmwuoG1V3WkivuR4j-EaTqwtHl",
        "10Jb5FGt600rNrJgr-XeTfZsCSjknJep1",
        "10CDv_le5rdnOYXF3Kp6bnvTSyWvuwHFb",
        "10n-t589ieM6QwB8DwsAfBCAz8QQpOSBf",
        "1199EHI9JgABBCGfGw709sOvIol4J9AQE",
        "1113pJ8_n2CZSMpweO7PEfSKkL4FmHB24",
        "11-ztanCQqCupWBS4m3PLVpkGAfikN3I4",
        "11-V-5WIqa6P_vNk1ZZKu0-jNd2ZIaEuF",
        "10xdRAg83W70PEw1D_fSGXiR-mBGONW",
        "16h6cEFYYHqjNAuVsyVhJfoCg_1SBOO82",
        "16ffVjhqgImn8L6Kf-Oq8VNTnrjEf8var",
        "172nnsOQDAsZqev3bEnqW01o0KKdULIAU",
        "16ie1OZ0e7QVpR_YOHsWNRfFHpt0dkDNP"
      ];

      const randomID = videoIDs[Math.floor(Math.random() * videoIDs.length)];
      const url = `https://drive.google.com/uc?export=download&id=${randomID}`;
      const filePath = path.join(__dirname, 'uptime.mp4');

      const res = await axios.get(url, { responseType: 'stream' });
      const writer = fs.createWriteStream(filePath);
      res.data.pipe(writer);

      writer.on("finish", () => {
        message.reply({ body: response, attachment: fs.createReadStream(filePath) });
      });

      writer.on("error", err => {
        console.error("Failed to download video:", err);
        message.reply(response);
      });

    } catch (err) {
      console.error("Error in uptime2:", err);
      message.reply("❌ Failed to get system info.");
    }
  }
};

// Utils
function formatUptimeFull(seconds) {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${d}d ${h}h ${m}m ${s}s`;
}

function prettyBytes(bytes) {
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 B';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

async function getCpuUsagePercent() {
  const start = os.cpus();
  await new Promise(r => setTimeout(r, 1000));
  const end = os.cpus();
  let idle = 0, total = 0;

  for (let i = 0; i < start.length; i++) {
    const startCpu = start[i].times;
    const endCpu = end[i].times;
    const totalStart = Object.values(startCpu).reduce((a, b) => a + b, 0);
    const totalEnd = Object.values(endCpu).reduce((a, b) => a + b, 0);
    idle += endCpu.idle - startCpu.idle;
    total += totalEnd - totalStart;
  }

  return ((1 - idle / total) * 100).toFixed(1);
}

async function getDiskUsageSafe() {
  try {
    const { stdout } = await exec('df -h /');
    const lines = stdout.trim().split('\n');
    const diskLine = lines[1].split(/\s+/);
    return `${diskLine[2]} used / ${diskLine[1]} (${diskLine[4]})`;
  } catch (err) {
    return "Unavailable";
  }
}

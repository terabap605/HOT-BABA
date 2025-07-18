const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "intro",
    aliases: ["info", "aboutbot"],
    version: "2.0",
    author: "Rahad ✘ ChatGPT",
    role: 0,
    shortDescription: {
      en: "Rahad Bot's cinematic intro",
    },
    longDescription: {
      en: "Displays a powerful unique intro of the bot and owner",
    },
    category: "info",
    guide: {
      en: "{pn}",
    },
  },

  onStart: async function ({ api, event }) {
    const time = require("moment-timezone")
      .tz("Asia/Dhaka")
      .format("DD/MM/YYYY || HH:mm:ss");
    const prefix = global.config.PREFIX;
    const bot = global.config.BOTNAME || "RahadBot";
    const version = global.GoatBot.version;
    const uptime = process.uptime();
    const h = Math.floor(uptime / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const s = Math.floor(uptime % 60);

    const finalText = `
⫸ 𝗥𝗔𝗛𝗔𝗗 𝗕𝗢𝗧 𝗦𝗬𝗦𝗧𝗘𝗠 ⫷
🧠 "𝗧𝗛𝗜𝗦 𝗜𝗦𝗡'𝗧 𝗝𝗨𝗦𝗧 𝗔 𝗕𝗢𝗧. 𝗜𝗧'𝗦 𝗔𝗡 𝗥𝗔𝗛𝗔𝗗 𝗗𝗢𝗠𝗜𝗡𝗔𝗧𝗢𝗥."

╔═════◇👑 𝗢𝗪𝗡𝗘𝗥 𝗣𝗥𝗢𝗙𝗜𝗟𝗘 ◇═════╗
║ 🧠 𝗡𝗔𝗠𝗘        : 𝙍𝘼𝙃𝘼𝘿 - 𝙏𝙃𝙀 𝙆𝙄𝙉𝙂 👑
║ 🌐 𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞   : fb.com/61572930974640
║ 🆔 𝗨𝗜𝗗         : 61572930974640
║ ⚡ 𝗣𝗢𝗪𝗘𝗥𝗟𝗘𝗩𝗘𝗟  : 𝟵𝟵𝟵.𝟵% - 𝗔𝗟𝗟 𝗦𝗬𝗦 𝗢𝗣𝗘𝗡
║ 🔐 𝗥𝗢𝗢𝗧 𝗔𝗖𝗖𝗘𝗦𝗦 : ✅ 𝗘𝗡𝗔𝗕𝗟𝗘𝗗
║ ⏱ 𝗦𝗜𝗡𝗖𝗘       : ${time}
╚═══════════════════════╝

╔═════◇💥 𝗦𝗬𝗦𝗧𝗘𝗠 𝗦𝗧𝗔𝗧𝗨𝗦 ◇═════╗
║ 🤖 𝗕𝗢𝗧 𝗡𝗔𝗠𝗘    : ${bot}
║ 🧩 𝗩𝗘𝗥𝗦𝗜𝗢𝗡     : ${version}
║ ⌛ 𝗨𝗣𝗧𝗜𝗠𝗘      : ${h}h ${m}m ${s}s
║ 💣 𝗠𝗢𝗗𝗘        : 𝗖𝗢𝗠𝗕𝗔𝗧 - 𝗥𝗘𝗔𝗗𝗬
╚═══════════════════════╝

⚠️ *This bot is armed with intelligence.*
🔥 *Disrespect = AUTO ELIMINATION*
🎬 *Attached below is your reality trailer...*
`.trim();

    const url =
      "https://drive.google.com/uc?export=download&id=12DuB966likJ_pjKGtjAtPQMmK0eP2QW3";
    const filePath = path.join(__dirname, "rahad_intro.mp4");

    try {
      const { data } = await axios({
        url,
        method: "GET",
        responseType: "stream",
      });

      const writer = fs.createWriteStream(filePath);
      data.pipe(writer);

      writer.on("finish", () => {
        api.sendMessage(
          {
            body: finalText,
            attachment: fs.createReadStream(filePath),
          },
          event.threadID,
          () => fs.unlinkSync(filePath),
          event.messageID
        );
      });

      writer.on("error", (err) => {
        console.error("Video write error:", err);
        api.sendMessage(finalText, event.threadID, event.messageID);
      });
    } catch (error) {
      console.error("Video download error:", error);
      api.sendMessage(finalText, event.threadID, event.messageID);
    }
  },
};

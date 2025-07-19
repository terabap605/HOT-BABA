const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

const VIDEO_IDS = [
  "11sjtrTekpZjyzTX9N89ewAuZoVF5mlBu",
  "11mEAr6MneWy7IN-hBtK2M8SALAr3ZmrA",
  "1-1iSV2SyuP3TEH8IVkLIGN0_MQ8cVYjm",
  "1-ubkubbvyNcMi4a1HDa0Zl0FtjK_Hbvx",
  "109DxLi5McmXlww8PwIxjE6FsBVLLbScl",
  "108v-RR4HKmg3x8csHphcgh-ZNo3M_Zo2",
  "1-vD0mv3wGnAM0rmztYQuzxB2by2EgCMX"
];

module.exports = {
  config: {
    name: "help",
    version: "1.35",
    author: "BaYjid",
    countDown: 5,
    role: 0,
    shortDescription: { en: "📖 View all commands with video" },
    longDescription: { en: "Shows command list and tutorial video randomly" },
    category: "ℹ️ Info",
    guide: { en: "🔹 {pn}help [command name]" },
  },

  onStart: async function ({ message, args, event, role }) {
    const { threadID } = event;
    const prefix = getPrefix(threadID);

    const randomId = VIDEO_IDS[Math.floor(Math.random() * VIDEO_IDS.length)];
    const videoUrl = `https://drive.google.com/uc?export=download&id=${randomId}`;
    const videoPath = path.join(__dirname, "cache", `help_vid_${randomId}.mp4`);

    // ──> Show specific command details
    if (args[0]) {
      const name = args[0].toLowerCase();
      const cmd = commands.get(name) || commands.get(aliases.get(name));
      if (!cmd) return message.reply(`❌ No command named "${name}" found.`);

      const config = cmd.config;
      const usage = (config.guide?.en || "No guide.").replace(/{pn}/g, prefix);
      const roleText = getRoleText(config.role);

      try {
        const res = await axios.get(videoUrl, { responseType: "arraybuffer" });
        fs.ensureDirSync(path.dirname(videoPath));
        fs.writeFileSync(videoPath, Buffer.from(res.data, "binary"));

        return message.reply({
          body:
            `🌿 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗜𝗡𝗙𝗢\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `🧩 𝗡𝗮𝗺𝗲: ${config.name}\n` +
            `📃 𝗗𝗲𝘀𝗰: ${config.longDescription?.en || "No description"}\n` +
            `📎 𝗔𝗹𝗶𝗮𝘀𝗲𝘀: ${config.aliases?.join(", ") || "None"}\n` +
            `🔖 𝗩𝗲𝗿𝘀𝗶𝗼𝗻: ${config.version}\n` +
            `🛡️ 𝗥𝗼𝗹𝗲: ${roleText}\n` +
            `⏱️ 𝗖𝗼𝗼𝗹𝗱𝗼𝘄𝗻: ${config.countDown || 1}s\n` +
            `👨‍💻 𝗔𝘂𝘁𝗵𝗼𝗿: ${config.author || "Unknown"}\n` +
            `📘 𝗨𝘀𝗮𝗴𝗲: ${usage}\n` +
            `━━━━━━━━━━━━━━━━`,
          attachment: fs.createReadStream(videoPath)
        }, () => fs.unlinkSync(videoPath));
      } catch (e) {
        console.error("Video error:", e.message);
        return message.reply("⚠️ Couldn't load video.");
      }
    }

    // ──> Full command list
    const categories = {};
    let total = 0;
    for (const [name, cmd] of commands) {
      const config = cmd.config;
      if (config.role > 1 && role < config.role) continue;

      const cat = config.category || "Other";
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(name);
      total++;
    }

    let msg = `🌸 𝗥𝗔𝗛𝗔𝗗 𝘽𝙊𝙏 𝙈𝙀𝙉𝙐 🌸\n━━━━━━━━━━━━━━━━━━━`;

    for (const category of Object.keys(categories).sort()) {
      msg += `\n\n🕸️ 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆: 𝘾${category.toUpperCase()}`;
      for (const cmd of categories[category].sort()) {
        msg += `\n🔹 𝗖𝗺𝗱: ${cmd}`;
      }
    }

    msg += `\n\n🌐 𝗧𝗼𝘁𝗮𝗹: ${total} 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀`;
    msg += `\n💡 𝗧𝘆𝗽𝗲: ${prefix}help [cmd] for usage`;

    try {
      const res = await axios.get(videoUrl, { responseType: "arraybuffer" });
      fs.ensureDirSync(path.dirname(videoPath));
      fs.writeFileSync(videoPath, Buffer.from(res.data, "binary"));

      await message.reply({
        body: msg,
        attachment: fs.createReadStream(videoPath)
      }, () => fs.unlinkSync(videoPath));
    } catch (e) {
      console.error("Download error:", e.message);
      return message.reply(msg);
    }
  }
};

function getRoleText(role) {
  switch (role) {
    case 0: return "🌍 All Users";
    case 1: return "👑 Group Admins";
    case 2: return "🤖 Bot Admins";
    default: return "❓ Unknown";
  }
}

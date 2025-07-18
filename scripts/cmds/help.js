const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

const VIDEO_IDS = [
  "1-1iSV2SyuP3TEH8IVkLIGN0_MQ8cVYjm",
  "1-ubkubbvyNcMi4a1HDa0Zl0FtjK_Hbvx",
  "109DxLi5McmXlww8PwIxjE6FsBVLLbScl",
  "108v-RR4HKmg3x8csHphcgh-ZNo3M_Zo2",
  "1-vD0mv3wGnAM0rmztYQuzxB2by2EgCMX"
];

module.exports = {
  config: {
    name: "help",
    version: "1.5",
    role: 0,
    shortDescription: { en: "⚜️ Stylish bot command list with video" },
    longDescription: { en: "Shows unique styled help list with random tutorial video" },
    category: "info",
    guide: { en: "{pn} [command]" },
  },

  onStart: async function ({ args, message, event, role }) {
    const prefix = getPrefix(event.threadID);
    const randId = VIDEO_IDS[Math.floor(Math.random() * VIDEO_IDS.length)];
    const videoUrl = `https://drive.google.com/uc?export=download&id=${randId}`;
    const videoPath = path.join(__dirname, "cache", `help_video_${randId}.mp4`);

    async function sendStylish(body) {
      try {
        const res = await axios.get(videoUrl, { responseType: "arraybuffer" });
        fs.ensureDirSync(path.dirname(videoPath));
        fs.writeFileSync(videoPath, res.data);
        await message.reply({ body, attachment: fs.createReadStream(videoPath) },
          () => fs.unlinkSync(videoPath));
      } catch {
        await message.reply(body);
      }
    }

    if (args[0]) {
      const name = args[0].toLowerCase();
      const cmd = commands.get(name) || commands.get(aliases.get(name));
      if (!cmd) return message.reply(`❌ Command "${name}" not found.`);

      const cfg = cmd.config;
      const usage = (cfg.guide?.en || "").replace("{pn}", prefix);
      const detail = `
╔═══❖•ೋ° °ೋ•❖═══╗
🌟 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗜𝗡𝗙𝗢 🌟
╚═══❖•ೋ° °ೋ•❖═══╝

🔸 𝗡𝗮𝗺𝗲: ${cfg.name}
🔹 𝗩𝗲𝗿𝘀𝗶𝗼𝗻: ${cfg.version}
📁 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆: ${cfg.category?.toUpperCase() || "UNCATEGORIZED"}
📖 𝗗𝗲𝘀𝗰: ${cfg.shortDescription?.en || "N/A"}
🛠️ 𝗨𝘀𝗮𝗴𝗲: ${usage || prefix + cfg.name}

📽️ 𝗧𝘂𝘁𝗼𝗿𝗶𝗮𝗹 𝗩𝗶𝗱𝗲𝗼 𝗕𝗲𝗹𝗼𝘄...
━━━━━━━━━━━━━━━━━━━━━━━
`.trim();

      return sendStylish(detail);
    }

    const categorized = {};
    for (const cmd of commands.values()) {
      if (cmd.config.role > role) continue;
      const cat = (cmd.config.category || "Uncategorized").toUpperCase();
      (categorized[cat] = categorized[cat] || []).push(cmd.config.name);
    }

    let text = `
╔═════════════════════╗
🎀 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗕𝗢𝗧 𝗛𝗘𝗟𝗣 🎀
╚═════════════════════╝

`.trim();

    for (const cat of Object.keys(categorized).sort()) {
      text += `✨ 𝗖𝗔𝗧𝗘𝗚𝗢𝗥𝗬: ${cat} ✨\n`;
      text += categorized[cat].sort().map(cmd => `🔹 ${cmd}`).join("\n") + "\n\n";
    }

    text += `💡 𝗨𝘀𝗲: "${prefix}help [command]" for full details.\n🎬 𝗧𝘂𝘁𝗼𝗿𝗶𝗮𝗹 𝗩𝗶𝗱𝗲𝗼 𝗔𝘁𝘁𝗮𝗰𝗵𝗲𝗱...`;

    return sendStylish(text);
  }
};

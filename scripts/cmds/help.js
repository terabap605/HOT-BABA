const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "help",
    aliases: ["menu", "commands", "cmds"],
    version: "1.0",
    role: 0,
    shortDescription: { en: "Show all commands" },
    longDescription: { en: "Display categorized command list with style" },
    category: "System",
    guide: { en: "{pn} [command name]" }
  },

  onStart: async function ({ args, message }) {
    const allCommands = Array.from(global.GoatBot.commands.values());
    const byCategory = {};

    // Categorize commands
    for (const cmd of allCommands) {
      const category = cmd.config.category?.toUpperCase() || "OTHER";
      if (!byCategory[category]) byCategory[category] = [];
      byCategory[category].push(cmd.config.name);
    }

    const emojiMap = {
      "AI": "📌",
      "GROUP": "📢",
      "TOOLS": "🛠️",
      "TOOL": "🛠️",
      "VIDEO": "🎬",
      "ANIME": "🌸",
      "OTHER": "🌐",
      "SYSTEM": "⚙️",
      "FUN": "🎲",
      "ADMIN": "🧰"
    };

    const cmdIcons = {
      "uptime": "🕒",
      "weather": "🌤️",
      "time": "🕰️",
      "youtube": "🔴",
      "tiktokdl": "🎵",
      "waifu": "💗",
      "animequote": "🧸",
      "brain": "🧠",
      "quote": "💌",
      "stalk": "😎",
      "autotimer": "📅",
      "voiceme": "🎙️",
      "info": "👤",
      "vip": "🌈",
      "tagadmin": "👑",
      "uchiha": "💥",
      "gpt": "🌀",
      "tm": "🪐",
      "aiimage": "🖼️"
    };

    // If specific command asked
    if (args[0]) {
      const cmd = allCommands.find(c =>
        c.config.name === args[0] ||
        (c.config.aliases && c.config.aliases.includes(args[0]))
      );
      if (!cmd) return message.reply("❌ Command not found.");
      const c = cmd.config;
      return message.reply(
        `🎯 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗗𝗘𝗧𝗔𝗜𝗟𝗦\n━━━━━━━━━━\n📍 Name: ${c.name}\n🔁 Aliases: ${c.aliases?.join(", ") || "None"}\n🧾 Description: ${c.shortDescription?.en || "N/A"}\n📘 Usage: ${c.guide?.en || "N/A"}\n📌 Category: ${c.category || "Uncategorized"}\n🔑 Role: ${c.role}\n📎 Version: ${c.version}\n━━━━━━━━━━`
      );
    }

    // 🧾 Help Menu Generation
    let text = `✦ 𓆩 𝗥𝗔𝗛𝗔𝗗 𝗕𝗢𝗧 𝗦𝗬𝗦𝗧𝗘𝗠 𓆪 ✦\n\n`;

    for (const [category, cmds] of Object.entries(byCategory)) {
      const icon = emojiMap[category.toUpperCase()] || "📁";
      text += `${icon} ${category.toUpperCase()} ${icon}\n`;

      const sorted = cmds.sort((a, b) => a.localeCompare(b));
      for (const name of sorted) {
        const symbol = cmdIcons[name] || "➤";
        text += `├➤ ${symbol} ${name}\n`;
      }
      text += `\n`;
    }

    text += `📚 Use: -help [command name]\n📎 Tutorial auto-attached below\n\n✦ 𓆩 𝗥𝗔𝗛𝗔𝗗 𝗕𝗢𝗧 𝗦𝗬𝗦𝗧𝗘𝗠 𓆪 ✦`;

    // 🎬 Random tutorial video attach
    const videos = [
      "https://drive.google.com/uc?export=download&id=11mEAr6MneWy7IN-hBtK2M8SALAr3ZmrA",
      "https://drive.google.com/uc?export=download&id=1211JSbJp8ZCPHotZVd2RYz_ZaAUNJKAA",
      "https://drive.google.com/uc?export=download&id=120tokEDkjIcBGa_jhvFhduFD7oT-dWBg",
      "https://drive.google.com/uc?export=download&id=12-_VJ6ol664m2q3TuXA3TXkPIyGr08dv",
      "https://drive.google.com/uc?export=download&id=13OZg_BRv8THc9PMLZ92z4DJ7W_63mFzg",
      "https://drive.google.com/uc?export=download&id=1VoFx60BzUmPY3J0PltTjlnijD8-MdvGL",
      "https://drive.google.com/uc?export=download&id=1ZjDPV4OJw3HwZYZApLPWXRjvw9JZMKC6",
      "https://drive.google.com/uc?export=download&id=1bfvvTTC9t_2vIUsIBj7dcE1np7_RwYLC",
      "https://drive.google.com/uc?export=download&id=11sjtrTekpZjyzTX9N89ewAuZoVF5mlBu",
      "https://drive.google.com/uc?export=download&id=11oZPK4XcpslKmgeyv3MjGJMbZ4GAF1H_"
    ];

    const video = videos[Math.floor(Math.random() * videos.length)];

    return message.reply({
      body: text,
      attachment: await global.utils.getStreamFromURL(video)
    });
  }
};

module.exports = {
  config: {
    name: "help",
    aliases: ["menu", "cmd", "commands"],
    version: "1.1",
    role: 0,
    shortDescription: { en: "Show Rahad Bot's command list" },
    longDescription: { en: "Stylish and categorized help menu for Rahad Bot" },
    category: "System",
    guide: { en: "{pn} [command name]" }
  },

  onStart: async function ({ args, message }) {
    const allCommands = Array.from(global.GoatBot.commands.values());
    const byCategory = {};

    for (const cmd of allCommands) {
      const cat = cmd.config.category?.toUpperCase() || "UNCATEGORIZED";
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push(cmd.config.name);
    }

    const categoryStyle = {
      "AI": "📌 ✦ 𝗔𝗜 & 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗘 ✨",
      "GROUP": "📢 ✦ 𝗚𝗥𝗢𝗨𝗣 & 𝗧𝗔𝗚 📣",
      "TOOLS": "🛠️ ✦ 𝗧𝗢𝗢𝗟𝗦 & 𝗨𝗧𝗜𝗟𝗦 🔧",
      "TOOL": "🛠️ ✦ 𝗧𝗢𝗢𝗟𝗦 & 𝗨𝗧𝗜𝗟𝗦 🔧",
      "VIDEO": "🎬 ✦ 𝗩𝗜𝗗𝗘𝗢 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥𝗦 🎥",
      "ANIME": "🌸 ✦ 𝗔𝗡𝗜𝗠𝗘 𝗦𝗘𝗖𝗧𝗜𝗢𝗡 🌸",
      "OTHER": "🌐 ✦ 𝗢𝗧𝗛𝗘𝗥 𝗙𝗘𝗔𝗧𝗨𝗥𝗘𝗦 🧩",
      "SYSTEM": "⚙️ ✦ 𝗦𝗬𝗦𝗧𝗘𝗠 ⚙️",
      "UNCATEGORIZED": "📂 ✦ 𝗢𝗧𝗛𝗘𝗥𝗦 📂"
    };

    const cmdIcons = {
      "uptime": "🕒", "weather": "🌤️", "time": "🕰️",
      "youtube": "🔴", "tiktokdl": "🎵",
      "waifu": "💗", "animequote": "🧸",
      "brain": "🧠", "quote": "💌", "stalk": "😎",
      "autotimer": "📅", "voiceme": "🎙️", "info": "👤", "vip": "🌈",
      "tagadmin": "👑", "uchiha": "💥",
      "gpt": "🌀", "tm": "🪐", "aiimage": "🖼️"
    };

    // if specific command
    if (args[0]) {
      const cmd = allCommands.find(c => c.config.name === args[0] || c.config.aliases?.includes(args[0]));
      if (!cmd) return message.reply("❌ Command not found.");
      const c = cmd.config;
      return message.reply(
        `🎯 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗗𝗘𝗧𝗔𝗜𝗟𝗦\n━━━━━━━━━━━━━━\n📌 Name: ${c.name}\n🔁 Aliases: ${c.aliases?.join(", ") || "None"}\n📘 Description: ${c.shortDescription?.en || "N/A"}\n🧾 Usage: ${c.guide?.en || "N/A"}\n🏷️ Category: ${c.category || "Uncategorized"}\n🔑 Role: ${c.role}\n📎 Version: ${c.version}\n━━━━━━━━━━━━━━`
      );
    }

    // full help menu
    let text = `✦ 𓆩 𝗥𝗔𝗛𝗔𝗗 𝗕𝗢𝗧 𝗠𝗔𝗦𝗧𝗘𝗥 𝗠𝗘𝗡𝗨 𓆪 ✦\n\n`;

    for (const [cat, cmds] of Object.entries(byCategory)) {
      const styledCat = categoryStyle[cat] || `📁 ✦ ${cat} 📁`;
      text += `${styledCat}\n`;
      const sorted = cmds.sort((a, b) => a.localeCompare(b));
      for (const name of sorted) {
        const icon = cmdIcons[name] || "➤";
        text += `├➤ ${icon} ${name}\n`;
      }
      text += `\n`;
    }

    text += `📚 Type: -help [command name] to see usage\n📎 Auto tutorial video below ⬇️`;

    const tutorialVideos = [
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

    const randVid = tutorialVideos[Math.floor(Math.random() * tutorialVideos.length)];

    return message.reply({
      body: text,
      attachment: await global.utils.getStreamFromURL(randVid)
    });
  }
};

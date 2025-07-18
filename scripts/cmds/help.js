const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "help",
    aliases: ["menu", "commands", "cmds"],
    version: "1.0",
    role: 0,
    shortDescription: { en: "Show command list" },
    longDescription: { en: "Display bot command categories and how to use them" },
    category: "System",
    guide: { en: "{pn} [command name]" }
  },

  onStart: async function ({ args, message, event, commandName }) {
    const commands = global.GoatBot.commands;
    const allCommands = Array.from(commands.values());

    // 🎥 Random tutorial videos
    const tutorialVideos = [
      "https://drive.google.com/uc?export=download&id=11mEAr6MneWy7IN-hBtK2M8SALAr3ZmrA",
      "https://drive.google.com/uc?export=download&id=1211JSbJp8ZCPHotZVd2RYz_ZaAUNJKAA",
      "https://drive.google.com/uc?export=download&id=120tokEDkjIcBGa_jhvFhduFD7oT-dWBg",
      "https://drive.google.com/uc?export=download&id=12-_VJ6ol664m2q3TuXA3TXkPIyGr08dv",
      "https://drive.google.com/uc?export=download&id=11z0xo_DnszJErPZNNjrNt8VOjY1FPw3E",
      "https://drive.google.com/uc?export=download&id=11xGxSGsywOGA13ZAD1TJ-eYSANgsl7w-",
      "https://drive.google.com/uc?export=download&id=11sjtrTekpZjyzTX9N89ewAuZoVF5mlBu",
      "https://drive.google.com/uc?export=download&id=11oZPK4XcpslKmgeyv3MjGJMbZ4GAF1H_"
    ];
    const randomVideo = tutorialVideos[Math.floor(Math.random() * tutorialVideos.length)];

    // 📌 Show help for a specific command
    if (args[0]) {
      const cmd = allCommands.find(c =>
        c.config.name === args[0] || (c.config.aliases && c.config.aliases.includes(args[0]))
      );
      if (!cmd) return message.reply("❌ Command not found.");

      const { name, aliases, guide, description, version, role } = cmd.config;
      return message.reply({
        body: `🎯 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗗𝗘𝗧𝗔𝗜𝗟𝗦 🎯\n━━━━━━━━━━━━━━━━\n📍 Name: ${name}\n🔁 Aliases: ${aliases?.join(", ") || "None"}\n📘 Usage: ${guide?.en || "N/A"}\n🧾 Description: ${description?.en || "N/A"}\n🔑 Role: ${role}\n📌 Version: ${version || "1.0"}\n━━━━━━━━━━━━━━━━`,
        attachment: await global.utils.getStreamFromURL(randomVideo)
      });
    }

    // 📋 All commands help menu
    const helpText = `
💠═══════════════💠
🎯 𝗥𝗔𝗛𝗔𝗗 𝗕𝗢𝗧 𝗦𝗬𝗦𝗧𝗘𝗠 🎯
💠═══════════════💠

📌 𝗔𝗜 & 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗘 ✨
┣⪼ 🔮 tm
┣⪼ 🌀 gpt
┣⪼ 🖼️ aiimage

👥 𝗚𝗥𝗢𝗨𝗣 & 𝗧𝗔𝗚 📢
┣⪼ 👑 tagadmin
┣⪼ 🧨 uchiha

⚙️ 𝗧𝗢𝗢𝗟𝗦 & 𝗨𝗧𝗜𝗟𝗦 🛠️
┣⪼ ⏱️ uptime
┣⪼ 🌤️ weather
┣⪼ 🕒 time

🎞️ 𝗩𝗜𝗗𝗘𝗢 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 🎬
┣⪼ 🔴 youtube
┣⪼ 🎵 tiktokdl

🌸 𝗔𝗡𝗜𝗠𝗘 𝗦𝗘𝗖𝗧𝗜𝗢𝗡 💮
┣⪼ 💗 waifu
┣⪼ 🧸 animequote

💠 Use: -help [command]
📽️ Tutorial auto-attached below
`;

    return message.reply({
      body: helpText.trim(),
      attachment: await global.utils.getStreamFromURL(randomVideo)
    });
  }
};

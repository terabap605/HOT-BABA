module.exports = {
  config: {
    name: "help",
    aliases: ["menu", "commands", "cmds"],
    version: "1.0",
    role: 0,
    shortDescription: { en: "Show command list" },
    longDescription: { en: "Display all commands with categories" },
    category: "System",
    guide: { en: "{pn} [command name]" }
  },

  onStart: async function ({ args, message }) {
    const allCommands = Array.from(global.GoatBot.commands.values());
    const byCat = {};

    allCommands.forEach(cmd => {
      const cat = cmd.config.category || "Misc";
      if (!byCat[cat]) byCat[cat] = [];
      byCat[cat].push(cmd.config.name);
    });

    const vids = [
      "https://drive.google.com/uc?export=download&id=11mEAr6MneWy7IN-hBtK2M8SALAr3ZmrA",
      "https://drive.google.com/uc?export=download&id=1211JSbJp8ZCPHotZVd2RYz_ZaAUNJKAA",
      "https://drive.google.com/uc?export=download&id=120tokEDkjIcBGa_jhvFhduFD7oT-dWBg",
      "https://drive.google.com/uc?export=download&id=12-_VJ6ol664m2q3TuXA3TXkPIyGr08dv",
      "https://drive.google.com/uc?export=download&id=11z0xo_DnszJErPZNNjrNt8VOjY1FPw3E",
      "https://drive.google.com/uc?export=download&id=11xGxSGsywOGA13ZAD1TJ-eYSANgsl7w-",
      "https://drive.google.com/uc?export=download&id=11sjtrTekpZjyzTX9N89ewAuZoVF5mlBu",
      "https://drive.google.com/uc?export=download&id=11oZPK4XcpslKmgeyv3MjGJMbZ4GAF1H_"
    ];
    const vid = vids[Math.floor(Math.random() * vids.length)];

    if (args[0]) {
      const cmd = allCommands.find(c =>
        c.config.name === args[0] ||
        (c.config.aliases && c.config.aliases.includes(args[0]))
      );
      if (!cmd) return message.reply("❌ Command not found.");
      const c = cmd.config;
      return message.reply({
        body: `🎯 *COMMAND DETAILS*\n━━━━━━━━━━\n📍 Name: ${c.name}\n🔁 Aliases: ${c.aliases?.join(", ") || "None"}\n📘 Usage: ${c.guide?.en || "N/A"}\n🧾 Desc: ${c.longDescription?.en || "N/A"}\n🔑 Role: ${c.role}\n📌 Version: ${c.version}\n━━━━━━━━━━`,
        attachment: await global.utils.getStreamFromURL(vid)
      });
    }

    let text = `✦ 𓆩 𝗥𝗔𝗛𝗔𝗗 𝗕𝗢𝗧 𝗦𝗬𝗦𝗧𝗘𝗠 𓆪 ✦\n\n`;
    for (let [cat, list] of Object.entries(byCat)) {
      let icon = "🔹";
      if (/AI/i.test(cat)) icon = "📌";
      else if (/GROUP/i.test(cat)) icon = "👥";
      else if (/TOOL/i.test(cat)) icon = "🛠️";
      else if (/VIDEO/i.test(cat)) icon = "🎞️";
      else if (/ANIME/i.test(cat)) icon = "🌸";

      text += `${icon} *${cat.toUpperCase()}*\n`;
      list.sort().forEach(name => {
        text += `├➤ ${name}\n`;
      });
      text += `\n`;
    }

    text += `🛠️ Use: -help [command]\n📽 Tutorial auto-attached below\n\n✦ 𓆩 𝗥𝗔𝗛𝗔𝗗 𝗕𝗢𝗧 𝗦𝗬𝗦𝗧𝗘𝗠 𓆪 ✦`;

    return message.reply({
      body: text,
      attachment: await global.utils.getStreamFromURL(vid)
    });
  }
};

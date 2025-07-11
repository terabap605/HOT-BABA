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
  config: Object.freeze({
    name: "help",
    version: "1.21",
    author: "BaYjid",
    countDown: 5,
    role: 0,
    shortDescription: { en: "📖 View command usage and tutorial videos" },
    longDescription: { en: "📜 View command usage, list all commands + tutorial videos links" },
    category: "ℹ️ Info",
    guide: { en: "🔹 {pn} / help cmdName" },
    priority: 1,
  }),

  onStart: async function ({ message, args, event, role }) {
    const { threadID } = event;
    const prefix = getPrefix(threadID);
    let filterAuthor = null;
    let filterCategory = null;

    // If specific command requested help for
    if (args[0] === "-a" && args[1]) {
      filterAuthor = args.slice(1).join(" ").toLowerCase();
    } else if (args[0] === "-c" && args[1]) {
      filterCategory = args.slice(1).join(" ").toLowerCase();
    } else if (args.length > 0 && !args[0].startsWith("-")) {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));
      if (!command) return message.reply(`❌ 𝘾𝙤𝙢𝙢𝙖𝙣𝙙 "${commandName}" 𝙣𝙤𝙩 𝙛𝙤𝙪𝙣𝙙.`);

      const config = command.config;
      const roleText = roleTextToString(config.role);
      const usage = (config.guide?.en || "No guide available.")
        .replace(/{pn}/g, prefix)
        .replace(/{n}/g, config.name);

      return message.reply(
`╔═━「 🦋 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 𝙳𝙴𝚃𝙰𝙸𝙻𝚂 」━═╗
🧸 𝙽𝚊𝚖𝚎: ${config.name}
📜 𝙳𝚎𝚜𝚌: ${config.longDescription?.en || "No description"}
🔁 𝙰𝚕𝚒𝚊𝚜𝚎𝚜: ${config.aliases?.join(", ") || "None"}
📦 𝚅𝚎𝚛𝚜𝚒𝚘𝚗: ${config.version || "1.0"}
🛡️ 𝚁𝚘𝚕𝚎: ${roleText}
⏳ 𝙲𝚘𝚘𝚕𝚍𝚘𝚠𝚗: ${config.countDown || 1}s
👑 𝙰𝚞𝚝𝚑𝚘𝚛: ${config.author || "Unknown"}
📘 𝚄𝚜𝚊𝚐𝚎: ${usage}
╚════════════════════╝`
      );
    }

    // Collect commands by category with filters
    const categories = {};
    let total = 0;

    for (const [name, command] of commands) {
      const config = command.config;
      if (config.role > 1 && role < config.role) continue;
      if (filterAuthor && config.author?.toLowerCase() !== filterAuthor) continue;
      if (filterCategory && config.category?.toLowerCase() !== filterCategory) continue;

      const category = config.category || "Uncategorized";
      if (!categories[category]) categories[category] = [];
      categories[category].push(name);
      total++;
    }

    if (total === 0) {
      const filterMsg = filterAuthor ? `author "${filterAuthor}"` : `category "${filterCategory}"`;
      return message.reply(`🚫 𝙉𝙤 𝙘𝙤𝙢𝙢𝙖𝙣𝙙𝙨 𝙛𝙤𝙪𝙣𝙙 𝙛𝙤𝙧 ${filterMsg}.`);
    }

    // Prepare help message
    let msg = `🌸 𝙈𝘼𝙇𝙑𝙄𝙉𝘼 𝘽𝙊𝙏 𝙈𝙀𝙉𝙐 🌸\n`;

    Object.keys(categories).sort().forEach(category => {
      msg += `\n🕷️ 𝘾𝙖𝙩𝙚𝙜𝙤𝙧𝙮: ${category.toUpperCase()}\n`;
      categories[category].sort().forEach(cmd => {
        msg += `⤷ 🎟️ 𝘾𝙢𝙙: ${cmd}\n`;
      });
    });

    msg += `\n🌐 𝚃𝚘𝚝𝚊𝚕 𝙲𝚘𝚖𝚖𝚊𝚗𝚍𝚜: ${total}`;
    msg += `\n🔍 𝚃𝚒𝚙: ${prefix}help <command> 𝚏𝚘𝚛 𝚍𝚎𝚝𝚊𝚒𝚕𝚜`;

    // Add tutorial video links at the end
    msg += `\n\n🎥 𝙏𝙪𝙩𝙤𝙧𝙞𝙖𝙡 𝙑𝙞𝙙𝙚𝙤𝙨:\n`;
    VIDEO_IDS.forEach((id, i) => {
      msg += `🔹 Video ${i + 1}: https://drive.google.com/uc?export=download&id=${id}\n`;
    });

    await message.reply(msg);
  },
};

function roleTextToString(role) {
  switch (role) {
    case 0: return "🌍 𝘼𝙡𝙡 𝙐𝙨𝙚𝙧𝙨";
    case 1: return "👑 𝙂𝙧𝙤𝙪𝙥 𝘼𝙙𝙢𝙞𝙣𝙨";
    case 2: return "🤖 𝘽𝙤𝙩 𝘼𝙙𝙢𝙞𝙣𝙨";
    default: return "❓ 𝙐𝙣𝙠𝙣𝙤𝙬𝙣";
  }
}

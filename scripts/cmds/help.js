const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "4.3",
    author: "Mostakim + ChatGPT",
    usePrefix: false,
    role: 0,
    category: "info",
    priority: 1
  },

  onStart: async function({ message, args, event, role }) {
    const prefix = getPrefix(event.threadID) || ".";
    const arg = args[0]?.toLowerCase();

    const header = "╔═━「 🛠️ 𝗛𝗘𝗟𝗣 𝗠𝗘𝗡𝗨 」━═╗";
    const footer = "╚═━──────────────━═╝";

    const videoIds = [
      "1211JSbJp8ZCPHotZVd2RYz_ZaAUNJKAA",
      "11oZPK4XcpslKmgeyv3MjGJMbZ4GAF1H_",
      "120tokEDkjIcBGa_jhvFhduFD7oT-dWBg",
      "11xGxSGsywOGA13ZAD1TJ-eYSANgsl7w-",
      "11z0xo_DnszJErPZNNjrNt8VOjY1FPw3E",
      "11sjtrTekpZjyzTX9N89ewAuZoVF5mlBu",
      "12-_VJ6ol664m2q3TuXA3TXkPIyGr08dv",
      "11mEAr6MneWy7IN-hBtK2M8SALAr3ZmrA"
    ];
    const randomVideoId = videoIds[Math.floor(Math.random() * videoIds.length)];
    const videoUrl = `https://drive.google.com/uc?export=download&id=${randomVideoId}`;
    const tmpVideo = path.join(__dirname, "cache", "help_video.mp4");

    if (!arg) {
      const list = Array.from(commands.entries())
        .filter(([_, cmd]) => cmd.config?.role <= role)
        .map(([name]) => `┃ ✦ 〘 ${name} 〙`)
        .sort()
        .join("\n");

      var replyText =
        `${header}\n` +
        `┃ ✧ 𝗣𝗿𝗲𝗳𝗶𝘅 ➜ ${prefix}\n` +
        `┃ ✧ 𝗧𝗼𝘁𝗮𝗹 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀 ➜ ${commands.size}\n` +
        `┃ ✧ 𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀:\n` +
        `${list}\n` +
        `${footer}\n\n` +
        `🌟 𝗨𝘀𝗲: \`${prefix}help -<category>\` to filter by category\n` +
        `📘 𝗨𝘀𝗲: \`${prefix}help <command>\` to view command details`;
    } else if (arg.startsWith("-")) {
      const category = arg.slice(1);
      const matched = Array.from(commands.entries())
        .filter(([_, cmd]) => cmd.config.category?.toLowerCase() === category && cmd.config.role <= role)
        .map(([name]) => `┃ ✦ 〘 ${name} 〙`);
      if (matched.length === 0) return message.reply(`🚫 No commands found in category "${category}".`);

      var replyText =
        `╔═━「 📂 CATEGORY: ${category.toUpperCase()} 」━═╗\n` +
        `${matched.join("\n")}\n` +
        `${footer}\n\n` +
        `📘 Use \`${prefix}help <command>\` for more details`;
    } else {
      const cmd = commands.get(arg) || commands.get(aliases.get(arg));
      if (!cmd || cmd.config.role > role) return message.reply(`🚫 Command "${arg}" not found or access denied.`);

      const info = cmd.config;
      const guide = info.guide?.en || "No usage info.";
      const desc = info.longDescription?.en || "No description available.";

      var replyText =
        `╔═━「 🔎 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗗𝗘𝗧𝗔𝗜𝗟𝗦 」━═╗\n` +
        `┃ 🧩 𝗡𝗮𝗺𝗲: ${info.name}\n` +
        `┃ 🗒️ 𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: ${desc}\n` +
        `┃ 📌 𝗨𝘀𝗮𝗴𝗲: ${guide.replace(/{p}/g, prefix).replace(/{n}/g, info.name)}\n` +
        `┃ 🛡️ 𝗥𝗼𝗹𝗲 𝗥𝗲𝗾𝘂𝗶𝗿𝗲𝗱: ${info.role}\n` +
        `┃ 📁 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆: ${info.category || "Uncategorized"}\n` +
        `${footer}`;
    }

    try {
      const res = await axios.get(videoUrl, { responseType: "stream" });
      await fs.ensureDir(path.dirname(tmpVideo));
      const writer = fs.createWriteStream(tmpVideo);
      res.data.pipe(writer);
      await new Promise((res2, rej) => {
        writer.on("finish", res2);
        writer.on("error", rej);
      });

      await message.reply(
        { body: replyText, attachment: fs.createReadStream(tmpVideo) },
        () => fs.unlinkSync(tmpVideo)
      );
    } catch (e) {
      console.error("Video error:", e);
      return message.reply(replyText);
    }
  }
};

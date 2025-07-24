const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const { utils } = global;

const VIDEO_IDS = [
  "1-WKsuSsLsO8BKc2Oil0KAxvgcwcsFTA3",
  "1-8VSzbLm7c2eBesp8YwwvJxdhs0dcFSL",
  "102gwONoMStLZxNUuRH7SQ0j8mmwoGMg6",
  "10QycYgsTagrN90cWJCIWWVwmps2kk_oF",
  "10yCXj_k-vQ3JZ4CDBI47q1QAGStgqGGf",
  "10fnG0B9mjJm7kiOfhCmxaWJAnO6byg7h",
  "10bLixrdA5AMDX_ghc0gh2KrNqFnlXCWt",
  "10hN25pp9xP3ta7-nRxqRDeqRDYSQsi8t",
  "10tylA-0PZt29bEwbMQliFJRLyNgpUSPy",
  "10igHuFfPMYdAXE5jHJg7E1Bg_EmNbsxp",
  "11Xke5bDTf1wVmVTyztfQoi59wqJ-cHyJ",
  "11zdP9h5IEQsHIbyMXU180TDrVwPWev2Y",
  "11z3srLyFgG0QhNeC9VoVfhxNrfanRYTq",
  "11fe0PJXCJ3qbmJ_SgPEHK03_NPk48ATa"
];

module.exports = {
  config: {
    name: "prefix",
    version: "2.0",
    author: "BaYjid + Rahad",
    countDown: 5,
    role: 0,
    description: "🛠️ Change bot prefix or show it with a video",
    category: "⚙️ Configuration",
    guide: {
      en:
`╔════════════════════════════════════╗
 ║       ⚙️ 𝗣𝗥𝗘𝗙𝗜𝗫 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗚𝗨𝗜𝗗𝗘 ⚙️       ║
 ╠════════════════════════════════════╣
 ║ 📌 𝗖𝗵𝗮𝗻𝗴𝗲 𝗴𝗿𝗼𝘂𝗽 𝗽𝗿𝗲𝗳𝗶𝘅:                    ║
 ║    💬 {pn} <new prefix>                  ║
 ║ 📌 𝗖𝗵𝗮𝗻𝗴𝗲 𝗴𝗹𝗼𝗯𝗮𝗹 𝗽𝗿𝗲𝗳𝗶𝘅 (admin only):       ║
 ║    💬 {pn} <new prefix> -g               ║
 ║ 📌 𝗥𝗲𝘀𝗲𝘁 𝘁𝗼 𝗱𝗲𝗳𝗮𝘂𝗹𝘁:                       ║
 ║    💬 {pn} reset                         ║
 ║ 📌 𝗦𝗵𝗼𝘄 𝗰𝘂𝗿𝗿𝗲𝗻𝘁 𝗽𝗿𝗲𝗳𝗶𝘅 + 𝘃𝗶𝗱𝗲𝗼:             ║
 ║    💬 prefix                             ║
 ╚════════════════════════════════════╝`
    }
  },

  langs: {
    en: {
      reset:
`╭━━━༺ 𝓟𝓻𝓮𝓯𝓲𝔁 𝓡𝓮𝓼𝓮𝓽 ༻━━━╮
┃
┃  ✅ 𝗥𝗲𝘀𝗲𝘁 𝗰𝗼𝗺𝗽𝗹𝗲𝘁𝗲𝗱! 𝗡𝗲𝘄 𝗣𝗿𝗲𝗳𝗶𝘅:  ✨  %1  ✨
┃
╰━━━━━━━━━━━━━━━━━━━━━╯`,

      onlyAdmin:
`╭━━━༺ 𝓐𝓬𝓬𝓮𝓼𝓼 𝓓𝓮𝓷𝓲𝓮𝓭 ༻━━━╮
┃
┃  ⛔ 𝗢𝗻𝗹𝘆 𝗔𝗱𝗺𝗶𝗻𝘀 𝗰𝗮𝗻 𝗰𝗵𝗮𝗻𝗴𝗲 𝗴𝗹𝗼𝗯𝗮𝗹 𝗽𝗿𝗲𝗳𝗶𝘅!
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`,

      confirmGlobal:
`╭━━━༺ 𝓒𝓸𝓷𝓯𝓲𝓻𝓶 𝓖𝓵𝓸𝓫𝓪𝓵 ༻━━━╮
┃
┃  🔄 𝗥𝗲𝗮𝗰𝘁 𝘁𝗼 𝗰𝗼𝗻𝗳𝗶𝗿𝗺 𝗚𝗟𝗢𝗕𝗔𝗟 𝗽𝗿𝗲𝗳𝗶𝘅 𝗰𝗵𝗮𝗻𝗴𝗲.
┃
╰━━━━━━━━━━━━━━━━━━━━━━━╯`,

      confirmThisThread:
`╭━━━༺ 𝓒𝓸𝓷𝓯𝓲𝓻𝓶 𝗚𝗿𝗼𝘂𝗽 ༻━━━╮
┃
┃  🔄 𝗥𝗲𝗮𝗰𝘁 𝘁𝗼 𝗰𝗼𝗻𝗳𝗶𝗿𝗺 𝗚𝗥𝗢𝗨𝗣 𝗽𝗿𝗲𝗳𝗶𝘅 𝗰𝗵𝗮𝗻𝗴𝗲.
┃
╰━━━━━━━━━━━━━━━━━━━━━━━╯`,

      successGlobal:
`╭━━━༺ 𝓢𝓾𝓬𝓬𝓮𝓼𝓼 𝓖𝓵𝓸𝓫𝓪𝓵 ༻━━━╮
┃
┃  🎉 𝗚𝗹𝗼𝗯𝗮𝗹 𝗽𝗿𝗲𝗳𝗶𝘅 𝘀𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 𝗰𝗵𝗮𝗻𝗴𝗲𝗱 𝘁𝗼:
┃  💠  %1
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`,

      successThisThread:
`╭━━━༺ 𝓢𝓾𝓬𝓬𝓮𝓼𝓼 𝗚𝗿𝗼𝘂𝗽 ༻━━━╮
┃
┃  🎉 𝗚𝗿𝗼𝘂𝗽 𝗽𝗿𝗲𝗳𝗶𝘅 𝘀𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 𝗰𝗵𝗮𝗻𝗴𝗲𝗱 𝘁𝗼:
┃  💠  %1
┃
╰━━━━━━━━━━━━━━━━━━━━━━━╯`,

      myPrefix: `
╔══════════════════════════════╗
 ║          ✨ 𝓟𝓻𝓮𝓯𝓲𝔁 𝓢𝓽𝓪𝓽𝓾𝓼 ✨          ║
 ╠══════════════════════════════╣
 ║ 🌍 𝗚𝗹𝗼𝗯𝗮𝗹:  »  %1
 ║ 💬 𝗚𝗿𝗼𝘂𝗽:   »  %2
 ║ ⏰ 𝗦𝗲𝗿𝘃𝗲𝗿 𝘁𝗶𝗺𝗲: »  %3
 ╠═══════════════════════════════╣
 ║ 💡 𝗧𝘆𝗽𝗲 𝘁𝗵𝗶𝘀:  %2help 𝗳𝗼𝗿 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀!
 ╚═══════════════════════════════╝`
    }
  },

  onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
    if (!args[0]) return message.SyntaxError();

    if (args[0] === "reset") {
      await threadsData.set(event.threadID, null, "data.prefix");
      return message.reply(getLang("reset", global.GoatBot.config.prefix));
    }

    const newPrefix = args[0];
    const setGlobal = args[1] === "-g";

    if (setGlobal && role < 2) {
      return message.reply(getLang("onlyAdmin"));
    }

    const confirmMessage = setGlobal ? getLang("confirmGlobal") : getLang("confirmThisThread");

    return message.reply(confirmMessage, (err, info) => {
      if (info?.messageID) {
        global.GoatBot.onReaction.set(info.messageID, {
          author: event.senderID,
          newPrefix,
          setGlobal,
          messageID: info.messageID
        });
      }
    });
  },

  onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
    if (event.userID !== Reaction.author) return;

    if (Reaction.setGlobal) {
      global.GoatBot.config.prefix = Reaction.newPrefix;
      fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
      return message.reply(getLang("successGlobal", Reaction.newPrefix));
    }

    await threadsData.set(event.threadID, Reaction.newPrefix, "data.prefix");
    return message.reply(getLang("successThisThread", Reaction.newPrefix));
  },

  onChat: async function ({ event, message, getLang, threadsData }) {
    if (event.body?.toLowerCase()?.trim() !== "prefix") return;

    const prefix = utils.getPrefix(event.threadID);
    const time = new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" });

    const info = getLang("myPrefix", global.GoatBot.config.prefix, prefix, time);

    const randomID = VIDEO_IDS[Math.floor(Math.random() * VIDEO_IDS.length)];
    const videoURL = `https://drive.google.com/uc?export=download&id=${randomID}`;
    const videoPath = path.join(__dirname, `temp_${Date.now()}.mp4`);

    try {
      const res = await axios({ method: "GET", url: videoURL, responseType: "stream" });
      const writer = fs.createWriteStream(videoPath);
      res.data.pipe(writer);

      writer.on("finish", () => {
        message.reply({ body: info, attachment: fs.createReadStream(videoPath) }, () => {
          fs.unlink(videoPath, () => {}); // cleanup
        });
      });

      writer.on("error", () => {
        message.reply(info + "\n⚠️ Video couldn't load.");
      });
    } catch (err) {
      message.reply(info + "\n⚠️ Failed to fetch video.");
    }
  }
};

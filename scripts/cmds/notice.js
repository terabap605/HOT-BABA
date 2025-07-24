const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "notice",
    aliases: ["notif"],
    version: "2.1",
    author: "RaHaD",
    countDown: 5,
    role: 2,
    shortDescription: "Send notice + random Google Drive video to all groups",
    longDescription: "Send notice message with a different random video (no repeat per group) to all groups.",
    category: "owner",
    guide: "{pn} Your Notice Text",
    envConfig: {
      delayPerGroup: 300,
      videoLinks: [
        "https://drive.google.com/file/d/1-ZlKd-Gp3aDYMncf_5G2wSuSLMxEGPSI/view?usp=drivesdk",
        "https://drive.google.com/file/d/1-nI4xKS6Kmgk535JCJ0ImzWEz27Da8f_/view?usp=drivesdk",
        "https://drive.google.com/file/d/1-lL4N88ypSZqK-soaeGVB24psIsZCnTW/view?usp=drivesdk",
        "https://drive.google.com/file/d/1-kJ3l2B8TFSSFU7_ez4b_ZaLTe3DTKUM/view?usp=drivesdk",
        "https://drive.google.com/file/d/1-e3bORf0AyDhm1riFPQAuGNOu_IObMnu/view?usp=drivesdk",
        "https://drive.google.com/file/d/1-w0BXspoRULrPVm7ROCowj6hlWOQZWF5/view?usp=drivesdk",
        "https://drive.google.com/file/d/10uJUJk-97wh8enwLthimYojLUAnocR4m/view?usp=drivesdk",
        "https://drive.google.com/file/d/10pJ8In6C6bbJ4nE8uaBRFWv8pZgo0KWP/view?usp=drivesdk",
        "https://drive.google.com/file/d/10ld50yHKEd7MHi6S8L0FQqXXmCpDhT8B/view?usp=drivesdk",
        "https://drive.google.com/file/d/10kdiOwP5CMakfve45mvey4-D1GZjoiUm/view?usp=drivesdk",
        "https://drive.google.com/file/d/10iRCvmPZ4_rBxvCawallBt_Tc2tz9-Kw/view?usp=drivesdk",
        "https://drive.google.com/file/d/10fcQBzL7XFh9ZYpWPxKH3JiWcXWByF3Y/view?usp=drivesdk",
        "https://drive.google.com/file/d/10YNX3AvzuC5EwW2fcS10QIFlRtVy4fh5/view?usp=drivesdk",
        "https://drive.google.com/file/d/10TfPfZBCSKh8ujfaw3-rFt0qz_a-ZlYS/view?usp=drivesdk",
        "https://drive.google.com/file/d/10QT4fsr_pxGuMtE-BxAuJjoWkvC423QN/view?usp=drivesdk",
        "https://drive.google.com/file/d/10ORF3nmV0VWh9q5rE5443FFjKx5GtfU5/view?usp=drivesdk",
        "https://drive.google.com/file/d/10K9sOXzCUGCMIrFkWjAnTfdeoc1pu8gh/view?usp=drivesdk",
        "https://drive.google.com/file/d/10IV4zdjZJCw5e11ENiS9iXuMuJLkLUTW/view?usp=drivesdk",
        "https://drive.google.com/file/d/10C6TqgmRLC8fFE9RE2kdPgFA1lbaTiNO/view?usp=drivesdk",
        "https://drive.google.com/file/d/105Db-qiXxzCX2prBrbormEaJj2EkqGOu/view?usp=drivesdk",
        "https://drive.google.com/file/d/10-nDD_t_CuDJw1_6zT_6kswZE3BAuVQq/view?usp=drivesdk",
        "https://drive.google.com/file/d/10w7nF74Txr7Y1MfuNNhB35-zKmcAGQ22/view?usp=drivesdk",
        "https://drive.google.com/file/d/10vUJW2yKRwk9b4J8e-JUH5YMBJX0LsS9/view?usp=drivesdk"
      ]
    }
  },

  onStart: async function ({ message, api, event, args, commandName, envCommands }) {
    const { delayPerGroup, videoLinks } = envCommands[commandName];

    if (!Array.isArray(videoLinks) || videoLinks.length === 0)
      return message.reply("❌ No video links found in configuration.");

    if (!args.length)
      return message.reply("❗ Please enter your notice message.");

    const noticeText = args.join(" ");
    const timestamp = new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" });

    let mentions = [], userMention = "";
    if (event.messageReply?.senderID) {
      const info = await api.getUserInfo(event.messageReply.senderID);
      const name = info[event.messageReply.senderID]?.name || "User";
      userMention = name;
      mentions.push({ tag: name, id: event.messageReply.senderID });
    }

    const allThreads = await api.getThreadList(1000, null, ["INBOX"]);
    const groupThreads = allThreads.filter(t => t.isGroup && t.threadID !== event.threadID);
    if (groupThreads.length === 0) return message.reply("❌ No groups found.");

    message.reply(`⏳ Sending notice with random videos to ${groupThreads.length} groups...`);

    async function downloadVideo(gdriveLink, index) {
      const fileIdMatch = gdriveLink.match(/\/d\/([^/]+)\//);
      if (!fileIdMatch) throw new Error(`Invalid Google Drive link at index ${index}`);
      const fileId = fileIdMatch[1];
      const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
      const videoPath = path.join(__dirname, `temp_notice_video_${Date.now()}_${index}.mp4`);

      const response = await axios({
        method: "GET",
        url: downloadUrl,
        responseType: "stream"
      });

      const writer = fs.createWriteStream(videoPath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      return videoPath;
    }

    let success = 0, failed = [];
    const groupVideoHistory = {}; // Track which group got which video indexes

    for (const { threadID } of groupThreads) {
      try {
        const usedIndexes = groupVideoHistory[threadID] || [];
        const availableIndexes = videoLinks
          .map((_, i) => i)
          .filter(i => !usedIndexes.includes(i));

        if (availableIndexes.length === 0) {
          groupVideoHistory[threadID] = [];
          availableIndexes.push(...videoLinks.map((_, i) => i));
        }

        const randomIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
        const selectedLink = videoLinks[randomIndex];
        const videoPath = await downloadVideo(selectedLink, randomIndex);

        const stylishText = `
╔═✪═✪═✪═✪═✪═✪═✪═╗
    ⚡⚡ 𝗥𝗔𝗛𝗔𝗗 𝓞𝓕𝓕𝓘𝓒𝓘𝓐𝓛 ⚡⚡
        🅽🅾🆃🅸🅲🅴 🅱🅾🆃 ⚡⚡
╚═✪═✪═✪═✪═✪═✪═✪═╝

🗓️ 𝕯𝖆𝖙𝖊 & 𝕋𝖎𝖒𝖊: ✨ ${timestamp} ✨

${userMention ? `👤 𝓜𝓮𝓷𝓽𝓲𝓸𝓷𝗲𝗱: 💫 ${userMention}\n` : ""}

🗣️ 𝓝𝓸𝓽𝓲𝓬𝓮:
${noticeText.split('\n').map(line => `     ▶︎ 𝔹𝕠𝕝𝕕: ${line}`).join('\n')}

───────────────────────────────

⚠️ 𝓟𝓵𝓮𝓪𝓼𝓮 𝓣𝓪𝓴𝓮 𝓐𝓬𝓽𝓲𝓸𝓷! ⚠️

═══════════════════════════════
🎉 𝕿𝖍𝖆𝖓𝖐 𝖄𝖔𝖚 𝖋𝖔𝖗 𝕿𝖗𝖚𝖘𝖙𝖎𝖓𝖌 𝗥𝗔𝗛𝗔𝗗 𝕭𝖔𝖙! 🎉
═══════════════════════════════
`;

        await api.sendMessage({
          body: stylishText,
          mentions,
          attachment: fs.createReadStream(videoPath)
        }, threadID);

        await fs.remove(videoPath);
        success++;

        if (!groupVideoHistory[threadID]) groupVideoHistory[threadID] = [];
        groupVideoHistory[threadID].push(randomIndex);

        await new Promise(r => setTimeout(r, delayPerGroup));
      } catch (err) {
        failed.push({ id: threadID, error: err.message });
      }
    }

    const report = `🎉 Done!\n✅ Sent: ${success}\n❌ Failed: ${failed.length}` +
      (failed.length ? "\n" + failed.map(f => `• ${f.id}: ${f.error}`).join("\n") : "");
    message.reply(report);
  }
};

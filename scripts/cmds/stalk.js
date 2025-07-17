const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: "stalk",
    version: "1.0",
    author: "ChatGPT & Bayjid",
    shortDescription: { en: "Facebook profile info by UID or reply" },
    longDescription: { en: "Get Facebook profile info including name, followers, birthday, work, location, etc." },
    category: "tools",
    guide: { en: "Use .stalk [uid] or reply to a user's message." }
  },

  onStart: async function ({ api, event, args, message }) {
    let uid = args[0];

    if (!uid && event.type === "message_reply") {
      uid = event.messageReply.senderID;
    }

    if (!uid) return message.reply("❌ Please reply to a message or provide a UID.");

    const url = `https://facebook-tools-six.vercel.app/api/stalk?uid=${uid}`;

    try {
      const res = await axios.get(url);
      const data = res.data.result;

      if (!data.name) return message.reply("❌ Failed to fetch data. UID may be private or invalid.");

      let text = `👤 𝗡𝗮𝗺𝗲: ${data.name}\n`;
      text += `🆔 𝗨𝗜𝗗: ${uid}\n`;
      text += data.follow || data.follow === 0 ? `👥 𝗙𝗼𝗹𝗹𝗼𝘄𝗲𝗿𝘀: ${data.follow}\n` : "";
      text += data.birthday ? `🎂 𝗕𝗶𝗿𝘁𝗵𝗱𝗮𝘆: ${data.birthday}\n` : "";
      text += data.relationship ? `❤️ 𝗥𝗲𝗹𝗮𝘁𝗶𝗼𝗻𝘀𝗵𝗶𝗽: ${data.relationship}\n` : "";
      text += data.work ? `💼 𝗪𝗼𝗿𝗸: ${data.work}\n` : "";
      text += data.location ? `📍 𝗟𝗼𝗰𝗮𝘁𝗶𝗼𝗻: ${data.location}\n` : "";
      text += data.hometown ? `🏡 𝗛𝗼𝗺𝗲𝘁𝗼𝘄𝗻: ${data.hometown}\n` : "";
      text += data.website ? `🔗 𝗪𝗲𝗯𝘀𝗶𝘁𝗲: ${data.website}\n` : "";
      text += `📎 𝗣𝗿𝗼𝗳𝗶𝗹𝗲: https://facebook.com/${uid}`;

      const img1 = data.profileUrl;
      const img2 = data.coverUrl;
      const attachments = [];

      if (img1) attachments.push(await getStreamFromURL(img1));
      if (img2) attachments.push(await getStreamFromURL(img2));

      return message.reply({ body: text, attachment: attachments });
    } catch (e) {
      console.error(e);
      return message.reply("❌ Error while fetching profile data.");
    }
  }
};

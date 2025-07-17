const axios = require("axios");
const { getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: "stalk",
    version: "2.0",
    author: "Bayjid & ChatGPT",
    shortDescription: { en: "Facebook stalk from UID or reply" },
    longDescription: { en: "View Facebook user info with photo attachments" },
    category: "tools",
    guide: { en: "{pn} [UID or FB link] or reply to a user message" }
  },

  onStart: async function ({ message, args, event }) {
    let uid;

    // ✅ Auto detect UID from reply
    if (event.type === "message_reply") {
      const replyUID = event.messageReply.senderID;
      if (!replyUID) return message.reply("❌ Failed to get UID from replied message.");
      uid = replyUID;
    }
    // ✅ UID or link from args
    else if (args[0]) {
      uid = args[0].includes("facebook.com")
        ? args[0].split("/").pop().split("?")[0]
        : args[0];
    } else {
      return message.reply("❌ Please provide a UID/link or reply to a user's message.");
    }

    const api = `https://api-dien.kira1011.repl.co/stalk?uid=${uid}`;

    try {
      const res = await axios.get(api);
      const info = res.data.result;

      const text = `
🔍 𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞 𝗦𝗧𝗔𝗟𝗞 𝗥𝗘𝗣𝗢𝗥𝗧
──────────────────────
👤 Name: ${info.name}
⚡ First Name: ${info.firstName}
🆔 UID: ${info.uid}
🔗 Username: ${info.username || "None"}
🌐 Profile: ${info.link}
📅 Created: ${info.created_time || "N/A"} | ${info.time || ""}
☑️ Verified: ${info.is_verified ? "✅ Yes" : "❌ No"}

🎂 Birthday: ${info.birthday || "No data"}
🗣️ Gender: ${info.gender || "No data"}
💘 Relationship: ${info.relationship_status || "No data"}
💋 Nickname: ${info.nicknames?.join(", ") || "None"}
🧠 About: ${info.about || "None"}
💬 Quotes: ${info.quotes || "None"}
💭 Love Status: ${info.love || "None"}

🌍 Location:
🏠 Hometown: ${info.hometown || "N/A"}
📌 Locale: ${info.locale || "N/A"}
🌐 Website: ${info.website || "None"}

📊 Social:
👥 Followers: ${info.follow || "No data"}
🏢 Works At: ${info.work || "No data"}
──────────────────────`.trim();

      const attachments = [];

      if (info.profile_picture) {
        try {
          attachments.push(await getStreamFromURL(info.profile_picture));
        } catch {}
      }

      if (info.cover_photo) {
        try {
          attachments.push(await getStreamFromURL(info.cover_photo));
        } catch {}
      }

      message.reply({ body: text, attachment: attachments });

    } catch (err) {
      console.log("❌ STALK API ERROR:", err.message || err);
      message.reply("❌ Failed to fetch data. Maybe UID is wrong or the server is down.");
    }
  }
};

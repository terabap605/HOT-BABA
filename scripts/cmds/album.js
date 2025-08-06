const axios = require("axios");
const fs = require("fs");
const path = require("path");

const baseApiUrl = async () => {
  // Apnar base API URL ekhane
  return "https://your-base-api-url.com"; // Replace kore deben apnar real API url diye
};

module.exports = {
  config: {
    name: "album",
    version: "1.0",
    role: 0,
    author: "Dipto",
    description: "Send album video/photo options",
    countDown: 5,
  },

  onStart: async function ({ api, event }) {
    const albumList = `
╔═════ 『🎬』═════╗
💖 𝐍𝐀𝐖 𝐁𝐀𝐁𝐘 𝐀𝐋𝐁𝐔𝐌 💥
1. Funny
2. Islamic
3. Sad
4. Anime
5. Cartoon
6. Lofi
7. Horny (Admin only)
8. Love
9. Baby
10. Photo
11. Aesthetic
12. Sigma
13. Lyrics
14. Cat
15. Sex (Admin only)
16. Free Fire
17. Football
18. Girl
19. Friend
╚═════ 『✨』═════╝
Reply with number (1-19)
    `;
    return api.sendMessage(albumList, event.threadID, event.messageID);
  },

  onReply: async function ({ api, event, Reply }) {
    const admin = "100044327656712";
    api.unsendMessage(Reply.messageID);

    if (event.type !== "message_reply")
      return api.sendMessage(
        "❌ Please reply to the album message with a number 1-19!",
        event.threadID,
        event.messageID
      );

    const reply = parseInt(event.body);
    if (isNaN(reply) || reply < 1 || reply > 19) {
      return api.sendMessage(
        "❌ Please reply with a valid number between 1 and 19!",
        event.threadID,
        event.messageID
      );
    }

    let query = "";
    let cp = "";

    switch (reply) {
      case 1:
        query = "funny";
        cp = `
╔═════ 『🎬』═════╗
💖 𝙉𝘼𝙒 𝘽𝘼𝘽𝙔 𝙁𝙐𝙉𝙉𝙔 𝙑𝙄𝘿𝙀𝙊 𝙏𝙄𝙈𝙀 💥
🤣 𝑳𝒂𝒖𝒈𝒉 𝒐𝒖𝒕 𝒍𝒐𝒖𝒅 𝒘𝒊𝒕𝒉 𝒄𝒖𝒕𝒆 𝒗𝒊𝒃𝒆𝒔
╚═════ 『✨』═════╝
`;
        break;

      case 2:
        query = "islamic";
        cp = `
╔═════ 『🌙』═════╗
💖 𝙉𝘼𝙒 𝘽𝘼𝘽𝙔 𝙄𝙎𝙇𝘼𝙈𝙄𝘾 𝙑𝙄𝘿𝙀𝙊 💫
🙏 𝘽𝙡𝙚𝙨𝙨𝙚𝙙 𝙢𝙤𝙢𝙚𝙣𝙩𝙨 𝙛𝙤𝙧 𝙮𝙤𝙪
╚═════ 『✨』═════╝
`;
        break;

      case 3:
        query = "sad";
        cp = `
╔═════ 『💔』═════╗
💖 𝙉𝘼𝙒 𝘽𝘼𝘽𝙔 𝙎𝘼𝘿 𝙑𝙄𝘿𝙀𝙊 💔
🥺 𝙏𝙤𝙪𝙘𝙝𝙞𝙣𝙜 𝙮𝙤𝙪𝙧 𝙝𝙚𝙖𝙧𝙩
╚═════ 『✨』═════╝
`;
        break;

      case 4:
        query = "anime";
        cp = `
╔═════ 『🌸』═════╗
💖 𝙉𝘼𝙒 𝘽𝘼𝘽𝙔 𝘼𝙉𝙄𝙈𝙀 𝙑𝙄𝘿𝙀𝙊 🌸
😘 𝙎𝙥𝙧𝙚𝙖𝙙 𝙩𝙝𝙚 𝙡𝙤𝙫𝙚 𝙤𝙛 𝙖𝙣𝙞𝙢𝙚
╚═════ 『✨』═════╝
`;
        break;

      case 5:
        query = "cartoon";
        cp = `
╔═════ 『🎨』═════╗
💖 𝙉𝘼𝙒 𝘽𝘼𝘽𝙔 𝘾𝘼𝙍𝙏𝙊𝙊𝙉 𝙑𝙄𝘿𝙀𝙊 🎨
😇 𝙁𝙪𝙣 𝙖𝙣𝙙 𝙘𝙤𝙡𝙤𝙧𝙛𝙪𝙡 𝙢𝙤𝙢𝙚𝙣𝙩𝙨
╚═════ 『✨』═════╝
`;
        break;

      case 6:
        query = "lofi";
        cp = `
╔═════ 『🎧』═════╗
💖 𝙉𝘼𝙒 𝘽𝘼𝘽𝙔 𝙇𝙊𝙁𝙄 𝙑𝙄𝘿𝙀𝙊 🎧
🔊 𝙍𝙚𝙡𝙖𝙭 𝙬𝙞𝙩𝙝 𝙩𝙝𝙚 𝙗𝙚𝙖𝙩𝙨
╚═════ 『✨』═════╝
`;
        break;

      case 7:
        if (event.senderID !== admin) return;
        query = "horny";
        cp = `
╔═════ 『🔥』═════╗
💖 𝙉𝘼𝙒 𝘽𝘼𝘽𝙔 𝙃𝙊𝙍𝙉𝙔 𝙑𝙄𝘿𝙀𝙊 🔥
🥵 𝙎𝙥𝙚𝙘𝙞𝙖𝙡 𝙛𝙤𝙧 𝙖𝙙𝙢𝙞𝙣
╚═════ 『✨』═════╝
`;
        break;

      case 8:
        query = "love";
        cp = `
╔═════ 『😍』═════╗
💖 𝙉𝘼𝙒 𝘽𝘼𝘽𝙔 𝙇𝙊𝙑𝙀 𝙑𝙄𝘿𝙀𝙊 😍
💝 𝙁𝙚𝙚𝙡 𝙩𝙝𝙚 𝙡𝙤𝙫𝙚
╚═════ 『✨』═════╝
`;
        break;

      case 9:
        query = "baby";
        cp = `
╔═════ 『🧸』═════╗
💖 𝙉𝘼𝙒 𝘽𝘼𝘽𝙔 𝘾𝙐𝙏𝙀 𝘽𝘼𝘽𝙔 𝙑𝙄𝘿𝙀𝙊 🧸
🧑‍🍼 𝘾𝙪𝙩𝙚𝙨𝙩 𝙗𝙖𝙗𝙮 𝙫𝙞𝙗𝙚𝙨
╚═════ 『✨』═════╝
`;
        break;

      case 10:
        query = "photo";
        cp = `
╔═════ 『📸』═════╗
💖 𝙉𝘼𝙒 𝘽𝘼𝘽𝙔 𝙍𝘼𝙉𝘿𝙊𝙈 𝙋𝙃𝙊𝙏𝙊 📸
😙 𝙍𝙖𝙣𝙙𝙤𝙢 𝙗𝙚𝙖𝙪𝙩𝙞𝙛𝙪𝙡 𝙥𝙝𝙤𝙩𝙤𝙨
╚═════ 『✨』═════╝
`;
        break;

      case 11:
        query = "aesthetic";
        cp = `
╔═════ 『😎』═════╗
💖 𝙉𝘼𝙒 𝘽𝘼𝘽𝙔 𝘼𝙀𝙎𝙏𝙃𝙀𝙏𝙄𝘾 𝙑𝙄𝘿𝙀𝙊 😎
✨ 𝙎𝙩𝙮𝙡𝙞𝙨𝙝 𝙖𝙣𝙙 𝙘𝙝𝙞𝙘 𝙢𝙤𝙢𝙚𝙣𝙩𝙨
╚═════ 『✨』═════╝
`;
        break;

      case 12:
        query = "sigma";
        cp = `
╔═════ 『🦾』═════╗
💖 𝙉𝘼𝙒 𝘽𝘼𝘽𝙔 𝙎𝙄𝙂𝙈𝘼 𝙍𝙐𝙇𝙀 𝙑𝙄𝘿𝙀𝙊 🦾
🐤 𝙎𝙩𝙧𝙤𝙣𝙜 𝙖𝙣𝙙 𝙛𝙤𝙧𝙘𝙚𝙛𝙪𝙡
╚═════ 『✨』═════╝
`;
        break;

      case 13:
        query = "lyrics";
        cp = `
╔═════ 『🎤』═════╗
💖 𝙉𝘼𝙒 𝘽𝘼𝘽𝙔 𝙇𝙔𝙍𝙄𝘾𝙎 𝙑𝙄𝘿𝙀𝙊 🎤
🥰 𝙈𝙪𝙨𝙞𝙘 𝙛𝙤𝙧 𝙩𝙝𝙚 𝙨𝙤𝙪𝙡
╚═════ 『✨』═════╝
`;
        break;

      case 14:
        query = "cat";
        cp = `
╔═════ 『🐱』═════╗
💖 𝙉𝘼𝙒 𝘽𝘼𝘽𝙔 𝘾𝘼𝙏 𝙑𝙄𝘿𝙀𝙊 🐱
😙 𝘾𝙪𝙩𝙚 𝙘𝙖𝙩 𝙢𝙤𝙢𝙚𝙣𝙩𝙨
╚═════ 『✨』═════╝
`;
        break;

      case 15:
        if (event.senderID !== admin) return;
        query = "sex";
        cp = `
╔═════ 『🔞』═════╗
💖 𝙉𝘼𝙒 𝘽𝘼𝘽𝙔 𝙎𝙀𝙓 𝙑𝙄𝘿𝙀𝙊 🔞
😙 𝙁𝙤𝙧 𝙖𝙙𝙢𝙞𝙣 𝙤𝙣𝙡𝙮
╚═════ 『✨』═════╝
`;
        break;

      case 16:
        query = "ff";
        cp = `
╔═════ 『🔥』═════╗
💖 𝙉𝘼𝙒 𝘽𝘼𝘽𝙔 𝙁𝙍𝙀𝙀 𝙁𝙄𝙍𝙀 𝙑𝙄𝘿𝙀𝙊 🔥
😙 𝙂𝙖𝙢𝙚 𝙏𝙞𝙢𝙚
╚═════ 『✨』═════╝
`;
        break;

      case 17:
        query = "football";
        cp = `
╔═════ 『⚽』═════╗
💖 𝙉𝘼𝙒 𝘽𝘼𝘽𝙔 𝙁𝙊𝙊𝙏𝘽𝘼𝙇𝙇 𝙑𝙄𝘿𝙀𝙊 ⚽
😙 𝙎𝙘𝙤𝙧𝙚 𝙨𝙤𝙢𝙚 𝙜𝙤𝙖𝙡𝙨
╚═════ 『✨』═════╝
`;
        break;

      case 18:
        query = "girl";
        cp = `
╔═════ 『💃』═════╗
💖 𝙉𝘼𝙒 𝘽𝘼𝘽𝙔 𝙂𝙄𝙍𝙇 𝙑𝙄𝘿𝙀𝙊 💃
😙 𝙁𝙤𝙧 𝙩𝙝𝙚 𝙡𝙖𝙙𝙞𝙚𝙨
╚═════ 『✨』═════╝
`;
        break;

      case 19:
        query = "friend";
        cp = `
╔═════ 『🤝』═════╗
💖 𝙉𝘼𝙒 𝘽𝘼𝘽𝙔 𝙁𝙍𝙄𝙀𝙉𝘿𝙎 𝙑𝙄𝘿𝙀𝙊 🤝
😙 𝙁𝙤𝙧 𝙗𝙚𝙨𝙩 𝙗𝙪𝙙𝙙𝙞𝙚𝙨
╚═════ 『✨』═════╝
`;
        break;

      default:
        return api.sendMessage(
          "❌ Please reply with a valid number 1-19!",
          event.threadID,
          event.messageID
        );
    }

    try {
      const res = await axios.get(`${await baseApiUrl()}/album?type=${query}`);
      const mediaUrl = res.data.data;

      const mediaRes = await axios.get(mediaUrl, {
        responseType: "arraybuffer",
        headers: { "User-Agent": "Mozilla/5.0" },
      });

      const filename = path.join(__dirname, `temp_${Date.now()}.mp4`);
      fs.writeFileSync(filename, Buffer.from(mediaRes.data, "binary"));

      return api.sendMessage(
        {
          body: cp + `\n\n📥 Download Link: ${mediaUrl}`,
          attachment: fs.createReadStream(filename),
        },
        event.threadID,
        () => fs.unlinkSync(filename),
        event.messageID
      );
    } catch (error) {
      return api.sendMessage(
        "❌ Error occurred while fetching media.",
        event.threadID,
        event.messageID
      );
    }
  },
};

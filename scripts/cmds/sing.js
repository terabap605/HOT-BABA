const axios = require("axios");
const fs = require("fs");

const baseApiUrl = async () => {
  const res = await axios.get("https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json");
  return res.data.api;
};

module.exports = {
  config: {
    name: "sing",
    aliases: ["music", "play"],
    version: "1.2.0",
    author: "Dipto",
    countDown: 5,
    role: 0,
    description: {
      en: "Download audio from YouTube",
    },
    category: "media",
    guide: {
      en: "{pn} <song name or YouTube link>\n\nExample:\n{pn} chipi chipi chapa chapa",
    },
  },

  onStart: async ({ api, args, event, commandName }) => {
    const checkUrl = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})(?:\S+)?$/;
    let query = args.join(" ");

    if (!query) return api.sendMessage("🎧 ➤ Please provide a song name or YouTube link.", event.threadID, event.messageID);

    const isLink = checkUrl.test(query);

    // If it's a YouTube link
    if (isLink) {
      const videoID = query.match(checkUrl)?.[1];
      try {
        const { data } = await axios.get(`${await baseApiUrl()}/ytDl3?link=${videoID}&format=mp3`);
        const { title, downloadLink, quality } = data;

        return api.sendMessage(
          {
            body: `╭────────────╮\n│ 🎵 𝙋𝙡𝙖𝙮𝙞𝙣𝙜 𝙉𝙤𝙬 🎧\n│ ▸ Title: ${title}\n│ ▸ Quality: ${quality}\n╰────────────╯`,
            attachment: await downloadAudio(downloadLink, "audio.mp3"),
          },
          event.threadID,
          () => fs.unlinkSync("audio.mp3"),
          event.messageID
        );
      } catch (err) {
        return api.sendMessage("❌ Failed to download audio. Please try another link.", event.threadID, event.messageID);
      }
    }

    // If it's a song name
    try {
      const results = (await axios.get(`${await baseApiUrl()}/ytFullSearch?songName=${encodeURIComponent(query)}`)).data.slice(0, 6);

      if (!results.length) {
        return api.sendMessage(`❌ No results found for: ${query}`, event.threadID, event.messageID);
      }

      let msg = "╭───────────────╮\n│ 🎶 𝙈𝙪𝙨𝙞𝙘 𝙁𝙞𝙣𝙙𝙚𝙧 🎼\n";
      const thumbs = [];

      results.forEach((item, index) => {
        msg += `│ ▸ ${index + 1}. ${item.title}\n`;
        msg += `│     ⏱ Duration: ${item.time}\n`;
        msg += `│     📺 Channel: ${item.channel.name}\n│\n`;
        thumbs.push(downloadImage(item.thumbnail, `thumb${index + 1}.jpg`));
      });

      msg += "╰───────────────╯\n📝 Reply with the number to download ⬇️";

      api.sendMessage(
        {
          body: msg,
          attachment: await Promise.all(thumbs),
        },
        event.threadID,
        (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName,
            messageID: info.messageID,
            author: event.senderID,
            result: results,
          });
        },
        event.messageID
      );
    } catch (error) {
      return api.sendMessage("❌ Error while searching songs. Try again later.", event.threadID, event.messageID);
    }
  },

  onReply: async ({ event, api, Reply }) => {
    const { result } = Reply;
    const choice = parseInt(event.body);

    if (isNaN(choice) || choice < 1 || choice > result.length) {
      return api.sendMessage("❗ Please reply with a number from the list (1-6).", event.threadID, event.messageID);
    }

    const selected = result[choice - 1];

    try {
      const { data } = await axios.get(`${await baseApiUrl()}/ytDl3?link=${selected.id}&format=mp3`);
      const { title, downloadLink, quality } = data;

      await api.unsendMessage(Reply.messageID);
      return api.sendMessage(
        {
          body: `╭────────────╮\n│ 🎵 𝙋𝙡𝙖𝙮𝙞𝙣𝙜 𝙉𝙤𝙬 🎧\n│ ▸ Title: ${title}\n│ ▸ Quality: ${quality}\n╰────────────╯`,
          attachment: await downloadAudio(downloadLink, "audio.mp3"),
        },
        event.threadID,
        () => fs.unlinkSync("audio.mp3"),
        event.messageID
      );
    } catch (err) {
      return api.sendMessage("❌ Couldn’t fetch audio. Try a different option.", event.threadID, event.messageID);
    }
  },
};

async function downloadAudio(url, pathName) {
  const res = await axios.get(url, { responseType: "arraybuffer" });
  fs.writeFileSync(pathName, Buffer.from(res.data));
  return fs.createReadStream(pathName);
}

async function downloadImage(url, pathName) {
  const res = await axios.get(url, { responseType: "stream" });
  res.data.path = pathName;
  return res.data;
}

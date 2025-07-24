const axios = require("axios");
const fs = require("fs");
const path = require("path");
const https = require("https");

const cacheDir = path.join(__dirname, "cache");
if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

let spotifyCache = {};

module.exports = {
  config: {
    name: "spotify",
    aliases: ["spot", "spt"],
    version: "2.0",
    author: "mirrykal + ChatGPT + PrinceTech",
    countDown: 5,
    role: 0,
    shortDescription: "Spotify song search",
    longDescription: "Search songs from Spotify and download as mp3",
    category: "media",
    guide: {
      en: "{pn} [song name]\nReply with number (1-7) to download."
    }
  },

  onStart: async function ({ message, args, event }) {
    if (!args[0]) return message.reply("🎧 Please enter a song name!");

    const query = encodeURIComponent(args.join(" "));
    const url = `https://api.princetechn.com/api/search/spotifysearch?apikey=prince&query=${query}`;

    try {
      const res = await axios.get(url);
      const results = res.data?.results?.slice(0, 7);

      if (!results || results.length === 0)
        return message.reply("❌ No songs found.");

      let msg = "🎶 𝗦𝗽𝗼𝘁𝗶𝗳𝘆 𝗦𝗲𝗮𝗿𝗰𝗵 𝗥𝗲𝘀𝘂𝗹𝘁𝘀:\n\n";
      results.forEach((track, i) => {
        msg += `${i + 1}. ${track.title} - ${track.artist} (${track.duration})\n`;
      });
      msg += "\n🔢 Reply with 1–7 to download the song.";

      // Save cache using messageID
      spotifyCache[event.messageID] = results;

      message.reply(msg, (err, info) => {
        spotifyCache[info.messageID] = results;
      });

    } catch (err) {
      console.error(err);
      message.reply("❌ Failed to search song.");
    }
  },

  onReply: async function ({ message, Reply, event }) {
    const choice = parseInt(event.body.trim());
    if (isNaN(choice) || choice < 1 || choice > 7) return;

    const selected = spotifyCache[Reply.messageID]?.[choice - 1];
    if (!selected) return message.reply("❌ Song not found.");

    delete spotifyCache[Reply.messageID];

    const downloadUrl = `https://api.princetechn.com/api/download/spotifydl?apikey=prince&url=${encodeURIComponent(selected.url)}`;
    message.reply(`⏬ Downloading "${selected.title}"...`);

    try {
      const res = await axios.get(downloadUrl);
      const data = res.data?.result;

      if (!data || !data.download_url)
        return message.reply("❌ Download link not available.");

      // Send thumbnail and info
      const infoMsg = {
        body: `🎧 𝗧𝗶𝘁𝗹𝗲: ${data.title}\n⏱ 𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻: ${data.duration}`,
        attachment: await global.utils.getStreamFromURL(data.thumbnail)
      };
      await message.reply(infoMsg);

      // Download audio
      const fileName = `${data.title.replace(/[^a-z0-9]/gi, "_")}.mp3`;
      const filePath = path.join(cacheDir, fileName);
      const file = fs.createWriteStream(filePath);

      await new Promise((resolve, reject) => {
        https.get(data.download_url, (res) => {
          res.pipe(file);
          file.on("finish", () => file.close(resolve));
        }).on("error", (err) => {
          fs.unlinkSync(filePath);
          reject(err);
        });
      });

      // Send file
      await message.reply({
        body: `✅ Here’s your song: ${data.title}`,
        attachment: fs.createReadStream(filePath)
      });

      // Auto delete file
      setTimeout(() => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }, 10000);

    } catch (err) {
      console.error("Download error:", err.message);
      message.reply("❌ Failed to download song.");
    }
  }
};

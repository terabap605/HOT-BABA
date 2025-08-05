const axios = require("axios");
const yts = require("yt-search");

const baseApiUrl = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json");
  return base.data.api;
};

(async () => {
  global.apis = {
    diptoApi: await baseApiUrl()
  };
})();

async function getStreamFromURL(url, pathName) {
  try {
    const response = await axios.get(url, {
      responseType: "stream"
    });
    response.data.path = pathName;
    return response.data;
  } catch (err) {
    throw err;
  }
}

global.utils = {
  ...global.utils,
  getStreamFromURL: global.utils.getStreamFromURL || getStreamFromURL
};

function getVideoID(url) {
  const reg = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;
  const match = url.match(reg);
  return match ? match[1] : null;
}

const config = {
  name: "sing2",
  version: "1.3.0",
  author: "Mesbah Saxx",
  credits: "Mesbah Saxx",
  role: 0,
  hasPermission: 0,
  description: "🎶 Search or download YouTube MP3 easily",
  usePrefix: true,
  category: "media",
  cooldowns: 5,
};

async function onStart({ api, args, event }) {
  try {
    let videoID;
    const input = args.join(" ");
    let waitingMessage;

    if (!input) return api.sendMessage("🎧 ➤ Please enter a song name or YouTube link.", event.threadID, event.messageID);

    // If it's a YouTube link
    if (input.includes("youtube.com") || input.includes("youtu.be")) {
      videoID = getVideoID(input);
      if (!videoID) return api.sendMessage("❌ Invalid YouTube link.", event.threadID, event.messageID);
    } else {
      // Search randomly from top 50 results
      waitingMessage = await api.sendMessage(`🔍 Searching for “${input}”...`, event.threadID);
      const search = await yts(input);
      const list = search.videos.slice(0, 50);
      if (!list.length) return api.sendMessage("❌ No results found.", event.threadID, event.messageID);
      const chosen = list[Math.floor(Math.random() * list.length)];
      videoID = chosen.videoId;
    }

    const { data: { title, quality, downloadLink } } = await axios.get(`${global.apis.diptoApi}/ytDl3?link=${videoID}&format=mp3`);
    if (waitingMessage?.messageID) api.unsendMessage(waitingMessage.messageID);

    const shortURL = (await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(downloadLink)}`)).data;

    const responseMessage =
`╭─────⭓
│ 🎵 𝙏𝙞𝙩𝙡𝙚: ${title}
│ 📶 𝙌𝙪𝙖𝙡𝙞𝙩𝙮: ${quality}
│ 🔗 𝘿𝙤𝙬𝙣𝙡𝙤𝙖𝙙: ${shortURL}
╰───────────────⭓`;

    await api.sendMessage({
      body: responseMessage,
      attachment: await global.utils.getStreamFromURL(downloadLink, `${title}.mp3`)
    }, event.threadID, event.messageID);
  } catch (err) {
    console.log(err);
    api.sendMessage("❌ Something went wrong:\n" + (err.response?.data?.message || err.message), event.threadID, event.messageID);
  }
}

module.exports = {
  config,
  onStart,
  run: onStart
};

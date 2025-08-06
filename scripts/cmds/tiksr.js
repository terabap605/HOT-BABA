const axios = require("axios");

const baseApiUrl = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json");
  return base.data.api;
};

module.exports.config = {
  name: "tiksr",
  version: "1.0",
  author: "Rahad",
  countDown: 5,
  role: 0,
  description: {
    en: "Search for TikTok videos",
  },
  category: "media",
  guide: {
    en:
      "{pn} <search> - <optional: number of results | blank>" +
      "\nExample:\n" +
      "{pn} caredit - 50",
  },
};

module.exports.onStart = async function ({ api, args, event }) {
  let search = args.join(" ");
  if (!search || search.trim() === "")
    return api.sendMessage("❗ Please provide a search keyword.", event.threadID, event.messageID);

  let searchLimit = 30;

  const match = search.match(/^(.+)\s*-\s*(\d+)$/);
  if (match) {
    search = match[1].trim();
    searchLimit = parseInt(match[2], 10);
    if (isNaN(searchLimit) || searchLimit <= 0 || searchLimit > 100)
      return api.sendMessage("❗ Please provide a result limit between 1 and 100.", event.threadID, event.messageID);
  }

  try {
    const baseUrl = await baseApiUrl();
    const apiUrl = `${baseUrl}/tiktoksearch?search=${encodeURIComponent(search)}&limit=${searchLimit}`;
    const response = await axios.get(apiUrl);
    const data = response.data.data;

    if (!data || data.length === 0)
      return api.sendMessage("❗ No TikTok videos found for this search.", event.threadID, event.messageID);

    const videoData = data[Math.floor(Math.random() * data.length)];

    const stream = await axios({
      method: "get",
      url: videoData.video,
      responseType: "stream",
    });

    const infoMessage =
`╭━━『 𝙏𝙄𝙆𝙏𝙊𝙆 𝙎𝙀𝘼𝙍𝘾𝙃 - 𝙍𝘼𝙃𝘼𝘿 』━━╮
📌 𝙏𝙞𝙩𝙡𝙚: ${videoData.title || "No Title"}
👤 𝙐𝙨𝙚𝙧: @${videoData.author || "unknown"}
🎯 𝙏𝙤𝙥𝙞𝙘: ${search} - ${searchLimit}
📎 𝘿𝙤𝙬𝙣𝙡𝙤𝙖𝙙: ${videoData.video}
╰───⫷ 𝙍𝘼𝙃𝘼𝘿 𝘽𝙊𝙏 ⫸───╯`;

    api.sendMessage({
      body: infoMessage,
      attachment: stream.data,
    }, event.threadID, event.messageID);

  } catch (error) {
    console.error("TikTok API Error:", error.message || error);
    api.sendMessage("❗ An error occurred while searching or downloading the TikTok video.", event.threadID, event.messageID);
  }
};

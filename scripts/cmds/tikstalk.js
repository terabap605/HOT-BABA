const axios = require("axios");

const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`
  );
  return base.data.xnil;
};

module.exports = {
  config: {
    name: "tikstalk",
    version: "1.0",
    hasPermssion: 0,
    usePrefix: true,
    credits: "xnil",
    description: "Get TikTok user information",
    category: "information",
    cooldowns: 10,
  },

  // ✅ This is the correct function name for Goat Bot V2
  onStart: async function ({ event, api, args }) {
    const userName = args.join(" ");

    if (!userName) {
      return api.sendMessage("⚠️ Please provide a TikTok username.", event.threadID);
    }

    try {
      const response = await axios.get(
        `${await baseApiUrl()}/tikstalk?uniqueid=${encodeURIComponent(userName)}`
      );

      const data = response.data;

      if (!data || !data.id) {
        return api.sendMessage("❌ User not found or invalid response.", event.threadID);
      }

      const userInfoMessage = {
        body:
          `📱 TikTok User Info\n\n` +
          `🆔 ID: ${data.id}\n` +
          `👤 Username: @${data.uniqueId}\n` +
          `📛 Name: ${data.nickname}\n` +
          `📝 Bio: ${data.signature || "No bio set"}\n` +
          `👥 Followers: ${data.followerCount.toLocaleString()}\n` +
          `👣 Following: ${data.followingCount.toLocaleString()}\n` +
          `❤️ Total Likes: ${data.heartCount.toLocaleString()}\n` +
          `🎞️ Videos: ${data.videoCount}\n` +
          `🔒 secUid: ${data.secUid}`,
        attachment: await global.utils.getStreamFromURL(data.avatarLarger)
      };

      return api.sendMessage(userInfoMessage, event.threadID);
    } catch (error) {
      console.error("TikTok API Error:", error);
      return api.sendMessage("⚠️ Error fetching TikTok user info. Try again later.", event.threadID);
    }
  }
};

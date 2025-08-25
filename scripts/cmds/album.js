const { GoatWrapper } = require("fca-liane-utils");
const fs = require("fs");
const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "album",
    version: "1.7",
    role: 0,
    author: "MAHABUB",
    category: "media",
    guide: {
      en: "{p}{n} [cartoon/sad/islamic/funny/anime/...]",
    },
  },

  onStart: async function ({ api, event, args }) {
    if (!args[0]) {
      api.setMessageReaction("😽", event.messageID, (err) => {}, true);

      const albumOptions = [
        "Funny Video", "Islamic Video", "Sad Video", "Anime Video",
        "Cartoon Video", "LoFi Video", "Couple Video", "Flower Video",
        "Aesthetic Video", "Sigma Video", "Lyrics Video", "Cat Video",
        "Free Fire Video", "Football Video", "Girl Video", "Friends Video"
      ];

      const message = "Here is your available album video list 📔\n" +
        "━━━━━━━━━━━━━━━━━━━━━\n" +
        albumOptions.map((option, index) => `${index + 1}. ${option}`).join("\n") +
        "\n━━━━━━━━━━━━━━━━━━━━━";

      return api.sendMessage(
        message,
        event.threadID,
        (error, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            type: "reply",
            messageID: info.messageID,
            author: event.senderID,
          });
        },
        event.messageID
      );
    }
  },

  onReply: async function ({ api, event, Reply }) {
    api.unsendMessage(Reply.messageID);

    const categories = [
      "funny", "islamic", "sad", "anime", "cartoon",
      "lofi", "couple", "flower", "aesthetic", "sigma",
      "lyrics", "cat", "freefire", "football", "girl", "friends"
    ];

    const captions = [
      "❰ Funny Video <😹 ❱", "❰ Islamic Video <🕋 ❱",
      "❰ Sad Video <😿 ❱", "❰ Anime Video <🥱 ❱",
      "❰ Cartoon Video <❤️‍🩹 ❱", "❰ LoFi Video <🌆 ❱",
      "❰ Couple Video <💑 ❱", "❰ Flower Video <🌸 ❱",
      "❰ Aesthetic Video <🎨 ❱", "❰ Sigma Video <🗿 ❱",
      "❰ Lyrics Video <🎵 ❱", "❰ Cat Video <🐱 ❱",
      "❰ Free Fire Video <🔥 ❱", "❰ Football Video <⚽ ❱",
      "❰ Girl Video <💃 ❱", "❰ Friends Video <👫🏼 ❱"
    ];

    const replyIndex = parseInt(event.body);

    if (isNaN(replyIndex) || replyIndex < 1 || replyIndex > categories.length) {
      return api.sendMessage("⚠️ Please reply with a valid number from the list!", event.threadID);
    }

    let query = categories[replyIndex - 1];
    let cp = captions[replyIndex - 1];

    try {
      const response = await axios.get(`https://mahabub-video-api.onrender.com/mahabub/${query}`);

      if (!response.data || !response.data.data) {
        return api.sendMessage("❌ No video found for this category!", event.threadID);
      }

      const videoUrl = response.data.data;
      const filePath = path.join(__dirname, "temp_video.mp4");

      const writer = fs.createWriteStream(filePath);
      const videoResponse = await axios({
        url: videoUrl,
        method: "GET",
        responseType: "stream"
      });

      videoResponse.data.pipe(writer);

      writer.on("finish", () => {
        api.sendMessage(
          { body: cp, attachment: fs.createReadStream(filePath) },
          event.threadID,
          () => fs.unlinkSync(filePath)
        );
      });

      writer.on("error", () => {
        api.sendMessage("❌ Failed to save the video file.", event.threadID);
      });

    } catch (error) {
      console.error("Error fetching video:", error);
      api.sendMessage("❌ Failed to fetch or download the video.", event.threadID);
    }
  }
};
const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });

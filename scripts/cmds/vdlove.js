const axios = require("axios");

module.exports = {
  config: {
    name: "vdlove",
    aliases: ["love", "lv"],
    version: "1.0",
    author: "Rahad Ff",
    countDown: 30,
    role: 0,
    shortDescription: "Send love video",
    longDescription: "Sends a random love video (direct download, no link shown)",
    category: "fun",
    guide: "{p}love"
  },

  sentVideos: [],

  onStart: async function ({ api, event, message }) {
    const loadingMessage = await message.reply("📤 Loading video...");

    const link = [
      "https://drive.google.com/uc?export=download&id=1BJi1mEvcOTTZOnwu2-6-3FqT3-JgupvN",
      "https://drive.google.com/uc?export=download&id=1BkW4XbrgiY0j9k0OD6wn2NGABFbp583A",
      "https://drive.google.com/uc?export=download&id=1BhxSyj6_2c8pTyUEUjf7oegiFiGgXm-r",
      "https://drive.google.com/uc?export=download&id=1BcogcdsuTQjI4WcYwgKIBYk20kB4UohH",
      "https://drive.google.com/uc?export=download&id=1BaABj4NkHwFULqTMrioZBCf7_wMwNLTK",
      "https://drive.google.com/uc?export=download&id=1BXhGAjyLHIg1Fw_FL-BdQDl605avVNHK",
      "https://drive.google.com/uc?export=download&id=1BPOtvg7O3O3OPouAaMK7uuNH-xhBPb5X",
      "https://drive.google.com/uc?export=download&id=1BMgRuH-4XL43O4mu0QhKO5kM4mGFj0SY",
      "https://drive.google.com/uc?export=download&id=1C-ItX9BP3WD5FZ_5sJL2JJmU2NYZPrCx",
      "https://drive.google.com/uc?export=download&id=1Bz_ig846wtcwFu2Vj685wEM-wfq6fhdT",
      "https://drive.google.com/uc?export=download&id=1BrkEgM16gQSM44RrK2C8a5CI_dsctzwB",
      "https://drive.google.com/uc?export=download&id=1BnHZ0dFx6w209AkcKSHadltIpT8sWA_n"
    ];

    const availableVideos = link.filter(video => !this.sentVideos.includes(video));

    if (availableVideos.length === 0) {
      this.sentVideos = [];
      availableVideos.push(...link);
    }

    const randomIndex = Math.floor(Math.random() * availableVideos.length);
    const randomVideo = availableVideos[randomIndex];
    this.sentVideos.push(randomVideo);

    try {
      await message.reply({
        body: "💖 Here's your video!",
        attachment: await global.utils.getStreamFromURL(randomVideo)
      });
    } catch (err) {
      await message.reply("❌ Failed to load video.");
    }

    setTimeout(() => {
      api.unsendMessage(loadingMessage.messageID);
    }, 3000);
  }
};

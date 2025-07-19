const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const jimp = require("jimp");

module.exports = {
  config: {
    name: "crush",
    version: "1.0",
    author: "Rahad",
    role: 0,
    shortDescription: { en: "Show crush love photo" },
    longDescription: { en: "Generate a crush image with your and their avatar" },
    category: "fun",
    guide: { en: "{pn} @mention" }
  },

  onStart: async function ({ message, event, usersData, api, args }) {
    try {
      const mention = Object.keys(event.mentions)[0];
      if (!mention) return message.reply("❌ | Please mention someone to crush on 💔");

      const one = event.senderID;
      const two = mention;

      const userOneAvatar = `https://graph.facebook.com/${one}/picture?width=512&height=512`;
      const userTwoAvatar = `https://graph.facebook.com/${two}/picture?width=512&height=512`;

      const [avatarOne, avatarTwo] = await Promise.all([
        jimp.read((await axios.get(userOneAvatar, { responseType: "arraybuffer" })).data),
        jimp.read((await axios.get(userTwoAvatar, { responseType: "arraybuffer" })).data)
      ]);

      const base = await jimp.read("https://i.imgur.com/fkRAT0N.jpg"); // 🔄 Change background if needed
      avatarOne.circle();
      avatarTwo.circle();

      base.resize(800, 600);
      avatarOne.resize(150, 150);
      avatarTwo.resize(150, 150);

      base.composite(avatarOne, 170, 220);
      base.composite(avatarTwo, 480, 220);

      const tempPath = path.join(__dirname, "cache", `crush_${one}_${two}.png`);
      await base.writeAsync(tempPath);

      message.reply({
        body: `💘 𝐂𝐑𝐔𝐒𝐇 𝐌𝐎𝐌𝐄𝐍𝐓 💘\n💖 ${event.senderID} + ${mention} 💖`,
        attachment: fs.createReadStream(tempPath)
      }, () => fs.unlinkSync(tempPath));

    } catch (err) {
      console.error(err);
      return message.reply("❌ | Error creating crush image. Try again later.");
    }
  }
};

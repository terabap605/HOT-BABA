const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const Canvas = require("canvas");

module.exports.config = {
  name: "crush",
  version: "1.0",
  author: "Rahad",
  countDown: 5,
  role: 0,
  shortDescription: {
    en: "Create a crush image with your and tagged user's profile picture"
  },
  longDescription: {
    en: "Make a cute Your Crush image with profile photos"
  },
  category: "image",
  guide: {
    en: "{pn} @mention"
  }
};

module.exports.run = async function ({ api, event }) {
  const mention = Object.keys(event.mentions)[0];
  if (!mention)
    return api.sendMessage("❤️ Please mention someone to crush on!", event.threadID);

  const senderID = event.senderID;
  const targetID = mention;

  const bgPath = path.join(__dirname, "..", "..", "cache", "crush.png");
  if (!fs.existsSync(bgPath))
    return api.sendMessage("❌ crush.png not found in /scripts/cmds/cache/", event.threadID);

  const getAvatar = async (uid) => {
    const url = `https://graph.facebook.com/${uid}/picture?height=512&width=512&access_token=350685531728|62f8ce9f74b12f84c123cc23437a4a32`;
    const pathImg = path.join(__dirname, `tmp_${uid}.png`);
    const res = await axios.get(url, { responseType: "arraybuffer" });
    fs.writeFileSync(pathImg, res.data);
    const img = await Canvas.loadImage(pathImg);
    fs.unlinkSync(pathImg);
    return img;
  };

  try {
    const canvas = Canvas.createCanvas(736, 414);
    const ctx = canvas.getContext("2d");

    const background = await Canvas.loadImage(bgPath);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    const senderAvatar = await getAvatar(senderID);
    const targetAvatar = await getAvatar(targetID);

    // Sender's profile (left circle)
    ctx.save();
    ctx.beginPath();
    ctx.arc(140, 215, 85, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(senderAvatar, 55, 130, 170, 170);
    ctx.restore();

    // Mentioned user's profile (right circle)
    ctx.save();
    ctx.beginPath();
    ctx.arc(590, 215, 85, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(targetAvatar, 505, 130, 170, 170);
    ctx.restore();

    const finalPath = path.join(__dirname, `crush_result_${Date.now()}.png`);
    fs.writeFileSync(finalPath, canvas.toBuffer());

    const msg = {
      body: `💘 ${event.senderID == senderID ? "You" : "Someone"} is crushing on ${event.mentions[mention]}!`,
      attachment: fs.createReadStream(finalPath)
    };

    api.sendMessage(msg, event.threadID, () => fs.unlinkSync(finalPath), event.messageID);
  } catch (e) {
    console.error(e);
    return api.sendMessage("❌ Error while creating your crush image.", event.threadID);
  }
};

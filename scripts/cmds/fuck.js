// fingering.js
const fs = require("fs-extra");
const Canvas = require("canvas");
const path = require("path");

module.exports = {
  config: {
    name: "fuck",
    aliases: ["chod", "choda"],
    version: "1.0.6",
    author: "RAHAD",
    countDown: 5,
    role: 0,
    shortDescription: "Crush edit with custom background",
    longDescription: "Put user profile pictures on custom background",
    category: "funny",
    guide: "{pn} @tag"
  },

  onLoad: async () => {
    const dirMaterial = path.join(__dirname, "cache");
    const bgPath = path.join(dirMaterial, "fingering_new.png");
    const bgUrl = "https://drive.google.com/uc?export=download&id=1-St_iO7eEDBPxIfpnmR4cT9BaBhnkDP9";

    if (!fs.existsSync(dirMaterial)) fs.mkdirSync(dirMaterial, { recursive: true });
    if (!fs.existsSync(bgPath)) {
      const { downloadFile } = global.utils;
      await downloadFile(bgUrl, bgPath);
    }
  },

  onStart: async function ({ event, api }) {
    try {
      const { senderID, mentions, threadID, messageID } = event;
      const mention = Object.keys(mentions || {});
      if (!mention[0]) return api.sendMessage("❌ | Please mention someone!", threadID, messageID);

      const id1 = senderID;
      const id2 = mention[0];

      const bgPath = path.join(__dirname, "cache/fingering_new.png");
      const background = await Canvas.loadImage(bgPath);

      // Create canvas
      const canvas = Canvas.createCanvas(background.width, background.height);
      const ctx = canvas.getContext("2d");

      // Draw background
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

      // Load avatars
      const avatar1 = await Canvas.loadImage(
        `https://graph.facebook.com/${id1}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
      );
      const avatar2 = await Canvas.loadImage(
        `https://graph.facebook.com/${id2}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
      );

      // Avatar positions (same as fuck.js style)
      const left = { x: 190, y: 200, size: 180 };
      const right = { x: 390, y: 200, size: 180 };

      function drawCircle(img, x, y, size) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, x, y, size, size);
        ctx.restore();
      }

      drawCircle(avatar1, left.x, left.y, left.size);
      drawCircle(avatar2, right.x, right.y, right.size);

      // Save & send
      const pathOut = path.join(__dirname, "cache/fingering_out.png");
      const out = fs.createWriteStream(pathOut);
      const stream = canvas.createPNGStream();
      stream.pipe(out);
      out.on("finish", () => {
        const bodyMessage = `
┏━❦━━━━━━━━❦━┓
   ⚡ 𝑶𝒉𝒉 𝒀𝒂𝒂𝒉 💥😩 ⚡
┗━❦━━━━━━━━❦━┛
        `;
        api.sendMessage(
          { body: bodyMessage, attachment: fs.createReadStream(pathOut) },
          threadID,
          () => fs.unlinkSync(pathOut),
          messageID
        );
      });
    } catch (err) {
      console.error(err);
      api.sendMessage("❌ | Something went wrong!", event.threadID, event.messageID);
    }
  }
};

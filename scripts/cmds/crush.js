const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports = {
  config: {
    name: "crush",
    aliases: [],
    version: "1.0",
    author: "Priyansh Rajput (Modified by ChatGPT for GodBot)",
    countDown: 5,
    role: 0,
    shortDescription: "Get Pair from Mention",
    longDescription: "Create a cute image with your crush",
    category: "fun",
    guide: "{pn} @mention"
  },

  onStart: async function ({ api, event, args }) {
    const mention = Object.keys(event.mentions);
    const senderID = event.senderID;
    const threadID = event.threadID;
    const messageID = event.messageID;

    if (!mention[0]) {
      return api.sendMessage("❌ কারো নাম ট্যাগ করো আগে!", threadID, messageID);
    }

    const one = senderID;
    const two = mention[0];

    try {
      const imagePath = await makeImage({ one, two });
      return api.sendMessage({
        body: "✧•❁𝐂𝐫𝐮𝐬𝐡❁•✧\n\n╔═══❖••° °••❖═══╗\n\n   𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥 𝐏𝐚𝐢𝐫𝐢𝐧𝐠\n\n╚═══❖••° °••❖═══╝\n\n   ✶⊶⊷⊷❍⊶⊷⊷✶\n\n       😏𝐃𝐇𝐎𝐑 𝐓𝐎𝐑 𝐆𝐅 𝐊𝐄 💘\n\n   ✶⊶⊷⊷❍⊶⊷⊷✶",
        attachment: fs.createReadStream(imagePath)
      }, threadID, () => fs.unlinkSync(imagePath), messageID);
    } catch (err) {
      console.error(err);
      return api.sendMessage("❌ ছবি তৈরিতে সমস্যা হয়েছে!", threadID, messageID);
    }
  },

  onLoad: async function () {
    const dir = path.join(__dirname, "cache", "canvas");
    const filePath = path.join(dir, "crush.png");

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(filePath)) {
      const img = await axios.get("https://i.imgur.com/PlVBaM1.jpg", { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, Buffer.from(img.data));
    }
  }
};

async function makeImage({ one, two }) {
  const __root = path.join(__dirname, "cache", "canvas");
  const bg = await jimp.read(path.join(__root, "crush.png"));

  const avatarOne = path.join(__root, `avt_${one}.png`);
  const avatarTwo = path.join(__root, `avt_${two}.png`);
  const outPath = path.join(__root, `crush_${Date.now()}.png`);

  const getAvatar = async (id, dest) => {
    const res = await axios.get(`https://graph.facebook.com/${id}/picture?width=512&height=512`, { responseType: "arraybuffer" });
    fs.writeFileSync(dest, Buffer.from(res.data));
  };

  await getAvatar(one, avatarOne);
  await getAvatar(two, avatarTwo);

  const circledOne = await jimp.read(await circle(avatarOne));
  const circledTwo = await jimp.read(await circle(avatarTwo));

  bg.composite(circledOne.resize(191, 191), 93, 111);
  bg.composite(circledTwo.resize(190, 190), 434, 107);

  const finalBuffer = await bg.getBufferAsync("image/png");
  fs.writeFileSync(outPath, finalBuffer);

  // Clean up
  fs.unlinkSync(avatarOne);
  fs.unlinkSync(avatarTwo);

  return outPath;
}

async function circle(imagePath) {
  const image = await jimp.read(imagePath);
  image.circle();
  return await image.getBufferAsync("image/png");
}

const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports.config = {
  name: "crush",
  version: "1.0.1",
  hasPermission: 0,
  credits: "Priyansh Rajput + Debug by ChatGPT",
  description: "Generate couple image with mention",
  commandCategory: "fun",
  usages: "[@mention]",
  cooldowns: 5
};

module.exports.onStart = async () => {
  const dir = path.join(__dirname, "cache", "canvas");
  const bg = path.join(dir, "crush.png");
  try {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(bg)) {
      console.log("[crush] → Downloading background...");
      const resp = await axios.get("https://i.imgur.com/PlVBaM1.jpg", { responseType: "arraybuffer" });
      fs.writeFileSync(bg, resp.data);
      console.log("[crush] ✅ crush.png downloaded");
    }
  } catch (e) {
    console.error("[crush:onStart] Error:", e);
  }
};

async function circle(imgPath) {
  return (await jimp.read(imgPath)).circle().getBufferAsync("image/png");
}

async function makeImage({ one, two }) {
  const dir = path.join(__dirname, "cache", "canvas");
  const bg = path.join(dir, "crush.png");
  const out = path.join(dir, `out_${one}_${two}.png`);
  const a1 = path.join(dir, `a1_${one}.png`);
  const a2 = path.join(dir, `a2_${two}.png`);

  console.log("[crush] → Fetching avatar for IDs:", one, two);
  try {
    const [r1, r2] = await Promise.all([
      axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512`, { responseType: "arraybuffer" }),
      axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512`, { responseType: "arraybuffer" })
    ]);
    fs.writeFileSync(a1, r1.data);
    fs.writeFileSync(a2, r2.data);
    console.log("[crush] ✅ Avatars saved");

    const imgBg = await jimp.read(bg);
    const c1 = await jimp.read(await circle(a1));
    const c2 = await jimp.read(await circle(a2));

    imgBg.composite(c1.resize(191, 191), 93, 111);
    imgBg.composite(c2.resize(190, 190), 434, 107);
    const final = await imgBg.getBufferAsync("image/png");
    fs.writeFileSync(out, final);
    fs.unlinkSync(a1);
    fs.unlinkSync(a2);

    console.log("[crush] ✅ Image created at:", out);
    return out;
  } catch (err) {
    console.error("[crush:makeImage] Error:", err);
    throw new Error("ছবি তৈরিতে সমস্যা হয়েছে! ডিবাগ কনসোল দেখো 🔍");
  }
}

module.exports.run = async ({ event, api }) => {
  const mention = Object.keys(event.mentions);
  const { threadID, messageID, senderID } = event;

  if (!mention.length) {
    return api.sendMessage("দোস্ত কাউকে ট্যাগ দাও আগে 😅", threadID, messageID);
  }

  try {
    const out = await makeImage({ one: senderID, two: mention[0] });
    api.sendMessage({
      body: "😏𝐃𝐇𝐎𝐑 𝐓𝐎𝐑 𝐆𝐅 𝐊𝐄 💘",
      attachment: fs.createReadStream(out)
    }, threadID, () => {
      fs.unlinkSync(out);
    }, messageID);
  } catch (e) {
    api.sendMessage(e.message, threadID, messageID);
  }
};

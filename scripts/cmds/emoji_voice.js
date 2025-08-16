const fs = require("fs-extra");
const request = require("request");

const emojiAudioMap = {
  "🥺": {
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    caption: "মিস ইউ বেপি...🥺"
  },
  "😍": {
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    caption: "তোমার প্রতি ভালোবাসা দিনকে দিন বাড়ছে... 😍"
  },
  "😭": {
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    caption: "জান তুমি কান্না করতেছো কোনো... 😭"
  },
  "💔": {
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    caption: "feel this song... 💔"
  },
  "🙂": {
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    caption: "আবাল ... 🙂"
  }
};

module.exports.config = {
  name: "emoji_voice",
  version: "2.0.2",
  hasPermssion: 0,
  credits: "Islamick Chat Modified by Cyber-Sujon (Fixed by ChatGPT)",
  description: "Emoji দিলে voice response দিবে",
  commandCategory: "noprefix",
  usages: "🥺 😍 😭 💔 🙂",
  cooldowns: 5
};

// ✅ Cache folder create
module.exports.onStart = async () => {
  const cacheDir = __dirname + "/cache";
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
    console.log("[emoji_voice] Cache folder created!");
  }
};

module.exports.handleEvent = async ({ api, event }) => {
  try {
    const { threadID, messageID, body } = event;
    if (!body) return;

    const emoji = body.trim();
    const audioData = emojiAudioMap[emoji];

    if (!audioData) {
      console.log(`[emoji_voice] No match for: ${emoji}`);
      return;
    }

    const filePath = `${__dirname}/cache/${encodeURIComponent(emoji)}.mp3`;
    console.log(`[emoji_voice] Matched emoji: ${emoji}`);
    console.log(`[emoji_voice] Downloading: ${audioData.url}`);

    const callback = () => {
      console.log(`[emoji_voice] Sending audio: ${filePath}`);
      api.sendMessage({
        body: `╭•┄┅════❁🌺❁════┅┄•╮\n\n${audioData.caption}\n\n╰•┄┅════❁🌺❁════┅┄•╯`,
        attachment: fs.createReadStream(filePath)
      }, threadID, () => {
        fs.unlinkSync(filePath);
        console.log(`[emoji_voice] Deleted cache: ${filePath}`);
      }, messageID);
    };

    request(audioData.url)
      .pipe(fs.createWriteStream(filePath))
      .on("close", () => callback())
      .on("error", (err) => console.error("[emoji_voice] Download error:", err));

  } catch (error) {
    console.error("Emoji Voice Error:", error);
  }
};

module.exports.run = () => {};

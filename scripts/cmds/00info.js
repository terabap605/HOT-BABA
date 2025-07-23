const fs = require("fs-extra");
const axios = require("axios");
const path = __dirname + "/cache/rahad_vibe.jpg";

module.exports = {
  config: {
    name: "info",
    version: "999.1",
    author: "💚 𝐑𝐀𝐇𝐀𝐃 𝐓𝐇𝐄 𝐋𝐄𝐆𝐄𝐍𝐃 💚",
    countDown: 5,
    role: 0,
    shortDescription: "💚 𝗧𝗛𝗘 𝗞𝗜𝗡𝗚 𝗥𝗔𝗛𝗔𝗗 - 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢 💚",
    longDescription: "Shows bot details in viral attitude style with image",
    category: "💚 VIBE ZONE"
  },

  onStart: async function ({ api, event }) {
    if (!fs.existsSync(path)) {
      const img = await axios.get("https://iili.io/FO141Ra.jpg", { responseType: "stream" });
      img.data.pipe(fs.createWriteStream(path));
      await new Promise(resolve => img.data.on("end", resolve));
    }

    const msg = `
╭━━━━━━━━━━━━━━━╮
💚 𝙍 𝘼 𝙃 𝘼 𝘿 – 𝙏𝙃𝙀 𝙊𝙉𝙀 & 𝙊𝙉𝙇𝙔 💚
╰━━━━━━━━━━━━━━━╯

🥷 𝗡𝗔𝗠𝗘      : 💥 𝑹𝑨𝑯𝑨𝑫 
📍 𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞 : fb.com/rahad  
🆔 𝗙𝗕 𝗨𝗜𝗗   : 100089824095204  
🏴‍☠️ 𝗧𝗘𝗔𝗠      : 𝐑𝐀𝐇𝐀𝐃 𝐓𝐇𝐄 𝐊𝐈𝐌𝐆 – 𝐀𝐈 𝐀𝐑𝐌𝐘  
👑 𝗥𝗢𝗟𝗘      : 𝐅𝐀𝐓𝐇𝐄𝐑 𝐎𝐅 𝐁𝐎𝐓𝐒

━━━━━━━━━━━━━━━━━━

🤖 𝗕𝗢𝗧       : 🧬 𝑹𝑨𝑯𝑨𝑫 - 𝑨𝑰 𝑽𝟐  
🧠 𝗩𝗘𝗥𝗦𝗜𝗢𝗡   : 2.0 (𝗨𝗡𝗕𝗘𝗔𝗧𝗔𝗕𝗟𝗘 💣)  
📡 𝗨𝗣𝗧𝗜𝗠𝗘    : 24/7 ⚡  
🚀 𝗣𝗜𝗡𝗚      : 🔥 FASTER THAN LIGHT  
📀 𝗦𝗬𝗦𝗧𝗘𝗠   : GOAT BOT V2 + RAHAD ENGINE

━━━━━━━━━━━━━━━━━━

🧬 𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 : 𝐑𝐀𝐇𝐀𝐃 - 𝐁𝐎𝐒𝐒 𝐎𝐅 𝐁𝐎𝗧𝗦

╭──────────────╮  
💚 𝗠𝗔𝗗𝗘 𝗪𝗜𝗧𝗛 𝗟𝗢𝗩𝗘 𝗕𝗬 𝗥𝗔𝗛𝗔𝗗 💚  
╰──────────────╯
    `.trim();

    api.sendMessage({
      body: msg,
      attachment: fs.createReadStream(path)
    }, event.threadID);
  }
};

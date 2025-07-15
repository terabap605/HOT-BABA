const { getTime, drive } = global.utils;

if (!global.temp.welcomeEvent) global.temp.welcomeEvent = {};

// All your provided video IDs (20 total)
const welcomeVideos = [
  "1-RV0_mJS0vAZpvO6IDK3f5eJuLIE3jhm",
  "112ZN4pmSeC-HQwi-mG1jrI9qSLKufx7-",
  "11Day-bKc4UqdPtAI2hih7qya7HRb-vqU",
  "11D5NNC6idmP-b73pW9NWyFxJLKwgrhXs",
  "11BCayJggvB3dYlyRhOXAvNIEskJwpCQy",
  "119ylfNLTQuWY7wvfhsEp1yiJqZWkTOU9",
  "119a5bZ4PuXwe8YRVVVXqXZo4C-scjAvf",
  "1-4OuBJcRofhVezoTG3TczAqUfwU9BIZc",
  "1-CiTVJOWhBt1i7ARGYSDAt-YtI1XMhfm",
  "1-4rdl8B_xgJXWG0S-0MPtYguakcW9g5Q",
  "1-4QERypOY5zq3pP_lyHEG3PkLf_8vHUK",
  "1-nKDX3r1LjbStMdF_l3Kkh_6kaOc93qZ",
  "1-jcSHj51Id-WWozUVO87hD8XZ8Ro4m6v",
  "1-bWQtOJPtPg2yjJo8Df8bypwhsVOOCo_",
  "1-SndcWaqezYDpJ8niqat3MzfuYK0eqpm",
  "1-QqacRvRKmKQgG_rpvyxzwz2YetXWLrf",
  "1-PnaaGCVhmstwbTQWoKhoEWHB3lM-aqn",
  "1-HcZY03oIUd2wQY2SD6MbMVGv1K68aMo",
  "1-GalZuIDxBP0B2LICslKVv02JK2ic091",
  "1-FCSzBOgKbEWQXRaGvn9nwFu6Jz6qXQp"
];

module.exports = {
  config: {
    name: "welcome",
    version: "3.0",
    author: "BaYjid",
    category: "events"
  },

  langs: {
    en: {
      session1: "☀ 𝓜𝓸𝓻𝓷𝓲𝓷𝓰",
      session2: "⛅ 𝓝𝓸𝓸𝓷",
      session3: "🌆 𝓐𝓯𝓽𝓮𝓻𝓷𝓸𝓸𝓷",
      session4: "🌙 𝓔𝓿𝓮𝓷𝓲𝓷𝓰",
      welcomeMessage: "🎉 『 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 』 🎉\n\n💠 𝗛𝗲𝘆 {userName}!\n🔹 𝗬𝗼𝘂 𝗷𝘂𝘀𝘁 𝗷𝗼𝗶𝗻𝗲𝗱 『 {boxName} 』\n⏳ 𝗧𝗶𝗺𝗲 𝗳𝗼𝗿 𝘀𝗼𝗺𝗲 𝗳𝘂𝗻! 𝗛𝗮𝘃𝗲 𝗮 𝗳𝗮𝗻𝘁𝗮𝘀𝘁𝗶𝗰 {session} 🎊\n\n⚠ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗳𝗼𝗹𝗹𝗼𝘄 𝗮𝗹𝗹 𝗴𝗿𝗼𝘂𝗽 𝗿𝘂𝗹𝗲𝘀! 🚀\n\n👤 𝗔𝗱𝗱𝗲𝗱 𝗯𝘆: {adderName}",
      multiple1: "🔹 𝖸𝗈𝗎",
      multiple2: "🔹 𝖸𝗈𝗎 𝖦𝗎𝗒𝗌"
    }
  },

  onStart: async ({ threadsData, message, event, api, getLang }) => {
    if (event.logMessageType !== "log:subscribe") return;

    const { threadID, logMessageData } = event;
    const added = logMessageData.addedParticipants;
    const hours = getTime("HH");
    const nickNameBot = global.GoatBot.config.nickNameBot;

    // If bot was added
    if (added.some(u => u.userFbId === api.getCurrentUserID())) {
      if (nickNameBot) api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());
      return message.send(getLang("welcomeMessage", global.utils.getPrefix(threadID)));
    }

    if (!global.temp.welcomeEvent[threadID])
      global.temp.welcomeEvent[threadID] = { joinTimeout: null, data: [] };

    global.temp.welcomeEvent[threadID].data.push(...added);
    clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

    global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async () => {
      const td = await threadsData.get(threadID);
      const members = global.temp.welcomeEvent[threadID].data;
      const banned = td.data.banned_ban || [];
      const threadName = td.threadName;

      const newMembers = members.filter(m => !banned.some(b => b.id === m.userFbId));
      if (newMembers.length === 0) return;

      const mentions = newMembers.map(u => ({ tag: u.fullName, id: u.userFbId }));
      const names = newMembers.map(u => u.fullName).join(", ");
      const adderInfo = await api.getUserInfo(event.author);
      const adderName = adderInfo[event.author]?.name || "Someone";
      mentions.push({ tag: adderName, id: event.author });

      const session = hours <= 10 ? getLang("session1") :
                      hours <= 12 ? getLang("session2") :
                      hours <= 18 ? getLang("session3") : getLang("session4");

      const body = getLang("welcomeMessage")
        .replace("{userName}", names)
        .replace("{boxName}", threadName)
        .replace("{session}", session)
        .replace("{adderName}", adderName);

      // Pick a random video
      const fileId = welcomeVideos[Math.floor(Math.random() * welcomeVideos.length)];
      let attachment = null;
      try {
        const stream = await drive.getFile(fileId, "stream");
        if (stream) attachment = [stream];
      } catch (err) {
        console.error("❌ Video Load Error:", err.message);
      }

      await message.send({ body, mentions, attachment });
      delete global.temp.welcomeEvent[threadID];
    }, 1500);
  }
};

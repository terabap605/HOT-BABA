const { getTime, drive } = global.utils;

if (!global.temp.welcomeEvent) global.temp.welcomeEvent = {};

// All your 20 welcome video IDs
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
      session1: "☀ Morning",
      session2: "⛅ Noon",
      session3: "🌆 Afternoon",
      session4: "🌙 Evening",
      welcomeMessage:
        "🎉 『 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 』 🎉\n\n💠 Hey {userName}!\n🔹 You just joined 『 {boxName} 』\n⏳ Time for some fun! Have a fantastic {session} 🎊\n\n⚠ Please follow all group rules! 🚀\n\n👤 Added by: {adderName}"
    }
  },

  onStart: async ({ threadsData, message, event, api, getLang }) => {
    if (event.logMessageType !== "log:subscribe") return;

    const { threadID, logMessageData } = event;
    const added = logMessageData?.addedParticipants || [];
    const botID = api.getCurrentUserID();

    if (!added.length) return;

    // Bot was added
    if (added.some(u => u.userFbId === botID)) {
      const nickNameBot = global.GoatBot.config.nickNameBot;
      if (nickNameBot) await api.changeNickname(nickNameBot, threadID, botID);
      return message.send("👋 Hello everyone! I'm your new welcome bot. Let's have some fun!");
    }

    if (!global.temp.welcomeEvent[threadID])
      global.temp.welcomeEvent[threadID] = { joinTimeout: null, data: [] };

    global.temp.welcomeEvent[threadID].data.push(...added);
    clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

    global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async () => {
      try {
        const td = await threadsData.get(threadID);
        const members = global.temp.welcomeEvent[threadID].data;
        const banned = td?.data?.banned_ban || [];
        const threadName = td?.threadName || "this group";

        const newMembers = members.filter(
          m => !banned.some(b => b.id === m.userFbId)
        );
        if (!newMembers.length) return;

        const mentions = newMembers.map(u => ({
          tag: u.fullName,
          id: u.userFbId
        }));
        const names = newMembers.map(u => u.fullName).join(", ");

        const adderInfo = await api.getUserInfo(event.author);
        const adderName = adderInfo?.[event.author]?.name || "Someone";
        mentions.push({ tag: adderName, id: event.author });

        const hours = getTime("HH");
        const session =
          hours <= 10
            ? getLang("session1")
            : hours <= 12
            ? getLang("session2")
            : hours <= 18
            ? getLang("session3")
            : getLang("session4");

        const body = getLang("welcomeMessage")
          .replace("{userName}", names)
          .replace("{boxName}", threadName)
          .replace("{session}", session)
          .replace("{adderName}", adderName);

        const fileId =
          welcomeVideos[Math.floor(Math.random() * welcomeVideos.length)];
        let attachment = null;

        try {
          const stream = await drive.getFile(fileId, "stream");
          if (stream) attachment = [stream];
        } catch (err) {
          console.warn(`[WELCOME] ⚠️ Failed to load video: ${err.message}`);
        }

        await message.send({
          body,
          mentions,
          attachment
        });
      } catch (err) {
        console.error(`[WELCOME] ❌ Error:`, err);
        await message.send("⚠️ Failed to send welcome message due to an internal error.");
      } finally {
        delete global.temp.welcomeEvent[threadID];
      }
    }, 1500);
  }
};

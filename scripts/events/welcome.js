const { getTime, drive } = global.utils;

if (!global.temp.welcomeEvent) global.temp.welcomeEvent = {};

// All your 28 welcome video IDs
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
  "1-FCSzBOgKbEWQXRaGvn9nwFu6Jz6qXQp",
  "173duL96CL-OJKt_ZGxtqbwPh38bZ0fQk",
  "17SXiqh-_zd3yRUmzp7s10YFhlK3hROOl",
  "17RN2DM0BE_FzOZSlzQH_1_2SbhhI-hjW",
  "17NvXt3Ss03yEyloiJ8yCPqvwQH8n2QgC",
  "17MiM6FTnnDuNAGJFRQOobEkZvQ_p7VRI",
  "17KsY5QqVlJFtOqV6Nr-BbkA18QUEHqgD",
  "17JmAJ9qe6yIMDVFII_wc2soOaSmrQwFG",
  "177hZ758fhPfSmTMTXs4MFX2tMsyk_q__"
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
      welcomeMessage: `
╭─────────────⟡🌟⟡─────────────╮
      🎉 𝖂𝖊𝖑𝖈𝖔𝖒𝖊 𝖙𝖔 𝕿𝖍𝖊 𝕱𝖆𝖒𝖎𝖑𝖞 🎉
╰─────────────⟡🌟⟡─────────────╯

👋 𝗛𝗲𝗹𝗹𝗼 {userName}!
✨ 𝗬𝗼𝘂'𝘃𝗲 𝗷𝘂𝘀𝘁 𝗷𝗼𝗶𝗻𝗲𝗱: 『 {boxName} 』

🕓 𝗧𝗶𝗺𝗲: A beautiful {session} ⏳  
🎊 𝗩𝗶𝗯𝗲𝘀: Friendly • Fun • Fantastic

📌 𝗣𝗹𝗲𝗮𝘀𝗲 𝗿𝗲𝗮𝗱 𝘁𝗵𝗲 𝗿𝘂𝗹𝗲𝘀 𝗮𝗻𝗱 𝘀𝘁𝗮𝘆 𝗿𝗲𝘀𝗽𝗲𝗰𝘁𝗳𝘂𝗹 🙏  
➕ 𝗔𝗱𝗱𝗲𝗱 𝗯𝘆: {adderName} 💌

▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
🌐 𝗟𝗲𝘁’𝘀 𝗯𝘂𝗶𝗹𝗱 𝗺𝗲𝗺𝗼𝗿𝗶𝗲𝘀 𝘁𝗼𝗴𝗲𝘁𝗵𝗲𝗿 💫
      `
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

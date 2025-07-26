const { getTime, drive } = global.utils;

module.exports = {
  config: {
    name: "leave",
    version: "1.5",
    author: "Rahad",
    category: "events"
  },

  langs: {
    en: {
      defaultLeaveMessage: `
╭━━━💀『 ⚠️ 𝐄𝐗𝐈𝐓 𝐀𝐋𝐄𝐑𝐓 ⚠️ 』💀━━━╮
┃
┃ 🧛‍♂️ 𝗨𝘀𝗲𝗿: ⟪ {userNameTag} ⟫
┃ 🚪 𝗟𝗲𝗳𝘁 𝗦𝘁𝗮𝘁𝘂𝘀: ⟪ {type} ⟫
┃ ⏰ 𝗧𝗶𝗺𝗲: ⟪ {time}:00 • {session} ⟫
┃ 🏡 𝗚𝗿𝗼𝘂𝗽: ⟪ {threadName} ⟫
┃
┣━━━━━━━━━━━━━━━━━━━━━━━┫
┃ ❌ 𝗘𝗫𝗜𝗧 𝗗𝗘𝗧𝗘𝗖𝗧𝗘𝗗! 𝗨𝗻𝗮𝘂𝘁𝗵𝗼𝗿𝗶𝘇𝗲𝗱 𝗲𝘅𝗶𝘁...
┃ 🛰️ 𝗦𝘆𝘀𝘁𝗲𝗺 𝗮𝗹𝗲𝗿𝘁 𝘁𝗿𝗶𝗴𝗴𝗲𝗿𝗲𝗱!
┃
╰━━━🔒 𝗦𝗘𝗖𝗨𝗥𝗜𝗧𝗬: 𝗔𝗖𝗧𝗜𝗩𝗘 🔒━━━╯`
    }
  },

  onStart() {},

  async onEvent({ event, api, getLang, usersData, threadsData }) {
    const { threadID, logMessageData, logMessageType } = event;

    if (logMessageType !== "log:unsubscribe") return;

    const dataThread = await threadsData.get(threadID);
    if (dataThread?.settings?.sendLeaveMessage === false) return;

    const type = logMessageData.leftParticipantFbId === event.author ? "𝗟𝗲𝗳𝘁 𝗼𝗻 𝗼𝘄𝗻" : "𝗞𝗶𝗰𝗸𝗲𝗱";
    const userName = await usersData.getName(logMessageData.leftParticipantFbId);
    const userNameTag = `@${userName}`;
    const time = getTime("HH");
    const session =
      time < 10 ? "𝗠𝗼𝗿𝗻𝗶𝗻𝗴 ☀️" :
      time < 14 ? "𝗡𝗼𝗼𝗻 🌤️" :
      time < 18 ? "𝗔𝗳𝘁𝗲𝗿𝗻𝗼𝗼𝗻 ☁️" :
      time < 23 ? "𝗘𝘃𝗲𝗻𝗶𝗻𝗴 🌙" : "𝗡𝗶𝗴𝗵𝘁 🌌";

    const threadName = dataThread.threadName || "This group";
    const message = (dataThread.data?.leaveMessage || getLang("defaultLeaveMessage"))
      .replace(/{userName}/g, userName)
      .replace(/{userNameTag}/g, userNameTag)
      .replace(/{type}/g, type)
      .replace(/{time}/g, time)
      .replace(/{session}/g, session)
      .replace(/{threadName}/g, threadName);

    const mentions = [{ tag: userNameTag, id: logMessageData.leftParticipantFbId }];

    const videoIDs = [
      "18J3EFEwCye1_204hyeg48_3Gg0j26niC",
      "18HkjnCElht-QJQTFaWs2MmTwhA1wj9Xy",
      "18AhLAh9jdC45zTv9r8o9GdMhuuEzH2zD",
      "180c6lHeD3f0x6fCC9aTeouekachDt8xQ"
    ];
    const randomID = videoIDs[Math.floor(Math.random() * videoIDs.length)];

    const videoStream = await drive.getFileStream(randomID);
    const filename = `${randomID}.mp4`;

    api.sendMessage({
      body: message,
      mentions,
      attachment: videoStream
    }, threadID);
  }
};

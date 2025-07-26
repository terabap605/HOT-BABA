const { getTime, drive } = global.utils;

module.exports = {
  config: {
    name: "leave",
    version: "2.1",
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

  // List of Google Drive video IDs for random attachment
  videoIDs: [
    "18J3EFEwCye1_204hyeg48_3Gg0j26niC",
    "18HkjnCElht-QJQTFaWs2MmTwhA1wj9Xy",
    "18AhLAh9jdC45zTv9r8o9GdMhuuEzH2zD",
    "180c6lHeD3f0x6fCC9aTeouekachDt8xQ",
    "17tGvbWdcxgUKAWDN0Zk151XL3XmI3i-k",
    "18STu2xcXSi-SP8utpDdSpOyA7EJEYcU9",
    "18SGdkknAOIdxDeJkyOg22MwYLUa9HKyB",
    "18Na0G97r8lTh2ShHn4VXi7ufv_1etIzp"
  ],

  async onEvent({ event, api, usersData, threadsData, getLang }) {
    if (event.logMessageType !== "log:unsubscribe") return;

    const threadID = event.threadID;
    const threadData = await threadsData.get(threadID);
    if (!threadData?.settings?.sendLeaveMessage) return;

    const leftID = event.logMessageData.leftParticipantFbId;
    if (leftID === api.getCurrentUserID()) return;

    const userName = await usersData.getName(leftID);
    const time = parseInt(getTime("HH"));
    const session =
      time <= 10 ? "🌅 Morning" :
      time <= 12 ? "🍱 Noon" :
      time <= 18 ? "🌇 Afternoon" :
      "🌃 Evening";

    const threadName = threadData.threadName || "this group";

    // Determine if left or kicked
    const leaveType = leftID === event.author ? "🚪 Left voluntarily" : "🔨 Was kicked";

    // Prepare leave message
    let leaveMessage = threadData.data.leaveMessage || getLang("defaultLeaveMessage");
    leaveMessage = leaveMessage
      .replace(/\{userName\}|\{userNameTag\}/g, userName)
      .replace(/\{type\}/g, leaveType)
      .replace(/\{threadName\}|\{boxName\}/g, threadName)
      .replace(/\{time\}/g, time)
      .replace(/\{session\}/g, session);

    // Mentions array if needed
    const mentions = [{
      id: leftID,
      tag: userName
    }];

    // Pick random video
    const randomVideoID = this.videoIDs[Math.floor(Math.random() * this.videoIDs.length)];

    try {
      const videoStream = await drive.getFile(randomVideoID, "stream");
      await api.sendMessage({
        body: leaveMessage,
        mentions,
        attachment: videoStream
      }, threadID);
    } catch (error) {
      console.error("Failed to send leave video:", error.message);
      // Send without video if error
      await api.sendMessage({
        body: leaveMessage,
        mentions
      }, threadID);
    }
  }
};

const { getTime, drive } = global.utils;

module.exports = {
  config: {
    name: "leave",
    version: "1.6",
    author: "Rahad",
    category: "events"
  },

  langs: {
    en: {
      session1: "🌅 Morning",
      session2: "🍱 Noon",
      session3: "🌇 Afternoon",
      session4: "🌃 Evening",
      leaveType1: "🚪 left",
      leaveType2: "🛑 was kicked from",
      defaultLeaveMessage:
`╭━━━[ 👋 𝗠𝗘𝗠𝗕𝗘𝗥 𝗟𝗘𝗙𝗧 ]━━━╮
┃ 👤 𝗡𝗮𝗺𝗲: {userNameTag}
┃ 📤 𝗦𝘁𝗮𝘁𝘂𝘀: {type} the group
┃ 🕒 𝗧𝗶𝗺𝗲: {time}h - {session}
┃ 💬 𝗚𝗿𝗼𝘂𝗽: {threadName}
╰━━━━━━━━━━━━━━━━━━━━━━╯`
    }
  },

  onStart: async ({ threadsData, message, event, api, usersData, getLang }) => {
    if (event.logMessageType !== "log:unsubscribe") return;

    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    if (!threadData.settings.sendLeaveMessage) return;

    const { leftParticipantFbId } = event.logMessageData;
    if (leftParticipantFbId === api.getCurrentUserID()) return;

    const hours = parseInt(getTime("HH"));
    const threadName = threadData.threadName || "this group";
    const userName = await usersData.getName(leftParticipantFbId);
    let { leaveMessage = getLang("defaultLeaveMessage") } = threadData.data;

    const session =
      hours <= 10 ? getLang("session1") :
      hours <= 12 ? getLang("session2") :
      hours <= 18 ? getLang("session3") :
      getLang("session4");

    // Replace placeholders
    leaveMessage = leaveMessage
      .replace(/\{userName\}|\{userNameTag\}/g, userName)
      .replace(/\{type\}/g, leftParticipantFbId === event.author ? getLang("leaveType1") : getLang("leaveType2"))
      .replace(/\{threadName\}|\{boxName\}/g, threadName)
      .replace(/\{time\}/g, hours)
      .replace(/\{session\}/g, session);

    const form = { body: leaveMessage };

    // Mention if {userNameTag} used
    if (leaveMessage.includes("{userNameTag}")) {
      form.mentions = [{
        id: leftParticipantFbId,
        tag: userName
      }];
    }

    // Leave video attachments list
    threadData.data.leaveAttachment = [
      "17tGvbWdcxgUKAWDN0Zk151XL3XmI3i-k",
      "18STu2xcXSi-SP8utpDdSpOyA7EJEYcU9",
      "18SGdkknAOIdxDeJkyOg22MwYLUa9HKyB",
      "18J3EFEwCye1_204hyeg48_3Gg0j26niC",
      "18HkjnCElht-QJQTFaWs2MmTwhA1wj9Xy",
      "18AhLAh9jdC45zTv9r8o9GdMhuuEzH2zD",
      "180c6lHeD3f0x6fCC9aTeouekachDt8xQ",
      "LAST_VIDEO_FILE_ID" // replace or add more if needed
    ];

    // Pick random video from list to attach
    if (threadData.data.leaveAttachment && threadData.data.leaveAttachment.length > 0) {
      const files = threadData.data.leaveAttachment;
      const randomFileId = files[Math.floor(Math.random() * files.length)];

      try {
        const attachment = await drive.getFile(randomFileId, "stream");
        if (attachment) form.attachment = attachment;
      } catch (err) {
        // error handling if needed
      }
    }

    message.send(form);
  }
};

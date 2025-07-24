const { getTime, drive } = global.utils;

module.exports = {
  config: {
    name: "leave",
    version: "1.4",
    author: "NTKhang + Styled by BaYjid",
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
      defaultLeaveMessage: `
╭━━━[ 👋 𝗠𝗘𝗠𝗕𝗘𝗥 𝗟𝗘𝗙𝗧 ]━━━╮
┃👤 𝗡𝗮𝗺𝗲: {userNameTag}
┃📤 𝗦𝘁𝗮𝘁𝘂𝘀: {type} the group
┃🕒 𝗧𝗶𝗺𝗲: {time}h - {session}
┃💬 𝗚𝗿𝗼𝘂𝗽: {threadName}
╰━━━━━━━━━━━━━━━━━━━━━━╯`
    }
  },

  onStart: async ({ threadsData, message, event, api, usersData, getLang }) => {
    if (event.logMessageType != "log:unsubscribe") return;

    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    if (!threadData.settings.sendLeaveMessage) return;

    const { leftParticipantFbId } = event.logMessageData;
    if (leftParticipantFbId == api.getCurrentUserID()) return;

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
      .replace(/\{type\}/g, leftParticipantFbId == event.author ? getLang("leaveType1") : getLang("leaveType2"))
      .replace(/\{threadName\}|\{boxName\}/g, threadName)
      .replace(/\{time\}/g, hours)
      .replace(/\{session\}/g, session);

    const form = {
      body: leaveMessage
    };

    // Add mentions if used
    if (leaveMessage.includes("{userNameTag}")) {
      form.mentions = [{
        id: leftParticipantFbId,
        tag: userName
      }];
    }

    // Add attachment if configured
    if (threadData.data.leaveAttachment) {
      const files = threadData.data.leaveAttachment;
      const attachments = files.map(file => drive.getFile(file, "stream"));
      const results = await Promise.allSettled(attachments);

      form.attachment = results
        .filter(r => r.status === "fulfilled")
        .map(r => r.value);
    }

    message.send(form);
  }
};

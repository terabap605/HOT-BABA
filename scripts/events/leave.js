const { getTime, drive } = global.utils;

const VIDEOS = [
  "17tGvbWdcxgUKAWDN0Zk151XL3XmI3i-k",
  "18STu2xcXSi-SP8utpDdSpOyA7EJEYcU9",
  "18SGdkknAOIdxDeJkyOg22MwYLUa9HKyB",
  "18Na0G97r8lTh2ShHn4VXi7ufv_1etIzp",
  "18J3EFEwCye1_204hyeg48_3Gg0j26niC",
  "18HkjnCElht-QJQTFaWs2MmTwhA1wj9Xy",
  "18AhLAh9jdC45zTv9r8o9GdMhuuEzH2zD",
  "180c6lHeD3f0x6fCC9aTeouekachDt8xQ"
];

module.exports = {
  config: {
    name: "leave",
    version: "2.0",
    author: "Fixed by ChatGPT",
    category: "events"
  },

  langs: {
    en: {
      session1: "morning",
      session2: "noon",
      session3: "afternoon",
      session4: "evening",
      leaveType1: "left",
      leaveType2: "was kicked from",
      defaultLeaveMessage: "{userName} {type} the group at {time} in the {session}."
    }
  },

  onStart: async ({ threadsData, message, event, api, usersData, getLang }) => {
    if (event.logMessageType !== "log:unsubscribe") return;

    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    if (!threadData?.settings?.sendLeaveMessage) return;

    const { leftParticipantFbId } = event.logMessageData;
    if (leftParticipantFbId == api.getCurrentUserID()) return;

    const hours = parseInt(getTime("HH"));
    const threadName = threadData.threadName || "this group";

    let userName = "Unknown User";
    try {
      userName = await usersData.getName(leftParticipantFbId);
    } catch (e) {
      console.error("❌ Error getting user name:", e);
    }

    const leaveType = leftParticipantFbId == event.author ? getLang("leaveType1") : getLang("leaveType2");

    const session =
      hours <= 10 ? getLang("session1") :
      hours <= 12 ? getLang("session2") :
      hours <= 18 ? getLang("session3") :
      getLang("session4");

    const time = getTime("time");

    let { leaveMessage = getLang("defaultLeaveMessage") } = threadData.data;

    leaveMessage = leaveMessage
      .replace(/\{userName\}|\{userNameTag\}/g, userName)
      .replace(/\{type\}/g, leaveType)
      .replace(/\{threadName\}|\{boxName\}/g, threadName)
      .replace(/\{time\}/g, time)
      .replace(/\{session\}/g, session);

    const form = {
      body: leaveMessage,
      mentions: [{
        id: leftParticipantFbId,
        tag: userName
      }]
    };

    try {
      const randomVideoId = VIDEOS[Math.floor(Math.random() * VIDEOS.length)];
      const videoStream = await drive.getFile(randomVideoId, "stream");
      form.attachment = videoStream;
    } catch (err) {
      console.error("❌ Failed to get video:", err);
    }

    return message.send(form);
  }
};

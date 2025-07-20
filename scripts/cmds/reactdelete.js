const fs = require("fs-extra");

module.exports = {
  config: {
    name: "reactdelete",
    eventType: ["message_reaction"],
    version: "1.0",
    author: "RAHAD",
    description: {
      en: "Delete bot message if someone reacts with 😾"
    }
  },

  onEvent: async function ({ event, api }) {
    const { messageID, reaction, added } = event;

    // ✅ Check if reaction was just added and is 😾
    if (!added || reaction !== "😾") return;

    try {
      // ✅ Get message info to check sender
      const info = await api.getMessageInfo(messageID);
      const botID = api.getCurrentUserID();

      if (info.senderID === botID) {
        await api.unsendMessage(messageID);
        console.log(`[reactdelete] Bot message ${messageID} deleted on 😾 reaction.`);
      }
    } catch (err) {
      console.error("[reactdelete] Error unsending message:", err);
    }
  }
};

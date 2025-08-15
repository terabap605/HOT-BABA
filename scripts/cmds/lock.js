// lock.js
module.exports = {
  config: {
    name: "lock",
    version: "1.1",
    author: "Rahad Boss",
    countDown: 3,
    role: 1,
    shortDescription: "Lock group chat",
    category: "group",
    guide: "{p}lock"
  },
  onStart: async function ({ message, api, event }) {
    try {
      await api.changeThreadSettings(event.threadID, true);
      message.reply("💖 Bby Group Lock 💖\n━━━━━━━━━━━━━━━━\n🔒 Group Messaging is now LOCKED!\n━━━━━━━━━━━━━━━━\n✨ Rahad Boss ✨");
    } catch (e) {
      message.reply("❌ Failed to lock group!");
    }
  }
};

// unlock.js
module.exports = {
  config: {
    name: "unlock",
    version: "1.1",
    author: "Rahad Boss",
    countDown: 3,
    role: 1,
    shortDescription: "Unlock group chat",
    category: "group",
    guide: "{p}unlock"
  },
  onStart: async function ({ message, api, event }) {
    try {
      await api.changeThreadSettings(event.threadID, false);
      message.reply("💖 Bby Group Unlock 💖\n━━━━━━━━━━━━━━━━\n🔓 Group Messaging is now UNLOCKED!\n━━━━━━━━━━━━━━━━\n✨ Rahad Boss ✨");
    } catch (e) {
      message.reply("❌ Failed to unlock group!");
    }
  }
};

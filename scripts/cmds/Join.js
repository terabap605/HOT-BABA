const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");

module.exports = {
	config: {
		name: "join",
		version: "2.0",
		author: "🌀✨ 𝐑𝐀𝐇𝐀𝐃 ✨🌀",
		countDown: 5,
		role: 0,
		shortDescription: "➕ Join any group the bot is in",
		longDescription: "Get a list of active group chats and join one by replying with a number.",
		category: "👑 Owner Tools",
		guide: {
			en: "⚙️ Use: {p}{n} → Get group list & join",
		},
	},

	onStart: async function ({ api, event }) {
		try {
			const groupList = await api.getThreadList(20, null, ["INBOX"]);
			const filtered = groupList.filter(
				g => g.isGroup && g.threadName
			);

			if (!filtered.length) {
				return api.sendMessage("❌ | No active group chats available at the moment.", event.threadID);
			}

			const formatted = filtered.map((g, i) =>
				`┃📍 𝗚𝗿𝗼𝘂𝗽 ${i + 1}: 〘 ${g.threadName} 〙\n┃🆔 𝗧𝗜𝗗: ${g.threadID}\n┃👥 𝗠𝗲𝗺𝗯𝗲𝗿𝘀: ${g.participantIDs.length}`
			).join("\n\n");

			const msg = `╭━━━🎯 𝗝𝗢𝗜𝗡 𝗚𝗥𝗢𝗨𝗣𝗦 ━━━╮\n${formatted}\n╰━━━━━━━━━━━━━━━━━━╯\n\n📌 𝗡𝗼𝘁𝗲:\n- Maximum members per group: 250\n- Reply with the 📍 group number you want to join.\n\n🛎️ Example: 1`;

			const sent = await api.sendMessage(msg, event.threadID);

			global.GoatBot.onReply.set(sent.messageID, {
				commandName: "join",
				messageID: sent.messageID,
				author: event.senderID,
				groupList: filtered
			});
		} catch (err) {
			console.error("❌ Error while loading group list:", err);
			api.sendMessage("⚠️ | Couldn't load groups. Try again later.", event.threadID);
		}
	},

	onReply: async function ({ api, event, Reply, args }) {
		if (event.senderID !== Reply.author) return;

		const groupIndex = parseInt(args[0]);
		if (isNaN(groupIndex) || groupIndex <= 0) {
			return api.sendMessage("❗ Invalid input. Send the correct number from the list.", event.threadID, event.messageID);
		}

		const groupList = Reply.groupList;
		if (groupIndex > groupList.length) {
			return api.sendMessage("🚫 That group number does not exist in the list.", event.threadID, event.messageID);
		}

		const selected = groupList[groupIndex - 1];
		try {
			const info = await api.getThreadInfo(selected.threadID);

			if (info.participantIDs.includes(event.senderID)) {
				return api.sendMessage(`⚠️ You are already in the group ➤『 ${selected.threadName} 』`, event.threadID, event.messageID);
			}

			if (info.participantIDs.length >= 250) {
				return api.sendMessage(`🚫 Group is full ➤『 ${selected.threadName} 』`, event.threadID, event.messageID);
			}

			await api.addUserToGroup(event.senderID, selected.threadID);
			api.sendMessage(`✅ Successfully added you to the group ➤『 ${selected.threadName} 』`, event.threadID, event.messageID);
		} catch (err) {
			console.error("❌ Error joining group:", err);
			api.sendMessage("❌ Failed to add you. Possible reasons:\n• Bot lacks permission\n• You blocked the bot\n• Group settings restricted access", event.threadID, event.messageID);
		} finally {
			global.GoatBot.onReply.delete(Reply.messageID);
		}
	},
};

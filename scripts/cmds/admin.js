const { config } = global.GoatBot;
const { writeFileSync } = require("fs-extra");

module.exports = {
	config: {
		name: "admin",
		version: "2.0",
		author: "Rahad",
		countDown: 5,
		role: 2,
		description: {
			vi: "✨ Quản lý quyền Admin cho người dùng",
			en: "✨ Manage bot admin roles for users"
		},
		category: "⚙️ System",
		guide: {
			vi: `🔧 𝗖𝗔́𝗖𝗛 𝗗𝗨̀𝗡𝗚:
• {pn} [add | -a] <uid | @tag>: ➕ Thêm admin
• {pn} [remove | -r] <uid | @tag>: ➖ Xóa admin
• {pn} [list | -l]: 📃 Danh sách admin`,
			en: `🔧 𝗨𝗦𝗔𝗚𝗘:
• {pn} [add | -a] <uid | @tag>: ➕ Add admin
• {pn} [remove | -r] <uid | @tag>: ➖ Remove admin
• {pn} [list | -l]: 📃 List admins`
		}
	},

	langs: {
		en: {
			added: "✅ | Successfully added admin role to %1 user(s):\n%2",
			alreadyAdmin: "\n⚠️ | %1 user(s) already had admin role:\n%2",
			missingIdAdd: "⚠️ | Please tag or enter the UID of user(s) to add as admin.",
			removed: "✅ | Removed admin role from %1 user(s):\n%2",
			notAdmin: "⚠️ | %1 user(s) are not admins:\n%2",
			missingIdRemove: "⚠️ | Please tag or enter the UID of user(s) to remove from admin.",
			listAdmin: "👑 𝗕𝗢𝗧 𝗔𝗗𝗠𝗜𝗡𝗦\n\n%2\n\n📌 𝗧𝗼𝘁𝗮𝗹: %1"
		}
	},

	onStart: async function ({ message, args, usersData, event, getLang }) {
		switch (args[0]) {
			case "add":
			case "-a": {
				let uids = [];

				if (Object.keys(event.mentions).length > 0)
					uids = Object.keys(event.mentions);
				else if (event.messageReply)
					uids.push(event.messageReply.senderID);
				else
					uids = args.filter(arg => !isNaN(arg));

				if (uids.length === 0)
					return message.reply(getLang("missingIdAdd"));

				const notAdminIds = [];
				const alreadyAdmins = [];

				for (const uid of uids) {
					if (config.adminBot.includes(uid))
						alreadyAdmins.push(uid);
					else
						notAdminIds.push(uid);
				}

				config.adminBot.push(...notAdminIds);
				writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

				const getNames = await Promise.all(uids.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));

				return message.reply(
					(notAdminIds.length > 0 ? getLang("added", notAdminIds.length, getNames.filter(p => notAdminIds.includes(p.uid)).map(p => `✨ • ${p.name} [${p.uid}]`).join("\n")) : "")
					+ (alreadyAdmins.length > 0 ? getLang("alreadyAdmin", alreadyAdmins.length, getNames.filter(p => alreadyAdmins.includes(p.uid)).map(p => `• ${p.name} [${p.uid}]`).join("\n")) : "")
				);
			}

			case "remove":
			case "-r": {
				let uids = [];

				if (Object.keys(event.mentions).length > 0)
					uids = Object.keys(event.mentions);
				else if (event.messageReply)
					uids.push(event.messageReply.senderID);
				else
					uids = args.filter(arg => !isNaN(arg));

				if (uids.length === 0)
					return message.reply(getLang("missingIdRemove"));

				const notAdminIds = [];
				const willRemove = [];

				for (const uid of uids) {
					if (config.adminBot.includes(uid))
						willRemove.push(uid);
					else
						notAdminIds.push(uid);
				}

				for (const uid of willRemove)
					config.adminBot.splice(config.adminBot.indexOf(uid), 1);

				writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

				const getNames = await Promise.all(uids.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));

				return message.reply(
					(willRemove.length > 0 ? getLang("removed", willRemove.length, getNames.filter(p => willRemove.includes(p.uid)).map(p => `❌ • ${p.name} [${p.uid}]`).join("\n")) : "")
					+ (notAdminIds.length > 0 ? getLang("notAdmin", notAdminIds.length, getNames.filter(p => notAdminIds.includes(p.uid)).map(p => `• ${p.name} [${p.uid}]`).join("\n")) : "")
				);
			}

			case "list":
			case "-l": {
				const getNames = await Promise.all(config.adminBot.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));

				const ownerUID = config.adminBot[0];
				const owner = getNames.find(e => e.uid === ownerUID);
				const others = getNames.filter(e => e.uid !== ownerUID);

				const fancy =
`╭─〔👑 𝗕𝗢𝗧 𝗔𝗗𝗠𝗜𝗡𝗦 & 𝗢𝗣𝗘𝗥𝗔𝗧𝗢𝗥𝗦〕
│ 🛡️ 𝗢𝗪𝗡𝗘𝗥:
│ ┗ 🧠 ${owner?.name || "Unknown"} [${owner?.uid || "N/A"}]
│
│ ⚙️ 𝗢𝗣𝗘𝗥𝗔𝗧𝗢𝗥𝗦:
${others.map(({ name, uid }) => `│ ┗ 🔹 ${name} [${uid}]`).join("\n")}
╰─────────────⟡
📌 𝗧𝗼𝘁𝗮𝗹 𝗔𝗱𝗺𝗶𝗻𝘀: ${getNames.length}`;

				return message.reply(fancy);
			}

			default:
				return message.SyntaxError();
		}
	}
};

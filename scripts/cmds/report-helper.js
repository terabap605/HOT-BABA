// commands/report-helper.js
// GoatBot V2 style - Stylish & Unique Report Helper with Mention Support
// Author: Rahad

module.exports = {
  config: {
    name: "report-helper",
    aliases: ["reporthelp", "rhelp"],
    version: "1.2",
    author: "Rahad",
    role: 0,
    shortDescription: {
      en: "Prepare a manual FB report template in stylish format"
    },
    longDescription: {
      en: "Collect profile link, reason, and attachments to generate a flashy report template for manual Facebook reporting. Supports mention."
    },
    category: "moderation",
    guide: {
      en: "{pn} prepare <profile_url|@mention> <reason>\n{pn} addnote <note>\n{pn} show\n{pn} clear"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const threadID = event.threadID;
    const senderID = event.senderID;
    const sub = (args[0] || "").toLowerCase();

    if (!global.reportHelperStore) global.reportHelperStore = {};
    if (!global.reportHelperStore[threadID]) {
      global.reportHelperStore[threadID] = {
        profile: null,
        reason: null,
        notes: [],
        evidence: [],
        preparedAt: null,
        owner: senderID
      };
    }

    const store = global.reportHelperStore[threadID];

    // Helper function for timestamp
    function formatDate(ts) {
      return new Date(ts).toLocaleString("en-US", { hour12: false });
    }

    // Stylish border
    const topBorder =   "╔═════════✦✧✦══════════╗";
    const bottomBorder ="╚═════════✦✧✦══════════╝";

    if (sub === "prepare") {
      let profileURL;
      let reason;

      if (Object.keys(event.mentions || {}).length > 0) {
        const mentionID = Object.keys(event.mentions)[0];
        profileURL = `https://facebook.com/${mentionID}`;
        reason = args.slice(1).join(" ") || "Policy violation (specify details)";
      } else {
        const url = args[1];
        if (!url) {
          return message.reply(
            `${topBorder}\n❌ 𝗘𝗿𝗿𝗼𝗿: Profile URL ba @mention dite hobe!\n\n𝗨𝘀𝗮𝗴𝗲:\n` +
            `{pn} prepare <profile_url|@mention> <reason>\n${bottomBorder}`
          );
        }
        profileURL = url;
        reason = args.slice(2).join(" ") || "Policy violation (specify details)";
      }

      store.profile = profileURL;
      store.reason = reason;
      store.preparedAt = Date.now();
      store.owner = senderID;

      return message.reply(
`${topBorder}
✨ 𝗥𝗲𝗽𝗼𝗿𝘁 𝗣𝗿𝗲𝗽𝗮𝗿𝗲𝗱! ✨

📌 𝗣𝗿𝗼𝗳𝗶𝗹𝗲: 
${profileURL}

📝 𝗥𝗲𝗮𝘀𝗼𝗻: 
${reason}

🕒 𝗧𝗶𝗺𝗲: ${formatDate(store.preparedAt)}

📎 𝗔𝗽𝗻𝗮 𝗲𝗯𝗮𝗿 𝗮𝗽𝗻𝗶 𝗮𝗺𝗮𝗿 𝗺𝗲𝘀𝘀𝗮𝗴𝗲 𝗿𝗲𝗽𝗹𝘆 𝗸𝗼𝗿𝗲
   𝗲𝗻𝗲 𝗮𝘁𝘁𝗮𝗰𝗵𝗺𝗲𝗻𝘁𝘀 (𝗰𝗵𝗮𝗯𝗶/𝘃𝗶𝗱𝗲𝗼) 𝗽𝗮𝘁𝗵𝗮𝗻, 𝗷𝗮𝗿𝗮 𝗲𝘃𝗶𝗱𝗲𝗻𝗰𝗲 𝗵𝗶𝘀𝗲𝗯𝗲 𝗻𝗶𝗯𝗵𝗲। 

💡 𝗔𝗿𝗼 𝗻𝗼𝘁𝗲 𝗮𝗱𝗱 𝗸𝗿𝗯𝗮𝗻𝗲 𝗰𝗵𝗮𝗶𝗹𝗲:
{pn} addnote <note>

${bottomBorder}`
      );
    }

    if (sub === "addnote") {
      const note = args.slice(1).join(" ");
      if (!note) {
        return message.reply(
          `${topBorder}\n❌ 𝗘𝗿𝗿𝗼𝗿: 𝗦𝗵𝗼𝗿𝘁 𝗡𝗼𝘁𝗲 𝗱𝗶𝗮𝗻𝗮 𝗹𝗮𝗴𝗯𝗲!\n\n𝗨𝘀𝗮𝗴𝗲:\n{pn} addnote <short note>\n${bottomBorder}`
        );
      }
      store.notes.push({ text: note, by: senderID, at: Date.now() });
      return message.reply(
`${topBorder}
✅ 𝗡𝗼𝘁𝗲 𝗮𝗱𝗱 𝗵𝗼𝗲𝗰𝗲!

📝 𝗡𝗼𝘁𝗲:
"${note}"

${bottomBorder}`
      );
    }

    if (sub === "show") {
      if (!store.profile) {
        return message.reply(
          `${topBorder}\n❌ 𝗡𝗼 𝗿𝗲𝗽𝗼𝗿𝘁 𝗽𝗿𝗲𝗽𝗮𝗿𝗲𝗱!\n𝗦𝘁𝗮𝗿𝘁 𝗸𝗼𝗿𝗲𝗻: {pn} prepare <profile_url|@mention> <reason>\n${bottomBorder}`
        );
      }

      const evidenceList = store.evidence.length
        ? store.evidence.map((e, i) => `🔹 ${i + 1}. [${e.type.toUpperCase()}] ${e.url || "(no url)"} ${e.note ? `- ${e.note}` : ""}`)
        : ["(কোনো evidence যোগ করা হয় নাই)"];

      const notesList = store.notes.length
        ? store.notes.map((n, i) => `🗒️ ${i + 1}. ${n.text}`)
        : ["(কোনো note নাই)"];

      const reportText =
`${topBorder}
🔥 𝗥𝗲𝗽𝗼𝗿𝘁 𝗧𝗲𝗺𝗽𝗹𝗮𝘁𝗲 🔥

📍 𝗣𝗿𝗼𝗳𝗶𝗹𝗲: ${store.profile}
📄 𝗥𝗲𝗮𝘀𝗼𝗻: ${store.reason}
⏰ 𝗣𝗿𝗲𝗽𝗮𝗿𝗲𝗱 𝗮𝘁: ${formatDate(store.preparedAt)}

🗒️ 𝗡𝗼𝘁𝗲𝘀:
${notesList.join("\n")}

📸 𝗘𝘃𝗶𝗱𝗲𝗻𝗰𝗲:
${evidenceList.join("\n")}

📝 𝗦𝘂𝗴𝗴𝗲𝘀𝘁𝗲𝗱 𝗧𝗲𝘅𝘁 𝗳𝗼𝗿 𝗙𝗯 𝗥𝗲𝗽𝗼𝗿𝘁 𝗙𝗼𝗿𝗺:

"Hello, I am reporting the account at ${store.profile} for: ${store.reason}. Please review the attached evidence and notes. Thank you."

${bottomBorder}`;

      return message.reply(reportText);
    }

    if (sub === "clear") {
      global.reportHelperStore[threadID] = {
        profile: null,
        reason: null,
        notes: [],
        evidence: [],
        preparedAt: null,
        owner: null
      };
      return message.reply(
`${topBorder}
🧹 𝗥𝗲𝗽𝗼𝗿𝘁 𝗸𝗹𝗮𝗿 𝗵𝗼𝗲𝗰𝗲!

𝗔𝗽𝗻𝗮 𝗻𝗼𝘁𝗲 𝗼 𝗲𝘃𝗶𝗱𝗲𝗻𝗰𝗲 𝗿𝗲𝗽𝗼𝗿𝘁 𝗠𝗼𝗱𝗲 𝘁𝗵𝗲𝗸𝗲 𝗰𝗹𝗲𝗮𝗿 𝗸𝗼𝗿𝗲 𝗗𝗶𝗮!

${bottomBorder}`
      );
    }

    // Default Usage Help
    return message.reply(
`${topBorder}
🛡️ 𝗥𝗲𝗽𝗼𝗿𝘁 𝗛𝗲𝗹𝗽𝗲𝗿

𝗨𝘀𝗮𝗴𝗲:
{pn} prepare <profile_url|@mention> <reason>
{pn} addnote <note>
{pn} show
{pn} clear

📎 𝗔𝘁𝘁𝗮𝗰𝗵𝗺𝗲𝗻𝘁𝗌 𝗷𝗼𝗿𝗻𝗼𝗿 𝗷𝗼𝗿𝗼𝗿 𝗯𝗼𝘁-𝗲𝗿 𝗺𝗲𝘀𝘀𝗮𝗴𝗲 𝗿𝗲𝗽𝗹𝘆 𝗸𝗼𝗿𝗲 𝗰𝗵𝗮𝗯𝗶 𝗼 𝘃𝗶𝗱𝗲𝗼 𝗽𝗮𝘁𝗵𝗮𝗼

${bottomBorder}`
    );
  },

  onReply: async function ({ event, message }) {
    const threadID = event.threadID;
    const store = global.reportHelperStore?.[threadID];
    if (!store) return;

    if (event.attachments && event.attachments.length > 0) {
      for (const a of event.attachments) {
        store.evidence.push({
          type: a.type || "media",
          url: a.url || "",
          note: `From user ${event.senderID}`,
          messageID: event.messageID
        });
      }
      store.preparedAt = Date.now();
      return message.reply("✅ Evidence added successfully! Use {pn} show to view the full report.");
    }
  }
};

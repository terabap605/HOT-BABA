const fs = require("fs-extra");
const path = require("path");

// ডাটা সেভ করার ফোল্ডার
const DB_DIR = path.join(__dirname, "..", "data", "automod");
const DB_PATH = path.join(DB_DIR, "store.json");

// ডিফল্ট সেটিংস
const defaultThreadConfig = () => ({
  enabled: true,
  action: "kick", // kick | warn
  strikesLimit: 2,
  categories: {
    nsfw: true,
    violence: true,
    horror: true
  },
  strikes: {}
});

function nowBD() {
  return new Date().toLocaleString("en-US", {
    timeZone: "Asia/Dhaka",
    hour12: true
  });
}

function loadDB() {
  if (!fs.existsSync(DB_PATH)) return {};
  return fs.readJsonSync(DB_PATH, { throws: false }) || {};
}

function saveDB(db) {
  fs.ensureDirSync(DB_DIR);
  fs.writeJsonSync(DB_PATH, db, { spaces: 2 });
}

function getThread(db, threadID) {
  if (!db[threadID]) db[threadID] = defaultThreadConfig();
  return db[threadID];
}

// Keyword lists
const KEYWORDS = {
  nsfw: ["nsfw","xxx","nude","nudity","boobs","bra","panty","sex","porn","horny","cock","dick","cum","hotvideo","xvideo","xvideos","xnxx"],
  violence: ["gore","blood","beheading","murder","shooting","knife","stab","kill","deadbody","corpse","gunfight"],
  horror: ["horror","ghost","jumpscare","creepy","scary","demonic"]
};

// Basic detection
function basicMatch(text = "", url = "", filename = "") {
  const lower = (text + " " + url + " " + filename).toLowerCase();
  const hit = { nsfw: false, violence: false, horror: false };
  for (const k of KEYWORDS.nsfw) if (lower.includes(k)) hit.nsfw = true;
  for (const k of KEYWORDS.violence) if (lower.includes(k)) hit.violence = true;
  for (const k of KEYWORDS.horror) if (lower.includes(k)) hit.horror = true;
  return hit;
}

async function handleAction({ api, event, cfg, hitCategories }) {
  const { threadID, senderID } = event;
  const title = "⚠️ 𝘼𝙪𝙩𝙤𝙈𝙤𝙙";
  const timeStr = nowBD();
  const hitList = Object.entries(hitCategories)
    .filter(([_, v]) => v && cfg.categories[_])
    .map(([k]) => k.toUpperCase());

  if (!hitList.length) return;

  if (cfg.action === "kick") {
    try {
      await api.removeUserFromGroup(senderID, threadID);
      await api.sendMessage(
        `╔═══ ${title} ═══╗
• Reason: ${hitList.join(" + ")}
• Action: KICKED
• Time (BD): ${timeStr}
╚══════════════════╝`,
        threadID
      );
    } catch {
      await api.sendMessage(`❌ Kick ব্যর্থ — বট অ্যাডমিন কি?`, threadID);
    }
    return;
  }

  // Warn mode
  const count = (cfg.strikes[senderID] || 0) + 1;
  cfg.strikes[senderID] = count;
  await api.sendMessage(
    `🚫 Flagged Media: ${hitList.join(" + ")}
⚠️ ${count}/${cfg.strikesLimit} strike
🕒 BD Time: ${timeStr}`,
    threadID
  );

  if (count >= cfg.strikesLimit) {
    try {
      await api.removeUserFromGroup(senderID, threadID);
      await api.sendMessage(`⛔ Strike limit reached — user KICKED.`, threadID);
      delete cfg.strikes[senderID];
    } catch {
      await api.sendMessage(`❌ Kick ব্যর্থ — বট অ্যাডমিন কি?`, threadID);
    }
  }
}

module.exports = {
  config: {
    name: "automod",
    version: "1.0-light",
    author: "Cyclopean Blade",
    role: 1,
    shortDescription: "Auto-kick NSFW/Violence/Horror (keyword only)",
    longDescription: "গ্রুপে 18+/Violence/Horror ছবি/ভিডিও detect করে kick বা warn দেবে।",
    category: "moderation"
  },

  onStart: async function () {
    fs.ensureDirSync(DB_DIR);
    if (!fs.existsSync(DB_PATH)) saveDB({});
  },

  onCommand: async function ({ args, event, api }) {
    const db = loadDB();
    const cfg = getThread(db, event.threadID);
    const sub = (args[0] || "").toLowerCase();

    if (sub === "on") {
      cfg.enabled = true;
      saveDB(db);
      return api.sendMessage("✅ AutoMod চালু হয়েছে।", event.threadID);
    }
    if (sub === "off") {
      cfg.enabled = false;
      saveDB(db);
      return api.sendMessage("⏸️ AutoMod বন্ধ হয়েছে।", event.threadID);
    }
    if (sub === "action" && args[1]) {
      const v = args[1].toLowerCase();
      if (!["kick","warn"].includes(v)) return api.sendMessage("Usage: automod action kick|warn", event.threadID);
      cfg.action = v;
      saveDB(db);
      return api.sendMessage(`⚙️ Action set: ${v.toUpperCase()}`, event.threadID);
    }
    if (sub === "strikes" && args[1] && !isNaN(args[1])) {
      cfg.strikesLimit = Math.max(1, parseInt(args[1]));
      saveDB(db);
      return api.sendMessage(`⚙️ Strikes limit set: ${cfg.strikesLimit}`, event.threadID);
    }
    if (sub === "status") {
      return api.sendMessage(
        `🛡️ AutoMod Status
• Enabled: ${cfg.enabled ? "ON" : "OFF"}
• Action: ${cfg.action.toUpperCase()}
• Strikes(limit): ${cfg.strikesLimit}
• Categories: NSFW=${cfg.categories.nsfw?"ON":"OFF"}, VIOLENCE=${cfg.categories.violence?"ON":"OFF"}, HORROR=${cfg.categories.horror?"ON":"OFF"}
• BD Time Now: ${nowBD()}`,
        event.threadID
      );
    }

    return api.sendMessage(
      "Usage:\n- automod on/off\n- automod action kick|warn\n- automod strikes <number>\n- automod status",
      event.threadID
    );
  },

  onMessage: async function ({ event, api }) {
    try {
      const { threadID, body = "", messageReply, attachments = [] } = event;
      const db = loadDB();
      const cfg = getThread(db, threadID);
      if (!cfg.enabled) return;

      let triggered = { nsfw: false, violence: false, horror: false };

      // Text keyword check
      const textHit = basicMatch(body);
      triggered.nsfw ||= textHit.nsfw;
      triggered.violence ||= textHit.violence;
      triggered.horror ||= textHit.horror;

      // Attachments check
      let allAttachments = [...attachments];
      if (messageReply && Array.isArray(messageReply.attachments))
        allAttachments = allAttachments.concat(messageReply.attachments);

      for (const att of allAttachments) {
        const url = att.url || att.previewUrl || "";
        const filename = att.filename || "";
        const b = basicMatch("", url, filename);
        triggered.nsfw ||= b.nsfw;
        triggered.violence ||= b.violence;
        triggered.horror ||= b.horror;
      }

      if (
        (cfg.categories.nsfw && triggered.nsfw) ||
        (cfg.categories.violence && triggered.violence) ||
        (cfg.categories.horror && triggered.horror)
      ) {
        await handleAction({ api, event, cfg, hitCategories: triggered });
        saveDB(db);
      }
    } catch {
      // ignore errors
    }
  }
};

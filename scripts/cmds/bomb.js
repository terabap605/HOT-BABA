const fetch = require("node-fetch");

module.exports.config = {
    name: "bomb",
    version: "1.0.0",
    permission: 0,
    credits: "Gift Bomber",
    description: "SMS Bomber Tool (for testing only, do not use on real numbers!)",
    commandCategory: "utility",
    usages: ".bomb <number> <amount>",
    cooldowns: 5
};

module.exports.onStart = async function({ api, event, args }) {
    const number = args[0];
    const amount = parseInt(args[1]);

    if (!number || !amount) {
        return api.sendMessage("⚠️ ব্যবহার: .bomb <number> <amount>", event.threadID, event.messageID);
    }

    api.sendMessage(
`━━━━━━━━━━━━━━━━━━
🎁 𝐓𝐄𝐒𝐓 𝐁𝐎𝐌𝐁𝐄𝐑 🎁
━━━━━━━━━━━━━━━━━━
📱 Target: ${number}
🔢 Amount: ${amount}
━━━━━━━━━━━━━━━━━━
🚀 Attack Started...
━━━━━━━━━━━━━━━━━━`,
    event.threadID);

    // Safe test API endpoints (replace with your own test URLs)
    const apis = [
        {
            url: "https://jsonplaceholder.typicode.com/posts",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: (num) => JSON.stringify({ phone: num, test: true })
        },
        {
            url: "https://jsonplaceholder.typicode.com/comments",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: (num) => JSON.stringify({ phone: num, comment: "Test" })
        }
    ];

    for (let i = 0; i < amount; i++) {
        for (let apiData of apis) {
            try {
                await fetch(apiData.url, {
                    method: apiData.method,
                    headers: apiData.headers,
                    body: apiData.body ? apiData.body(number) : null
                });
            } catch (e) {
                console.log("Error:", e.message);
            }
        }
    }

    api.sendMessage(
`━━━━━━━━━━━━━━━━━━
✅ Test Finished!
📱 Target: ${number}
🔢 Total: ${amount}x
━━━━━━━━━━━━━━━━━━
👑 𝐑𝐀𝐇𝐀𝐃 𝐁𝐎𝐒𝐒 👑
━━━━━━━━━━━━━━━━━━`,
    event.threadID);
};

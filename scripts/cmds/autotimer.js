let isTimerRunning = false;
let intervalID = null;

const timerData = {
"01:00:00 AM": { message: "🕐 1AM - Night owl detected! 🦉", url: null },
"02:00:00 AM": { message: "🕑 2AM - Late night coder? 💻", url: null },
"03:00:00 AM": { message: "🕒 3AM - Sleep is important 😴", url: null },
"04:00:00 AM": { message: "🕓 4AM - You up? 🌙", url: null },
"05:00:00 AM": { message: "🕔 5AM - Almost sunrise 🌅", url: null },
"06:00:00 AM": { message: "🌄 〘 𝙂𝙤𝙤𝙙 𝙈𝙤𝙧𝙣𝙞𝙣𝙜! 〙✨\n𝑹𝒊𝒔𝒆 𝒂𝒏𝒅 𝒔𝒉𝒊𝒏𝒆! 🔔", url: null },
"07:00:00 AM": { message: "🕖 7AM - Ready to grind? ⚡", url: null },
"08:00:00 AM": { message: "🕗 8AM - Grab breakfast! 🥞", url: null },
"09:00:00 AM": { message: "🕘 9AM - Work mode ON 💼", url: null },
"10:00:00 AM": { message: "🕙 10AM - Focus hour 🧠", url: null },
"11:00:00 AM": { message: "🕚 11AM - Keep going! 🚀", url: null },
"12:00:00 PM": { message: "🍱 〘 𝑳𝒖𝒏𝒄𝒉 𝑻𝒊𝒎𝒆! 〙😋\n𝑻𝒊𝒎𝒆 𝒕𝒐 𝒓𝒆𝒇𝒖𝒆𝒍 🔋", url: null },
"01:00:00 PM": { message: "🕐 1PM - Back to hustle 💪", url: null },
"02:00:00 PM": { message: "🕑 2PM - Power through 🔥", url: null },
"03:00:00 PM": { message: "☕ 〘 𝘼𝙛𝙩𝙚𝙧𝙣𝙤𝙤𝙣 𝙍𝙚𝙢𝙞𝙣𝙙𝙚𝙧 〙💦\n𝑯𝒚𝒅𝒓𝒂𝒕𝒆 & 𝒔𝒕𝒂𝒚 𝒇𝒐𝒄𝒖𝒔𝒆𝒅 🧠", url: null },
"04:00:00 PM": { message: "🕓 4PM - Stretch a bit 🧘", url: null },
"05:00:00 PM": { message: "🕔 5PM - Wrapping up soon! 🎯", url: null },
"06:00:00 PM": { message: "🕕 6PM - Evening begins 🌆", url: null },
"07:00:00 PM": { message: "🌇 〘 𝙀𝙫𝙚𝙣𝙞𝙣𝙜 𝙈𝙤𝙤𝙙 〙🎧\n𝑺𝒆𝒕𝒕𝒍𝒆 𝒅𝒐𝒘𝒏, 𝒆𝒏𝒋𝒐𝒚 𝒕𝒉𝒆 𝒗𝒊𝒃𝒆𝒔 ✨", url: null },
"08:00:00 PM": { message: "🕗 8PM - Relax mode 💆", url: null },
"09:00:00 PM": { message: "🌙 〘 𝙉𝙞𝙜𝙝𝙩 𝙁𝙚𝙚𝙡𝙨 〙💤\n𝑺𝒕𝒂𝒓𝒔 𝒂𝒓𝒆 𝒔𝒉𝒊𝒏𝒊𝒏𝒈... ✨", url: null },
"10:00:00 PM": { message: "🕙 10PM - Unwind & breathe 🌬️", url: null },
"11:00:00 PM": { message: "🌌 〘 𝙂𝙤𝙤𝙙𝙣𝙞𝙜𝙝𝙩 𝙎𝙞𝙜𝙣 𝙊𝙛𝙛 〙😴\n𝑺𝒘𝒆𝒆𝒕 𝒅𝒓𝒆𝒂𝒎𝒔! 🌠", url: null },
"12:00:00 AM": { message: "🕛 Midnight - Sleep tight 🌚", url: null }
};

module.exports.config = {
name: "autotimer",
version: "3.0",
role: 0,
author: "Dipto (Styled by ChatGPT)",
description: "⏰ প্রতি ঘন্টায় ইউনিক অটো মেসেজ পাঠাবে",
category: "AutoTime",
countDown: 3
};

function getCurrentTime() {
return new Date(Date.now() + 21600000).toLocaleTimeString("en-US", {
hour: "2-digit",
minute: "2-digit",
second: "2-digit",
hour12: true
}).trim();
}

async function startTimer(api) {
if (isTimerRunning) return;
isTimerRunning = true;

intervalID = setInterval(async () => {
const now = getCurrentTime();
const entry = timerData[now];
if (!entry) return;

const threads = global.GoatBot.config?.whiteListModeThread?.whiteListThreadIds || [];  

for (const threadID of threads) {  
  await api.sendMessage(  
    {  
      body: `╭───────────────⏰\n│  ${entry.message}\n╰───────────────🕒 ${now}`  
    },  
    threadID  
  );  
}

}, 1000);
}

function stopTimer() {
if (intervalID) clearInterval(intervalID);
isTimerRunning = false;
}

module.exports.onLoad = async ({ api }) => {
await startTimer(api); // auto start
};

module.exports.onStart = async ({ message, args, api }) => {
const cmd = args[0];

if (cmd === "on") {
if (isTimerRunning) return message.reply("⏳ Timer already running.");
await startTimer(api);
return message.reply("✅ AutoTimer started.");
}

if (cmd === "off") {
if (!isTimerRunning) return message.reply("❌ Timer is not running.");
stopTimer();
return message.reply("🛑 AutoTimer stopped.");
}

if (cmd === "status") {
return message.reply(📊 AutoTimer status: ${isTimerRunning ? "Running ✅" : "Stopped ❌"});
}

return message.reply("📘 Usage:\n/autotimer on\n/autotimer off\n/autotimer status");
};


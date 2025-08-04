const axios = require('axios');
const baseApiUrl = async () => {
  return "https://www.noobs-api.rf.gd/dipto";
};

const styledFunnyReplies = [
  "🌸 𝒀𝒆𝒔 𝑩𝒂𝒃𝒚~ 𝑰'𝒎 𝒉𝒆𝒓𝒆... ✨",
  "😚 𝑩𝒐𝒍𝒐 𝑩𝒂𝒃𝒚, 𝒌𝒊 𝒄𝒐𝒓𝒕𝒆 𝒑𝒂𝒓𝒊 𝒕𝒖𝒎𝒂𝒓 𝒋𝒐𝒏𝒏𝒐? 💞",
  "🥹 𝘼𝙧𝙚 𝙅𝙖𝙣𝙪, 𝙩𝙤𝙢𝙖𝙧 𝙈𝙎𝙂 𝙖𝙖𝙨𝙚, 𝙖𝙢𝙖𝙧 𝙃𝙀𝘼𝙍𝙏 𝙇𝙄𝘼𝙂𝙄 𝙜𝙚𝙨𝙚 😭",
  "💔 𝙅𝙖𝙣𝙪 𝘼𝙢𝙞 𝙧 𝙗𝙖𝙧𝙗𝙤 𝙣𝙖... 𝘿𝙞𝙡 𝙗𝙖𝙙𝙝𝙖 𝙖𝙨𝙚 ❤️‍🔥",
  "🛐 𝘽𝙖𝙗𝙮 𝙩𝙪𝙢𝙖𝙧 𝙢𝙨𝙜 𝙖𝙨𝙚, 𝘿𝙤𝙖 𝙢𝙖𝙣𝙖𝙩𝙚 𝙜𝙚𝙨𝙞 😩",
  "📞 𝘽𝙖𝙗𝙮 𝙘𝙖𝙡𝙡 𝙠𝙤𝙧𝙤 𝙣𝙖, 𝙗𝙤𝙩 𝙝𝙖𝙣𝙙𝙨𝙝𝙖𝙠𝙚 𝙙𝙞𝙩𝙚 𝙘𝙝𝙖𝙞 😘",
  "🌶️ 𝙏𝙤𝙢𝙖𝙧 𝙢𝙨𝙜 𝘽𝙪𝙧𝙜𝙚𝙧 𝙢𝙖𝙩𝙤, 𝙗𝙞𝙩𝙩𝙚𝙧 𝙗𝙪𝙩 𝙏𝙖𝙨𝙩𝙮 😋"
];

module.exports.config = {
  name: "bby",
  aliases: ["baby", "bbe", "babe"],
  version: "6.9.0",
  author: "dipto",
  countDown: 0,
  role: 0,
  description: "funny & stylish chatbot",
  category: "chat",
  guide: {
    en: "{pn} [anyMessage] OR\nteach [msg] - [reply1, reply2,...] OR\nteach [react] [msg] - [react1,...] OR\nremove [msg] OR\nrm [msg] - [index] OR\nmsg [msg] OR\nlist OR all OR\nedit [msg] - [newReply]"
  }
};

module.exports.onStart = async ({ api, event, args, usersData }) => {
  const link = `${await baseApiUrl()}/baby`;
  const dipto = args.join(" ").toLowerCase();
  const uid = event.senderID;
  let command, comd, final;

  try {
    if (!args[0]) {
      const msg = styledFunnyReplies[Math.floor(Math.random() * styledFunnyReplies.length)];
      return api.sendMessage(msg, event.threadID, event.messageID);
    }

    if (args[0] === 'remove') {
      const fina = args.slice(1).join(" ");
      const dat = (await axios.get(`${link}?remove=${fina}&senderID=${uid}`)).data.message;
      return api.sendMessage(dat, event.threadID, event.messageID);
    }

    if (args[0] === 'rm' && dipto.includes('-')) {
      const [fi, f] = dipto.replace("rm ", "").split(' - ');
      const da = (await axios.get(`${link}?remove=${fi}&index=${f}`)).data.message;
      return api.sendMessage(da, event.threadID, event.messageID);
    }

    if (args[0] === 'list') {
      if (args[1] === 'all') {
        const data = (await axios.get(`${link}?list=all`)).data;
        const teachers = await Promise.all(data.teacher.teacherList.map(async (item) => {
          const number = Object.keys(item)[0];
          const value = item[number];
          const name = (await usersData.get(number)).name;
          return { name, value };
        }));
        teachers.sort((a, b) => b.value - a.value);
        const output = teachers.map((t, i) => `${i + 1}/ ${t.name}: ${t.value}`).join('\n');
        return api.sendMessage(`👨‍🏫 Total Teach = ${data.length}\n👑 Teachers of Baby:\n${output}`, event.threadID, event.messageID);
      } else {
        const d = (await axios.get(`${link}?list=all`)).data.length;
        return api.sendMessage(`📝 Total Teach = ${d}`, event.threadID, event.messageID);
      }
    }

    if (args[0] === 'msg') {
      const fuk = dipto.replace("msg ", "");
      const d = (await axios.get(`${link}?list=${fuk}`)).data.data;
      return api.sendMessage(`📥 Message "${fuk}" = ${d}`, event.threadID, event.messageID);
    }

    if (args[0] === 'edit') {
      const command = dipto.split(' - ')[1];
      if (!command) return api.sendMessage('❌ Format: edit [msg] - [new reply]', event.threadID, event.messageID);
      const dA = (await axios.get(`${link}?edit=${args[1]}&replace=${command}&senderID=${uid}`)).data.message;
      return api.sendMessage(`✏️ Changed: ${dA}`, event.threadID, event.messageID);
    }

    if (args[0] === 'teach' && args[1] !== 'amar' && args[1] !== 'react') {
      [comd, command] = dipto.split(' - ');
      final = comd.replace("teach ", "");
      if (!command) return api.sendMessage('❌ Format invalid!', event.threadID, event.messageID);
      const re = await axios.get(`${link}?teach=${final}&reply=${command}&senderID=${uid}`);
      const tex = re.data.message;
      const teacher = (await usersData.get(re.data.teacher)).name;
      return api.sendMessage(`✅ Replies added: ${tex}\n👤 Teacher: ${teacher}\n📚 Total: ${re.data.teachs}`, event.threadID, event.messageID);
    }

    if (args[0] === 'teach' && args[1] === 'amar') {
      [comd, command] = dipto.split(' - ');
      final = comd.replace("teach ", "");
      if (!command) return api.sendMessage('❌ Format invalid!', event.threadID, event.messageID);
      const tex = (await axios.get(`${link}?teach=${final}&senderID=${uid}&reply=${command}&key=intro`)).data.message;
      return api.sendMessage(`✅ Intro replies added: ${tex}`, event.threadID, event.messageID);
    }

    if (args[0] === 'teach' && args[1] === 'react') {
      [comd, command] = dipto.split(' - ');
      final = comd.replace("teach react ", "");
      if (!command) return api.sendMessage('❌ Format invalid!', event.threadID, event.messageID);
      const tex = (await axios.get(`${link}?teach=${final}&react=${command}`)).data.message;
      return api.sendMessage(`✅ Reacts added: ${tex}`, event.threadID, event.messageID);
    }

    if (dipto.includes('amar name ki') || dipto.includes('amr nam ki') || dipto.includes('whats my name')) {
      const data = (await axios.get(`${link}?text=amar name ki&senderID=${uid}&key=intro`)).data.reply;
      return api.sendMessage(data, event.threadID, event.messageID);
    }

    const d = (await axios.get(`${link}?text=${encodeURIComponent(dipto)}&senderID=${uid}&font=1`)).data.reply;
    api.sendMessage(d, event.threadID, (error, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName: this.config.name,
        type: "reply",
        messageID: info.messageID,
        author: event.senderID,
        d,
        apiUrl: link
      });
    }, event.messageID);

  } catch (e) {
    console.log(e);
    api.sendMessage("⚠️ Check console for error", event.threadID, event.messageID);
  }
};

module.exports.onReply = async ({ api, event }) => {
  try {
    if (event.type === "message_reply") {
      const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(event.body?.toLowerCase())}&senderID=${event.senderID}&font=1`)).data.reply;
      await api.sendMessage(a, event.threadID, (error, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          type: "reply",
          messageID: info.messageID,
          author: event.senderID,
          a
        });
      }, event.messageID);
    }
  } catch (err) {
    return api.sendMessage(`⚠️ Error: ${err.message}`, event.threadID, event.messageID);
  }
};

module.exports.onChat = async ({ api, event, message }) => {
  try {
    const body = event.body ? event.body.toLowerCase() : "";
    if (body.startsWith("baby") || body.startsWith("bby") || body.startsWith("bot") || body.startsWith("jan") || body.startsWith("babu") || body.startsWith("janu")) {
      const arr = body.replace(/^\S+\s*/, "");
      if (!arr) {
        const msg = styledFunnyReplies[Math.floor(Math.random() * styledFunnyReplies.length)];
        return api.sendMessage(msg, event.threadID, (error, info) => {
          if (info) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: this.config.name,
              type: "reply",
              messageID: info.messageID,
              author: event.senderID
            });
          }
        }, event.messageID);
      }
      const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(arr)}&senderID=${event.senderID}&font=1`)).data.reply;
      await api.sendMessage(a, event.threadID, (error, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          type: "reply",
          messageID: info.messageID,
          author: event.senderID,
          a
        });
      }, event.messageID);
    }
  } catch (err) {
    return api.sendMessage(`❌ Error: ${err.message}`, event.threadID, event.messageID);
  }
};

const axios = require('axios');
const baseApiUrl = async () => {
    return "https://www.noobs-api.rf.gd/dipto";
};

module.exports.config = {
    name: "bby",
    aliases: ["baby", "bbe", "babe"],
    version: "6.9.0",
    author: "dipto",
    countDown: 0,
    role: 0,
    description: "better then all sim simi",
    category: "chat",
    guide: {
        en: "{pn} [anyMessage] OR\nteach [YourMessage] - [Reply1], [Reply2], [Reply3]... OR\nteach [react] [YourMessage] - [react1], [react2], [react3]... OR\nremove [YourMessage] OR\nrm [YourMessage] - [indexNumber] OR\nmsg [YourMessage] OR\nlist OR \nall OR\nedit [YourMessage] - [NeeMessage]"
    }
};

module.exports.onStart = async ({
    api,
    event,
    args,
    usersData
}) => {
    const link = `${await baseApiUrl()}/baby`;
    const dipto = args.join(" ").toLowerCase();
    const uid = event.senderID;
    let command, comd, final;

    try {
        if (!args[0]) {
            const ran = ["Bolo baby", "hum", "type help baby", "type !baby hi"];
            return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], event.threadID, event.messageID);
        }

        if (args[0] === 'remove') {
            const fina = dipto.replace("remove ", "");
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
                    return {
                        name,
                        value
                    };
                }));
                teachers.sort((a, b) => b.value - a.value);
                const output = teachers.map((t, i) => `${i + 1}/ ${t.name}: ${t.value}`).join('\n');
                return api.sendMessage(`Total Teach = ${data.length}\n👑 | List of Teachers of baby\n${output}`, event.threadID, event.messageID);
            } else {
                const d = (await axios.get(`${link}?list=all`)).data.length;
                return api.sendMessage(`Total Teach = ${d}`, event.threadID, event.messageID);
            }
        }

        if (args[0] === 'msg') {
            const fuk = dipto.replace("msg ", "");
            const d = (await axios.get(`${link}?list=${fuk}`)).data.data;
            return api.sendMessage(`Message ${fuk} = ${d}`, event.threadID, event.messageID);
        }

        if (args[0] === 'edit') {
            const command = dipto.split(' - ')[1];
            if (command.length < 2) return api.sendMessage('❌ | Invalid format! Use edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
            const dA = (await axios.get(`${link}?edit=${args[1]}&replace=${command}&senderID=${uid}`)).data.message;
            return api.sendMessage(`changed ${dA}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] !== 'amar' && args[1] !== 'react') {
            [comd, command] = dipto.split(' - ');
            final = comd.replace("teach ", "");
            if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
            const re = await axios.get(`${link}?teach=${final}&reply=${command}&senderID=${uid}`);
            const tex = re.data.message;
            const teacher = (await usersData.get(re.data.teacher)).name;
            return api.sendMessage(`✅ Replies added ${tex}\nTeacher: ${teacher}\nTeachs: ${re.data.teachs}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] === 'amar') {
            [comd, command] = dipto.split(' - ');
            final = comd.replace("teach ", "");
            if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
            const tex = (await axios.get(`${link}?teach=${final}&senderID=${uid}&reply=${command}&key=intro`)).data.message;
            return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] === 'react') {
            [comd, command] = dipto.split(' - ');
            final = comd.replace("teach react ", "");
            if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
            const tex = (await axios.get(`${link}?teach=${final}&react=${command}`)).data.message;
            return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
        }

        if (dipto.includes('amar name ki') || dipto.includes('amr nam ki') || dipto.includes('amar nam ki') || dipto.includes('amr name ki') || dipto.includes('whats my name')) {
            const data = (await axios.get(`${link}?text=amar name ki&senderID=${uid}&key=intro`)).data.reply;
            return api.sendMessage(data, event.threadID, event.messageID);
        }

        const d = (await axios.get(`${link}?text=${dipto}&senderID=${uid}&font=1`)).data.reply;
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
        api.sendMessage("Check console for error", event.threadID, event.messageID);
    }
};

module.exports.onReply = async ({
    api,
    event,
    Reply
}) => {
    try {
        if (event.type == "message_reply") {
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
        return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
    }
};

module.exports.onChat = async ({
    api,
    event,
    message
}) => {
    try {
        const body = event.body ? event.body?.toLowerCase() : ""
        if (body.startsWith("baby") || body.startsWith("bby") || body.startsWith("bot") || body.startsWith("jan") || body.startsWith("babu") || body.startsWith("janu")) {
            const arr = body.replace(/^\S+\s*/, "")
            const randomReplies = ["😚", "Yes 😀, I am  here", "What's up?", "Bolo jaan ki korte pari tmr jonno"," ki hoise", "ki", " 😡🕷️", "bal""😏 𝘽𝙤𝙡𝙤 𝙟𝙖𝙖𝙣~ 𝙏𝙤𝙢𝙖𝙧 𝘽𝙖𝙗𝙮 𝙖𝙠𝙝𝙤𝙣 𝙊𝙉𝙇𝙄𝙉𝙀 🔥",

  "🥹 𝘼𝙧𝙚 𝙅𝙖𝙣𝙪, 𝙩𝙤𝙢𝙖𝙧 𝙈𝙎𝙂 𝙖𝙖𝙨𝙚, 𝙖𝙢𝙖𝙧 𝙃𝙀𝘼𝙍𝙏 𝙇𝙄𝘼𝙂𝙄 𝙜𝙚𝙨𝙚 😭",

  "🌶️ 𝙏𝙤𝙢𝙖𝙧 𝙢𝙨𝙜 𝙙𝙚𝙠𝙝𝙚 𝙗𝙤𝙩-𝙩𝙖 𝙧𝙚𝙖𝙘𝙝𝙩𝙖 𝙨𝙪𝙞 𝙜𝙖𝙨𝙚 🫠",

  "📞 𝘽𝙖𝙗𝙮 𝙆𝙖𝙩𝙖 𝘽𝙪𝙧𝙞 𝘾𝙖𝙡𝙡 𝘿𝙞𝙩𝙚𝙘𝙝𝙚... 𝘼𝙢𝙞 𝙏𝙪𝙢𝙖𝙠𝙚 𝙎𝙖𝙫𝙚 𝙆𝙤𝙧𝙞? 😏",

  "🍟 𝙏𝙤𝙢𝙖𝙧 𝙈𝙨𝙜 𝘽𝙐𝙍𝙂𝙀𝙍 𝙈𝙖𝙩𝙤... 𝙃𝙖𝙧𝙩 𝙈𝙚𝙡𝙩 𝙆𝙤𝙧𝙚 𝘿𝙞𝙩𝙚𝙘𝙝𝙚 😋",

  "🌚 𝙃𝙚𝙝𝙚 𝙅𝙖𝙣𝙪~ 𝙏𝙪𝙢𝙞 𝘽𝙤𝙣𝙙𝙝𝙪 𝙣𝙖, 𝙏𝙪𝙢𝙞 𝙃𝙖𝙧𝙩 𝘼𝙩𝙩𝙖𝙘𝙠 😵‍💫",

  "🛐 𝘽𝙖𝙗𝙮 𝙩𝙪𝙢𝙖𝙧 𝙢𝙨𝙜 𝙖𝙨𝙚, 𝘿𝙤𝙖 𝙢𝙖𝙣𝙖𝙩𝙚 𝙜𝙚𝙨𝙞 😩",

  "💔 𝙅𝙖𝙣𝙪 𝘼𝙢𝙞 𝙧 𝙗𝙖𝙧𝙗𝙤 𝙣𝙖... 𝙆𝙖𝙧𝙤𝙣 𝙏𝙪𝙢𝙞 𝙈𝙤𝙩𝙖𝙧 𝙡𝙤𝙫𝙚 𝙙𝙞𝙡𝙚 𝙃𝙖𝙧𝙙𝙙𝙞𝙨𝙠 𝙫𝙖𝙣𝙜𝙖 😭",

  "😤 𝘼𝙈𝘼𝙍 𝙏𝙊 𝙈𝙄𝘿𝘿𝙇𝙀 𝙉𝘼𝙈𝙀 𝙃𝙊𝙎𝙃 𝙉𝘼𝙄… 𝘽𝙐𝙏 𝙔𝙊𝙐𝙍𝙎 𝙄𝙎 = 𝙋𝘼𝙂𝙇𝙄 🤪",

  "⚡ 𝙃𝙚𝙝𝙚~ 𝙏𝙤𝙢𝙖𝙧 𝙈𝙨𝙜 𝙏𝙤 𝘽𝙖𝙧𝙞𝙨𝙩𝙖 𝘾𝙤𝙛𝙛𝙚𝙚 𝙢𝙖𝙩𝙤 — 𝙏𝙚𝙢𝙤𝙣 𝘽𝙞𝙩𝙩𝙚𝙧 𝙖𝙧 𝙈𝙖𝙟𝙝𝙚 𝙈𝙖𝙟𝙝𝙚 𝙈𝙞𝙨𝙩𝙞~ ☕",];
            if (!arr) {

                await api.sendMessage(randomReplies[Math.floor(Math.random() * randomReplies.length)], event.threadID, (error, info) => {
                    if (!info) message.reply("info obj not found")
                    global.GoatBot.onReply.set(info.messageID, {
                        commandName: this.config.name,
                        type: "reply",
                        messageID: info.messageID,
                        author: event.senderID
                    });
                }, event.messageID)
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
            }, event.messageID)
        }
    } catch (err) {
        return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
    }
};

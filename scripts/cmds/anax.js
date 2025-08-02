 const axios = require("axios");

module.exports = {
  config: {
    name: "anax",
    aliases: [], // add your aliases
    version: "1.0",
    author: "Mesbah Saxx",
    countDown: 5,
    role: 0,
    description: {
      en: "Teach and chat with the bot."
    },
    category: "chat",
    guide: {
      en: "   {pn} teach <question> - <answer, answer2>"
        + "\n   {pn} <question>"
    }
  },

  onStart: async function ({ message, event, args, commandName }) {
    const senderID = event.senderID;

    if (args[0] === "teach") {
      const input = args.slice(1).join(" ").split(" - ");
      if (input.length !== 2) return message.reply("❌ Usage: /sim teach <question> - <answers>");

      const [question, answers] = input;
      const answersArray = answers.split(",").map(a => a.trim());

      try {
        await axios.post("https://www.mesbah-saxx.is-best.net/api/sim/teach", {
          question,
          answer: answersArray,
          senderID
        });
        message.reply(`✅ Taught: "${question}" → "${answersArray.join(", ")}"`);
      } catch (error) {
        message.reply(`❌ Failed to teach the bot.\n\nError: ${error.response?.data || error.message}`);
      }
      return;
    }

    const question = args.join(" ");
    if (!question) return message.reply("❌ Please provide a question.");

    try {
      const { data } = await axios.get(`https://www.mesbah-saxx.is-best.net/api/sim/get?question=${encodeURIComponent(question)}&senderID=${senderID}`);
      message.reply(data.response, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName,
          author: event.senderID
        });
      });
    } catch (error) {
      message.reply("❌ Error retrieving response.");
    }
  },

  onChat: async function ({ message, event, commandName }) {
    const senderID = event.senderID;
    const fullMessage = event.body?.trim();

    if (!fullMessage) return;

    const splitMessage = fullMessage.split(" ");
    const botCommand = splitMessage[0]?.toLowerCase();
    const botQuery = splitMessage.slice(1).join(" ");

    const validCommands = [this.config.name, ...this.config.aliases];
    if (!validCommands.includes(botCommand)) return;

    if (!botQuery) return message.reply("❌ Please provide a question.");

    if (botQuery.startsWith("teach ")) {
      const input = botQuery.slice(6).split(" - ");
      if (input.length !== 2) return message.reply("❌ Usage: /saxx teach <question> - <answers>");

      const [question, answers] = input;
      const answersArray = answers.split(",").map(a => a.trim());

      try {
        await axios.post("https://www.mesbah-saxx.is-best.net/api/sim/teach", {
          question,
          answer: answersArray,
          senderID
        });
        message.reply(`✅ Taught: "${question}" → "${answersArray.join(", ")}"`);
      } catch (error) {
        message.reply(`❌ Failed to teach the bot.\n\nError: ${error.response?.data || error.message}`);
      }
      return;
    }

    try {
      const { data } = await axios.get(`https://www.mesbah-saxx.is-best.net/api/sim/get?question=${encodeURIComponent(botQuery)}&senderID=${senderID}`);
      message.reply(data.response, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName,
          author: event.senderID
        });
      });
    } catch (error) {
      message.reply("❌ Error retrieving response.");
    }
  },

  onReply: async function ({ message, event, commandName, Reply }) {
    const { senderID, body } = event;
    const { author } = Reply;

    if (senderID !== author) return message.reaction("❌", event.messageID);

    try {
      const { data } = await axios.get(`https://www.mesbah-saxx.is-best.net/api/sim/get?question=${encodeURIComponent(body)}&senderID=${senderID}`);
      message.reply(data.response, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName,
          author: event.senderID
        });
      });
    } catch (error) {
      message.reply("❌ Error retrieving response.");
    }
  },
};

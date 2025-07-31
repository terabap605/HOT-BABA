const { exec } = require('child_process');

module.exports = {
  config: {
    name: "shell",
    version: "1.0",
    author: "Rahad",
    countDown: 5,
    role: 2,
    shortDescription: "🔧 Execute shell commands",
    longDescription: "Only for authorized user",
    category: "🔐 Developer",
    guide: {
      vi: "{p}{n} <command>",
      en: "{p}{n} <command>"
    }
  },

  onStart: async function ({ args, message, event }) {
    const allowedUID = "61558576796403"; // ✅ Your UID here

    if (event.senderID !== allowedUID) {
      return message.reply("🚫 | You are not allowed to use this command.");
    }

    const command = args.join(" ");
    if (!command) return message.reply("❌ | Please provide a shell command to execute.");

    exec(command, { timeout: 15000 }, (error, stdout, stderr) => {
      if (error) {
        console.error(`❗ Shell Error: ${error}`);
        return message.reply(`❌ | Error:\n\`\`\`\n${error.message}\n\`\`\``);
      }

      if (stderr) {
        console.warn(`⚠️ Shell Stderr: ${stderr}`);
        return message.reply(`⚠️ | Stderr:\n\`\`\`\n${stderr}\n\`\`\``);
      }

      const output = stdout || "✅ | Command executed with no output.";
      const limitedOutput = output.length > 3000 ? output.slice(0, 3000) + "\n\n[...Output truncated]" : output;

      return message.reply(`✅ | Output:\n\`\`\`\n${limitedOutput}\n\`\`\``);
    });
  }
};

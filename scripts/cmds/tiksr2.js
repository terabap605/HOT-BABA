const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const baseApiUrl = async () => {
    const base = await axios.get(
        `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`,
    );
    return base.data.api;
};

/*  
╔══════════════════════╗
   ✨🎵 𝗧𝗶𝗸𝗧𝗼𝗸 𝗦𝗲𝗮𝗿𝗰𝗵 𝟮 🎵✨
╚══════════════════════╝
*/

module.exports.config = {
    name: "tiksr2",
    version: "2.0",
    author: "Rahad",
    countDown: 5,
    role: 0,
    description: {
        en: "Search and download TikTok videos (v2 with styled design)",
    },
    category: "MEDIA",
    guide: {
        en:
            "{pn} <search> - <optional: number of results | blank>" +
            "\nExample:" +
            "\n{pn} caredit - 50",
    },
};

module.exports.onStart = async function ({ api, args, event }) {
    let search = args.join(" ");
    let searchLimit = 10;

    const match = search.match(/^(.+)\s*-\s*(\d+)$/);
    if (match) {
        search = match[1].trim();
        searchLimit = parseInt(match[2], 10);
    }

    const apiUrl = `${await baseApiUrl()}/tiktoksearch?search=${encodeURIComponent(search)}&limit=${searchLimit}`;

    try {
        const response = await axios.get(apiUrl);
        const data = response.data.data;

        if (!data || data.length === 0) {
            api.sendMessage(
                `❌ No results found for '${search}'. Try another keyword.`,
                event.threadID,
            );
            return;
        }

        let replyOption = "╔══════════════════════╗\n";
        replyOption += "   ✨🎵 𝗧𝗶𝗸𝗧𝗼𝗸 𝗦𝗲𝗮𝗿𝗰𝗵 𝟮 🎵✨\n";
        replyOption += "╚══════════════════════╝\n\n";
        replyOption += `🔍 Results for: ${search}\n\n`;

        for (let i = 0; i < data.length; i++) {
            const video = data[i];
            replyOption += `${i + 1}️⃣ ${video.title}\n\n`;
        }

        replyOption += "──────────────────────\n";
        replyOption += "⚡ Reply with a number to download your video ⚡";

        const reply = await api.sendMessage(replyOption, event.threadID);
        const replyMessageID = reply.messageID;

        global.GoatBot.onReply.set(replyMessageID, {
            commandName: this.config.name,
            author: event.senderID,
            messageID: replyMessageID,
            results: data,
        });
    } catch (error) {
        console.error(error);
        api.sendMessage(`⚠️ Error: ${error.message}`, event.threadID);
    }
};

module.exports.onReply = async function ({ event, api, Reply }) {
    const { author, results } = Reply;

    if (event.senderID !== author) return;

    const selectedNumber = parseInt(event.body);

    if (
        isNaN(selectedNumber) ||
        selectedNumber <= 0 ||
        selectedNumber > results.length
    ) {
        api.sendMessage(
            "❌ Invalid option. Please reply with a valid number.",
            event.threadID,
        );
        return;
    }

    await api.unsendMessage(Reply.messageID);
    const selectedVideo = results[selectedNumber - 1];

    try {
        const response = await axios.get(selectedVideo.video, {
            responseType: "arraybuffer",
        });
        const videoBuffer = response.data;

        const filename = `${selectedVideo.title.replace(/[^\w\s]/gi, "")}.mp4`;
        const filepath = path.join(__dirname, filename);

        await fs.writeFile(filepath, videoBuffer);

        let infoMessage = "╔══════════════════════╗\n";
        infoMessage += "      🎵 𝗧𝗶𝗸𝗧𝗼𝗸 𝗦𝗲𝗮𝗿𝗰𝗵 𝟮 🎵\n";
        infoMessage += "╚══════════════════════╝\n\n";
        infoMessage += `🎥 Title : ${selectedVideo.title}\n`;
        infoMessage += `🔗 Link  : ${selectedVideo.video}\n\n`;
        infoMessage += "──────────────────────\n";
        infoMessage += "👑 𝑹𝒂𝒉𝒂𝒅 𝑩𝒐𝒔𝒔 ⚡🔥";

        api.sendMessage(
            { body: infoMessage, attachment: fs.createReadStream(filepath) },
            event.threadID,
        );
        await fs.unlink(filepath);
    } catch (error) {
        console.error(error);
        api.sendMessage(
            "⚠️ An error occurred while downloading the TikTok video.",
            event.threadID,
        );
    }
};

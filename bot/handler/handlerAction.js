const createFuncMessage = global.utils.message;
const handlerCheckDB = require("./handlerCheckData.js");

module.exports = (api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData) => {
  const handlerEvents = require(process.env.NODE_ENV == 'development' ? "./handlerEvents.dev.js" : "./handlerEvents.js")(
    api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData
  );

  return async function (event) {
    // Anti-inbox protection
    if (
      global.GoatBot.config.antiInbox === true &&
      (!event.isGroup || event.senderID === event.threadID)
    ) return;

    const message = createFuncMessage(api, event);

    // Check DB for user/thread
    await handlerCheckDB(usersData, threadsData, event);

    // Get chat handlers
    const handlerChat = await handlerEvents(event, message);
    if (!handlerChat) return;

    const {
      onAnyEvent, onFirstChat, onStart, onChat,
      onReply, onEvent, handlerEvent, onReaction,
      typ, presence, read_receipt
    } = handlerChat;

    // Reaction permissions
    let reactPermission = global.GoatBot.config.handlerReaction;
    let allowedUsers = reactPermission.enable
      ? reactPermission.HandelReactionMain
      : [...reactPermission.HandelReactionMain, ...reactPermission.HandelReactionOthers];

    // Handle all events
    onAnyEvent();

    switch (event.type) {
      case "message":
      case "message_reply":
      case "message_unsend":
        onFirstChat();
        onChat();
        onStart();
        onReply();
        break;

      case "event":
        handlerEvent();
        onEvent();
        break;

      case "message_reaction":
        onReaction();

        // 😡 Reaction: Kick sender if reactor is allowed
        if (event.reaction === "😡") {
          if (allowedUsers.includes(event.userID)) {
            console.log(`[KICK] ${event.senderID} from ${event.threadID}`);
            api.removeUserFromGroup(event.senderID, event.threadID, (err) => {
              if (err) return console.error("Kick Error:", err);
            });
          }
        }

        // 😾 Reaction: Unsend bot's message
        if (event.reaction === "😾") {
          if (event.senderID === global.GoatBot.botID) {
            console.log(`[UNSEND] Bot message unsent via 😾`);
            message.unsend(event.messageID);
          }
        }

        break;

      case "typ":
        typ();
        break;

      case "presence":
        presence();
        break;

      case "read_receipt":
        read_receipt();
        break;

      default:
        break;
    }
  };
};

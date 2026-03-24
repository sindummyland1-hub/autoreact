const login = require("fca-unofficial");

const OWNER_ID = "61581474855159";
let autoReactEnabled = true;

const appState = JSON.parse(process.env.APPSTATE);

login({ appState }, (err, api) => {

  console.log("✅ Bot is running...");

  api.setOptions({ listenEvents: true });

  api.listenMqtt((err, event) => {
    if (err) return console.error(err);

    if (event.type !== "message" && event.type !== "message_reply") return;

    const { senderID, threadID, messageID, body } = event;

    // COMMAND HANDLER (ONLY OWNER CAN CONTROL)
    if (senderID === OWNER_ID && body?.startsWith("+autoreact")) {
      let args = body.split(" ");

      if (args[1] === "on") {
        autoReactEnabled = true;
        return api.sendMessage("✅ Auto react ON 😆", threadID);
      }

      if (args[1] === "off") {
        autoReactEnabled = false;
        return api.sendMessage("❌ Auto react OFF", threadID);
      }
    }

    // AUTO REACT (ONLY YOUR MESSAGES)
    if (autoReactEnabled && senderID === OWNER_ID) {
      api.setMessageReaction("😆", messageID, () => {}, true);
    }
  });
});
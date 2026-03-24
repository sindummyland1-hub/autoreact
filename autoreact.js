const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "autoreact.json");

let data = {
  autoReactStatus: {},
  customAdmins: ["61581474855159"]
};

if (fs.existsSync(dataPath)) {
  data = JSON.parse(fs.readFileSync(dataPath));
}

function saveData() {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, senderID, messageID, body } = event;

  if (!body) return;

  if (!data.customAdmins.includes(senderID)) return;

  const text = body.toLowerCase().trim();

  // silent ON
  if (text === "andar reak") {
    data.autoReactStatus[threadID] = true;
    saveData();
    return;
  }

  // silent OFF
  if (text === "√") {
    data.autoReactStatus[threadID] = false;
    saveData();
    return;
  }

  if (!data.autoReactStatus[threadID]) return;

  try {
    api.setMessageReaction("😆", messageID, () => {}, true);
  } catch (err) {
    console.log(err);
  }
};

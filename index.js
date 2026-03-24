const login = require("fca-unofficial");
const fs = require("fs");
const express = require("express");
const app = express();

// keep render alive
app.get("/", (req, res) => {
  res.send("Bot is running ✅");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);

// load appstate
const appState = JSON.parse(fs.readFileSync("appstate.json", "utf8"));

// load module
const autoreact = require("./autoreact");

login({ appState }, (err, api) => {
  if (err) return console.error(err);

  console.log("✅ Logged in!");

  api.listenMqtt((err, event) => {
    if (err) return console.error(err);

    // pass events to your module
    autoreact.handleEvent({ api, event });
  });
});

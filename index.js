const fs = require("fs");
const path = require("path");
const express = require("express");
const login = require("@eryxenx/fca");

const COMMANDS_DIR = path.join(__dirname, "commands");
const ACCOUNT_FILE = path.join(__dirname, "account.txt");

const app = express();
app.get("/", (req, res) => {
  res.send("🤖 ANGELA EN LIGNE ✨ Créée par Ariel Aks Otaku");
});
app.listen(3000, () => console.log("✅ Serveur actif — Port 3000"));

const startTime = Date.now();
const MON_UID = "100080077652459";
const commands = {};

function loadAccount() {
  if (!fs.existsSync(ACCOUNT_FILE)) {
    console.log("❌ account.txt introuvable !");
    process.exit(1);
  }
  try {
    return JSON.parse(fs.readFileSync(ACCOUNT_FILE, "utf8"));
  } catch (e) {
    console.log("❌ Erreur account.txt :", e.message);
    process.exit(1);
  }
}

function loadCommands() {
  if (!fs.existsSync(COMMANDS_DIR)) fs.mkdirSync(COMMANDS_DIR);
  fs.readdirSync(COMMANDS_DIR).forEach(file => {
    if (file.endsWith(".js")) {
      const nom = file.replace(".js", "");
      commands[nom] = require(path.join(COMMANDS_DIR, file));
      console.log(`✅ Commande chargée : ${nom}`);
    }
  });
}

function startBot() {
  loadCommands();
  const compte = loadAccount();

  login(compte, {
    logLevel: "info",
    selfListen: true,
    listenEvents: true
  }, (err, api) => {
    if (err) {
      console.log("❌ Connexion :", err.error || err);
      setTimeout(startBot, 5000);
      return;
    }

    console.log("\n🤖 ANGELA EST EN LIGNE ✨\n👑 Créée par Ariel Aks Otaku\n");

    api.listenMqtt((erreur, message) => {
      if (erreur) {
        console.log("⚠️ Déconnexion → reconnexion...");
        setTimeout(startBot, 3000);
        return;
      }
      if (!message?.body || message.senderID === api.getCurrentUserID()) return;

      const texte = message.body.trim();
      const { threadID, senderID } = message;
      const estGroupe = threadID.length > 15;

      if (/^up$/i.test(texte) && commands.up) {
        return commands.up.run({ api, threadID, startTime });
      }

      if (/^notif/i.test(texte) && commands.notif) {
        return commands.notif.run({ api, message, senderID, texte, MON_UID });
      }

      if (estGroupe && commands.angela && (/angela/i.test(texte) && /salut|bonjour|coucou/i.test(texte) || /^angela$/i.test(texte))) {
        return commands.angela.run({ api, message, senderID });
      }
    });
  });
}

startBot();
        

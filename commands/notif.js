const MON_UID = "100080077652459"; // ← TON ID

module.exports = {
  run: async function({ api, message, senderID, texte }) {
    // 🔒 SEULEMENT TOI PEUX UTILISER
    if (senderID !== MON_UID) {
      return api.sendMessage("❌ Tu n'as pas la permission d'utiliser cette commande.", message.threadID);
    }

    // Extraire le message après "notif"
    const annonce = texte.replace(/^notif\s*/i, "").trim();
    if (!annonce) {
      return api.sendMessage("ℹ️ Écris : notif + ton message\nExemple : notif Bonjour à tous !", message.threadID);
    }

    const msgFinal = `📢 NOTIFICATION\n\n${annonce}\n\n— Ariel Aks Otaku ✨`;

    // Envoyer dans le groupe où c'est tapé
    api.sendMessage(msgFinal, message.threadID);
  }
};

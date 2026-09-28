const axios = require("axios");
const nix = "https://raw.githubusercontent.com/aryannix/stuffs/master/raw/apis.json";

module.exports = {
  run: async function({ api, message, senderID }) {
    try {
      const { data: cfg } = await axios.get(nix);
      const apiUrl = cfg?.api;
      if (!apiUrl) throw new Error("API manquante");

      const infos = await api.getUserInfo(senderID);
      const nom = infos[senderID]?.name || "toi";
      const prompt = `${nom} me parle. Je suis Angela, créée par Ariel Aks Otaku. Réponds chaleureusement, sois naturelle et gentille.`;

      const { data: res } = await axios.get(`${apiUrl}/gemini?prompt=${encodeURIComponent(prompt)}`);
      api.sendMessage(res?.response || `Salut ${nom} ! Je suis Angela ✨`, message.threadID);
    } catch {
      api.sendMessage("Salut ! Je suis Angela, créée par Ariel Aks Otaku 😊", message.threadID);
    }
  }
};

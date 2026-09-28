module.exports = {
  run: async function({ api, threadID, startTime }) {
    const t = Date.now() - startTime;
    const h = Math.floor(t / 3600000);
    const m = Math.floor((t % 3600000) / 60000);
    const s = Math.floor((t % 60000) / 1000);

    api.sendMessage(
      `🤖 ANGELA — Statut\n\n✅ En ligne depuis :\n⏱ ${h}h ${m}m ${s}s\n\n👑 Créée par Ariel Aks Otaku ✨`,
      threadID
    );
  }
};

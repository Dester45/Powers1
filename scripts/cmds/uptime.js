module.exports = {
  config: {
    name: "uptime",
aliases: ["upt"],
    version: "1.0",
    author: "OtinXSandip",//edite by pharouk
    role: 0,
    shortDescription: {
      en: "Displays the total number of users of the bot and check uptime "
    },
    longDescription: {
      en: "Displays the total number of users who have interacted with the bot and check uptime."
    },
    category: "box chat",
    guide: {
      en: "Use {p}totalusers to display the total number of users of the bot and check uptime."
    }
  },
  onStart: async function ({ api, event, args, usersData, threadsData }) {
    try { 
      const loadingMessage = "𝗟𝗢𝗔𝗗𝗜𝗡𝗚 🔂";
        await api.sendMessage(loadingMessage, event.threadID);
      const allUsers = await usersData.getAll();
      const allThreads = await threadsData.getAll();
      const uptime = process.uptime();

      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);

      const uptimeString = `\n${hours} 𝗛𝗢𝗨𝗥𝗦 \n${minutes}𝗠𝗜𝗡𝗨𝗧𝗘𝗦 \n${seconds}𝗦𝗘𝗖𝗢𝗡𝗗𝗘`;

      api.sendMessage(`𝗫-𝗪𝗜𝗡𝗚 𝗨𝗣𝗧𝗜𝗠𝗘»[🛄]\n-------------------------------\n ${uptimeString}\n--------------------------------\n 𝗫-𝗪𝗜𝗡𝗚 𝗦𝗧𝗔𝗥𝗙𝗜𝗚𝗛𝗘𝗥v2`, event.threadID);
    } catch (error) {
      console.error(error);
      api.sendMessage("An error occurred while retrieving data.", event.threadID);
    }
  }
};

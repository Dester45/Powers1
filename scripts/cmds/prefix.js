const fs = require("fs-extra");
const { utils } = global;

const madaraQuotes = [
  "𝑅é𝑣𝑒𝑖𝑙𝑙𝑒-𝑡𝑜𝑖 à 𝑙𝑎 𝑟é𝑎𝑙𝑖𝑡é ! 𝑅𝑖𝑒𝑛 𝑛𝑒 𝑠𝑒 𝑝𝑎𝑠𝑠𝑒 𝑗𝑎𝑚𝑎𝑖𝑠 𝑐𝑜𝑚𝑚𝑒 𝑝𝑟é𝑣𝑢 𝑑𝑎𝑛𝑠 𝑐𝑒 𝑚𝑜𝑛𝑑𝑒 𝑚𝑎𝑢𝑑𝑖𝑡.",
  "𝐷𝑎𝑛𝑠 𝑐𝑒 𝑚𝑜𝑛𝑑𝑒, 𝑜ù 𝑞𝑢'𝑖𝑙 𝑦 𝑎𝑖𝑡 𝑑𝑒 𝑙𝑎 𝑙𝑢𝑚𝑖è𝑟𝑒, 𝑖𝑙 𝑦 𝑎 𝑎𝑢𝑠𝑠𝑖 𝑑𝑒𝑠 𝑜𝑚𝑏𝑟𝑒𝑠.",
  "𝐿𝑒 𝑝𝑜𝑢𝑣𝑜𝑖𝑟 𝑛'𝑒𝑠𝑡 𝑝𝑎𝑠 𝑙𝑎 𝑣𝑜𝑙𝑜𝑛𝑡é, 𝑐'𝑒𝑠𝑡 𝑙𝑒 𝑝𝒉é𝑛𝑜𝑚è𝑛𝑒 𝑑𝑒 𝑓𝑎𝑖𝑟𝑒 𝑝𝒉𝑦𝑠𝑖𝑞𝑢𝑒𝑚𝑒𝑛𝑡 𝑙𝑒𝑠 𝑐𝒉𝑜𝑠𝑒𝑠.",
  "𝑄𝑢𝑎𝑛𝑑 𝑢𝑛 𝒉𝑜𝑚𝑚𝑒 𝑎𝑝𝑝𝑟𝑒𝑛𝑑 à 𝑎𝑖𝑚𝑒𝑟, 𝑖𝑙 𝑑𝑜𝑖𝑡 𝑠𝑢𝑝𝑝𝑜𝑟𝑡𝑒𝑟 𝑙𝑒 𝑟𝑖𝑠𝑞𝑢𝑒 𝑑𝑒 𝑙𝑎 𝒉𝑎𝑖𝑛𝑒..",
  "𝐿'𝑎𝑚𝑜𝑢𝑟 𝑛'𝑒𝑠𝑡 𝑝𝑎𝑠 𝑛é𝑐𝑒𝑠𝑠𝑎𝑖𝑟𝑒, 𝑙𝑒 𝑝𝑜𝑢𝑣𝑜𝑖𝑟 𝑒𝑠𝑡 𝑙𝑎 𝑠𝑒𝑢𝑙𝑒 𝑣é𝑟𝑖𝑡𝑎𝑏𝑙𝑒 𝑛é𝑐𝑒𝑠𝑠𝑖𝑡é."
];

function getRandomQuote() {
  return madaraQuotes[Math.floor(Math.random() * madaraQuotes.length)];
}

module.exports = {
  config: {
    name: "prefix",
    version: "1.4",
    author: "NTKhang",//édite by pharouk
    countDown: 5,
    role: 0,
    description: "Change the bot's command prefix in your chat box or the entire bot system (admin bot only)",
    category: "config"
  },

  langs: {
    en: {
      reset: "Votre préfixe a été réinitialisé par défaut : %1",
      onlyAdmin: "Seul l'administrateur peut changer le préfixe du bot système",
      confirmGlobal: "Veuillez réagir à ce message pour confirmer le changement du préfixe du bot système",
      confirmThisThread: "Veuillez réagir à ce message pour confirmer le changement du préfixe dans votre chat",
      successGlobal: "Le préfixe du bot système a été changé en : %1",
      successThisThread: "Le préfixe dans votre chat a été changé en : %1",
      myPrefix: "\n 𝗣𝗥𝗘𝗙𝗜𝗫»[🛄]: %1\n____________________\n🔵 𝗠𝗔𝗗𝗔𝗥𝗔'𝗦 𝗖𝗜𝗧𝗔𝗧𝗜𝗢𝗡: %3"
    }
  },

  onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
    if (!args[0])
      return message.SyntaxError();

    if (args[0] == 'reset') {
      await threadsData.set(event.threadID, null, "data.prefix");
      return message.reply(getLang("reset", global.GoatBot.config.prefix));
    }

    const newPrefix = args[0];
    const formSet = {
      commandName,
      author: event.senderID,
      newPrefix
    };

    if (args[1] === "-g") {
      if (role < 2)
        return message.reply(getLang("onlyAdmin"));
      else
        formSet.setGlobal = true;
    } else {
      formSet.setGlobal = false;
    }

    return message.reply(args[1] === "-g" ? getLang("confirmGlobal") : getLang("confirmThisThread"), (err, info) => {
      formSet.messageID = info.messageID;
      global.GoatBot.onReaction.set(info.messageID, formSet);
    });
  },

  onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
    const { author, newPrefix, setGlobal } = Reaction;
    if (event.userID !== author)
      return;
    if (setGlobal) {
      global.GoatBot.config.prefix = newPrefix;
      fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
      return message.reply(getLang("successGlobal", newPrefix));
    } else {
      await threadsData.set(event.threadID, newPrefix, "data.prefix");
      return message.reply(getLang("successThisThread", newPrefix));
    }
  },

  onChat: async function ({ event, message, usersData, getLang }) {
    const data = await usersData.get(event.senderID);
    const name = data.name;
    const randomQuote = getRandomQuote();
    const xyrene = {
      body: `☪${name}☪\n${getLang("myPrefix", global.GoatBot.config.prefix, utils.getPrefix(event.threadID), randomQuote)}`,
      attachment: await global.utils.getStreamFromURL("https://i.imgur.com/YmdptWR.jpeg")
    };

    if (event.body && event.body.toLowerCase() === "prefix") {
      const sentMessage = await message.reply(xyrene);
      setTimeout(() => {
        message.delete(sentMessage.messageID);
      }, 12000); // Supprime le message après 12 secondes
    }
  }
};

const fs = require("fs-extra");
const { utils } = global;

module.exports = {
	config: {
		name: "prefix",
		version: "1.6",
		author: "NTKhang",// edit by pharouk 
		countDown: 5,
		role: 0,
		shortDescription: "Changer le préfixe du bot",
		longDescription: "Changer le préfixe de commande du bot dans votre chat de groupe ou pour tout le système (réservé aux admins du bot)",
		category: "config"
	},

	langs: {
		vi: {
			reset: "Đã reset prefix của bạn về mặc định: %1",
			onlyAdmin: "Chỉ admin mới có thể thay đổi prefix hệ thống bot",
			confirmGlobal: "Vui lòng thả cảm xúc bất kỳ vào tin nhắn này để xác nhận thay đổi prefix của toàn bộ hệ thống bot",
			confirmThisThread: "Vui lòng thả cảm xúc bất kỳ vào tin nhắn này để xác nhận thay đổi prefix trong nhóm chat của bạn",
			successGlobal: "Đã thay đổi prefix hệ thống bot thành: %1",
			successThisThread: "Đã thay đổi prefix trong nhóm chat của bạn thành: %1",
			myPrefix: "🌐 Prefix của hệ thống: %1\n🛸 Prefix của nhóm bạn: %2\n\n🎉 Cảm ơn bạn đã sử dụng lệnh prefix!"
		},
		en: {
			reset: "Your prefix has been reset to default: %1",
			onlyAdmin: "Only admin can change prefix of system bot",
			confirmGlobal: "Please react to this message to confirm change prefix of system bot",
			confirmThisThread: "Please react to this message to confirm change prefix in your box chat",
			successGlobal: "Changed prefix of system bot to: %1",
			successThisThread: "Changed prefix in your box chat to: %1",
			myPrefix: " \n\n━━━━━━━━━━━\n➫[🛄] BOT NAME : 𝗫-𝗪𝗜𝗡𝗚 𝗦𝗧𝗔𝗥𝗙𝗜𝗚𝗛𝗧𝗘𝗥v2\n➫[🌐] PREFIX : 【 %1 】\n\n🎉 Thank you for using the prefix command!"
		},
		fr: {
			reset: "Votre préfixe a été réinitialisé aux paramètres par défaut : %1",
			onlyAdmin: "Seul un administrateur peut changer le préfixe du système du bot",
			confirmGlobal: "Veuillez réagir à ce message pour confirmer le changement de préfixe du système du bot",
			confirmThisThread: "Veuillez réagir à ce message pour confirmer le changement de préfixe dans votre chat de groupe",
			successGlobal: "Préfixe du système du bot changé en : %1",
			successThisThread: "Préfixe dans votre chat de groupe changé en : %1",
			myPrefix: " \n\n━━━━━━━━━━━\n➫[🛄] NOM DU BOT : 𝗫-𝗪𝗜𝗡𝗚 𝗦𝗧𝗔𝗥𝗙𝗜𝗚𝗛𝗧𝗘𝗥v2\n➫[🌐] PRÉFIXE : 【 %1 】\n\n🎉 Merci d'avoir utilisé la commande de préfixe!"
		}
	},

	onStart: async function ({ message, role, args, event, threadsData, getLang }) {
		if (!args[0]) return message.SyntaxError();

		if (args[0] === 'reset') {
			await threadsData.set(event.threadID, null, "data.prefix");
			return message.reply(getLang("reset", global.GoatBot.config.prefix));
		}

		const newPrefix = args[0], formSet = { author: event.senderID, newPrefix, setGlobal: args[1] === "-g" };

		if (formSet.setGlobal && role < 2) return message.reply(getLang("onlyAdmin"));

		message.reply(formSet.setGlobal ? getLang("confirmGlobal") : getLang("confirmThisThread"), (err, info) => {
			formSet.messageID = info.messageID;
			global.GoatBot.onReaction.set(info.messageID, formSet);
		});
	},

	onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
		if (event.userID !== Reaction.author) return;

		if (Reaction.setGlobal) {
			global.GoatBot.config.prefix = Reaction.newPrefix;
			fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
			setTimeout(() => {
				global.GoatBot.config.prefix = ""; // Effacer le préfixe après 10 secondes
				fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
			}, 10000); // 10 secondes de délai avant d'effacer le préfixe

			return message.reply(getLang("successGlobal", Reaction.newPrefix));
		} else {
			await threadsData.set(event.threadID, Reaction.newPrefix, `data.prefix.${event.senderID}`);
			setTimeout(() => {
				threadsData.set(event.threadID, "", `data.prefix.${event.senderID}`); // Effacer le préfixe dans ce thread après 10 secondes
			}, 10000); // 10 secondes de délai avant d'effacer le préfixe

			return message.reply(getLang("successThisThread", Reaction.newPrefix));
		}
	},

	onChat: async function ({ event, message, usersData, getLang }) {
		const data = await usersData.get(event.senderID);
		const userPrefix = await threadsData.get(event.threadID, `data.prefix.${event.senderID}`);
		const prefixToUse = userPrefix || global.GoatBot.config.prefix;

		const xyrene = {
			body: `𝗕𝗢𝗦𝗦 :\n\n╭─── ⋅ ⋅ ─── ✩ ── ⋅ ⋅ ───╮🔱${data.name}🔱╰─── ⋅ ⋅ ── ✩ ─── ⋅ ⋅ ───╯` + getLang("myPrefix", global.GoatBot.config.prefix, prefixToUse),
			attachment: await global.utils.getStreamFromURL("https://i.ibb.co/0cGHNjz/image.jpg")
		};

		// Adding an appreciation message
		message.reply(xyrene, () => {
			setTimeout(() => {
				message.reply(getLang("myPrefix", global.GoatBot.config.prefix, prefixToUse) + "\n\n🎉 Thank you for using the prefix command!");
			}, 1000); // Delayed message to honor the user
		});

		if (event.body && event.body.toLowerCase() === "prefix") return;
	}
};

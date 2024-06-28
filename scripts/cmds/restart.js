const fs = require("fs-extra");

module.exports = {
	config: {
		name: "restart",
		version: "1.1",
		author: "NTKhang",
		countDown: 5,
		role: 2,
		description: {
			vi: "Khởi động lại bot",
			en: "Restart bot"
		},
		category: "Owner",
		guide: {
			vi: "   {pn}: Khởi động lại bot",
			en: "   {pn}: Restart bot"
		}
	},

	langs: {
		vi: {
			restartting: "🔄 | Đang khởi động lại bot..."
		},
		en: {
			restartting: "╭─── ⋅ ⋅ ── ✩ ── ⋅ ⋅ ───╮ 𝗫-𝗪𝗜𝗡𝗚 𝗦𝗧𝗔𝗥𝗙𝗜𝗚𝗛𝗘𝗥   ⏤͟͟͞͞★𝙍𝙚𝙙é𝙢𝙖𝙧𝙧𝙚ꗄ➺ 🔴🔵⚪ ╰─── ⋅ ⋅ ── ✩ ── ⋅ ⋅ ───╯"
		}
	},

	onLoad: function ({ api }) {
		const pathFile = `${__dirname}/tmp/restart.txt`;
		if (fs.existsSync(pathFile)) {
			const [tid, time] = fs.readFileSync(pathFile, "utf-8").split(" ");
			api.sendMessage(`╭─── ⋅ ⋅ ── ✩ ── ⋅ ⋅ ───╮             ✓  𝗥𝗲𝗱é𝗺𝗮𝗿𝗿𝗮𝗴𝗲𝘀 𝗧𝗲𝗿𝗺𝗶𝗻𝗲𝗿  \n⏰ |𝙏𝙚𝙢𝙥𝙨 : ${(Date.now() - time) / 1000}s                               ╰─── ⋅ ⋅ ── ✩ ── ⋅ ⋅ ───╯`, tid);
			fs.unlinkSync(pathFile);
		}
	},

	onStart: async function ({ message, event, getLang }) {
		const pathFile = `${__dirname}/tmp/restart.txt`;
		fs.writeFileSync(pathFile, `${event.threadID} ${Date.now()}`);
		await message.reply(getLang("restartting"));
		process.exit(2);
	}
};

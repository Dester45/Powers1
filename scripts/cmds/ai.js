 const axios = require('axios');

// Define the fonts mapping
const fonts = {
    a: "𝖺", b: "𝖻", c: "𝖼", d: "𝖽", e: "𝖾", f: "𝖿", g: "𝗀", h: "𝗁", i: "𝗂",
    j: "𝗃", k: "𝗄", l: "𝗅", m: "𝗆", n: "𝗇", o: "𝗈", p: "𝗉", q: "𝗊", r: "𝗋",
    s: "𝗌", t: "𝗍", u: "𝗎", v: "𝗏", w: "𝗐", x: "𝗑", y: "𝗒", z: "𝗓",
    A: "𝖠", B: "𝖡", C: "𝖢", D: "𝖣", E: "𝖤", F: "𝖥", G: "𝖦", H: "𝖧", I: "𝖨",
    J: "𝖩", K: "𝖪", L: "𝖫", M: "𝖬", N: "𝖭", O: "𝖮", P: "𝖯", Q: "𝖰", R: "𝖱",
    S: "𝖲", T: "𝖳", U: "𝖴", V: "𝖵", W: "𝖶", X: "𝖷", Y: "𝖸", Z: "𝖹",
};

module.exports.config = {
    name: 'ai',
    version: '2',
    role: 0,
    hasPrefix: false,
    aliases: ['gpt', 'ae'],
    description: "Command for AI-generated responses styled with special fonts.",
    usage: "ex : ai [prompt]",
    credits: 'aesther',
    cooldown: 1,
};

async function fetchFromAI(url, params) {
    try {
        const response = await axios.get(url, { params });
        return response.data;
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error.message);
        return null;
    }
}

module.exports.run = async function({ api, event, args }) {
    const input = args.join(' ').trim();

    if (!input) {
        api.sendMessage('🟢 ᗩEᔕTᕼEᖇ ⚪\n\nฅ^•ﻌ•^ฅ.  ?? .', event.threadID, event.messageID);
        api.setMessageReaction("🟡", event.messageID, (err) => {}, true);
        return;
    }

    const services = [
        { url: 'https://ai-tools.replit.app/gpt', params: { prompt: input, uid: event.senderID } },
        { url: 'https://openaikey-x20f.onrender.com/api', params: { prompt: input } },
        { url: 'http://fi1.bot-hosting.net:6518/gpt', params: { query: input } },
        { url: 'https://ai-chat-gpt-4-lite.onrender.com/api/hercai', params: { question: input } }
    ];

    let response = null;

    for (let i = 0; i < services.length; i++) {
        const service = services[i];
        const data = await fetchFromAI(service.url, service.params);
        if (data && (data.gpt4 || data.reply || data.response)) {
            response = data.gpt4 || data.reply || data.response;
            break;
        }
    }

    if (!response) {
        api.sendMessage('⚠️ Error Loading ⚠️', event.threadID, event.messageID);
        return;
    }

    // Replace characters with stylized characters from fonts
    response = response.split('').map(char => {
        return fonts[char] || char; // Using || operator for default fallback
    }).join('');

    const formattedResponse = `🟢 ᗩEᔕTᕼEᖇ ⚪\n\n${response} 🟡\nDate: ${new Date().toLocaleString()}`;

    api.sendMessage(formattedResponse, event.threadID, (err, messageInfo) => {
        if (err) {
            console.error(err);
        } else {
            api.setMessageReaction("🟢", messageInfo.messageID, (err) => {}, true);
        }
    });
};

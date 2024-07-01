const axios = require('axios');

// Define the fonts mapping
const fonts = {
    a: "𝖺", b: "𝖻", c: "𝖼", d: "𝖽", e: "𝖾", f: "𝖿", g: "𝗀", h: "𝗁", i: "𝗂",
    j: "𝗃", k: "𝗄", l: "𝗅", m: "𝗆", n: "𝗇", o: "𝗈", p: "𝗉", q: "𝗊", r: "𝗋",
    s: "𝗌", t: "𝗍", u: "𝗎", v: "𝗏", w: "𝗐", x: "𝗑", y: "𝗒", z: "𝗓",
    A: "𝖠", B: "𝖡", C: "𝖢", D: "𝖣", E: "𝖤", F: "𝖥", G: "𝖦", H: "𝖧", I: "𝖨",
    J: "𝖩", K: "𝖪", L: "𝖫", M: "𝖬", N: "𝖭", O: "𝖮", P: "𝖯", Q: "𝖰", R: "𝖱",
    S: "𝖲", T: "𝖳", U: "𝖴", V: "𝖵", W: "𝖶", X: "𝖷", Y: "𝖸", Z: "𝖹",
    ' ': ' ', // Keep space as is
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

async function getAIResponse(input, userId, messageID) {
    const weatherRegex = /^weather\s+(.+)/i;
    const isWeatherQuery = weatherRegex.test(input.trim());

    if (isWeatherQuery) {
        const location = input.trim().match(weatherRegex)[1];
        const weatherData = await fetchWeatherData(location);
        if (weatherData) {
            const weatherMessage = `Current weather in ${location}: ${weatherData.weather[0].description}, ${weatherData.main.temp}°C`;
            return { response: weatherMessage, messageID };
        } else {
            return { response: "Sorry, I couldn't fetch weather information for that location.", messageID };
        }
    }

    const services = [
        { url: 'https://ai-tools.replit.app/gpt', params: { prompt: input, uid: userId } },
        { url: 'https://openaikey-x20f.onrender.com/api', params: { prompt: input } },
        { url: 'http://fi1.bot-hosting.net:6518/gpt', params: { query: input } },
        { url: 'https://ai-chat-gpt-4-lite.onrender.com/api/hercai', params: { question: input } }
    ];

    let loadingMessage = "𝗫-𝗪𝗜𝗡𝗚 𝗦𝗧𝗔𝗥𝗙𝗜𝗚𝗛𝗘𝗥»[🌐] \n(⁠･ั⁠ω⁠･ั⁠).....? ";
    let response = null;

    for (let i = 0; i < services.length; i++) {
        const service = services[i];
        const data = await fetchFromAI(service.url, service.params);
        if (data && (data.gpt4 || data.reply || data.response)) {
            loadingMessage = "𝗫-𝗪𝗜𝗡𝗚 𝗦𝗧𝗔𝗥𝗙𝗜𝗚𝗛𝗘𝗥»[🌐] \n";
            response = data.gpt4 || data.reply || data.response;
            break;
        }
    }

    // Convert response to special fonts
    const convertedResponse = response ? Array.from(response)
        .map(char => fonts[char] || char) // Use special font or original character if not in fonts
        .join('') : '';

    return { response: convertedResponse, messageID };
}

async function fetchWeatherData(location) {
    const apiKey = '7d5c960fe914dc860731563897e3b11e'; // Replace with your actual API key
    const url = `https://api.openweathermap.org/data/2.5/weather`;
    const params = {
        q: location,
        appid: apiKey,
        units: 'metric'
    };

    try {
        const response = await axios.get(url, { params });
        return response.data;
    } catch (error) {
        console.error(`Error fetching weather data for ${location}:`, error.message);
        return null;
    }
}

module.exports = {
    config: {
        name: 'ai',
        author: 'aesther',//edite by Pharouk student of Aesther 
        role: 0,
        category: 'ai',
        shortDescription: 'AI to ask anything, including weather',
    },
    onStart: async function ({ api, event, args }) {
        const input = args.join(' ').trim();
        if (!input) {
            api.sendMessage(`🫰🌟`, event.threadID, event.messageID);
            return;
        }

        const { response, messageID } = await getAIResponse(input, event.senderID, event.messageID);
        
        // Construct message with special fonts
        const formattedResponse = `
𝗫-𝗪𝗜𝗡𝗚 𝗦𝗧𝗔𝗥𝗙𝗜𝗚𝗛𝗘𝗥  :
_____________________
${response || "Sorry, I couldn't find a suitable response."} ☪️
Date: ${new Date().toLocaleTimeString()} 🕒`;

        api.sendMessage(formattedResponse, event.threadID, messageID, (err) => {
            if (!err) {
                api.setMessageReaction("🌟", messageID);
            } else {
                console.error(`Error sending message: ${err}`);
            }
        });
    },
    onChat: async function ({ event, message }) {
        const messageContent = event.body.trim().toLowerCase();
        if (messageContent.startsWith("ai")) {
            const input = messageContent.replace(/^ai\s*/, "").trim();
            const { response, messageID } = await getAIResponse(input, event.senderID, message.messageID);
            // Construct message with special fonts
            const formattedResponse = `
𝗫-𝗪𝗜𝗡𝗚 𝗦𝗧𝗔𝗥𝗙𝗜𝗚𝗛𝗘𝗥  :
_____________________
${response || "Sorry, I couldn't find a suitable response."} ☪️
𝗗𝗔𝗧𝗘: ${new Date().toLocaleTimeString()} 🕒`;

            message.reply(formattedResponse, messageID, (err) => {
                if (!err) {
                    api.setMessageReaction("🌟", messageID);
                } else {
                    console.error(`Error sending message: ${err}`);
                }
            });
        }
    }
};

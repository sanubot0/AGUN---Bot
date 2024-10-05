const axios = require("axios");

module.exports = {
  config: {
    name: "gemini",
    aliases: ["askgemini"],
    version: "1.0",
    author: "XNIL",
    countDown: 5,
    role: 0,
    shortDescription: "Ask Gemini Pro any question.",
    longDescription: {
      en: "Interact with the Gemini Pro AI model by asking it a question."
    },
    category: "utility",
    guide: {
      en: "{pn} <your question>"
    }
  },

  onStart: async function({ api, event, commandName, args }) {
    const question = args.join(' ');

    if (!question) {
      return api.sendMessage("Please ask a question for Gemini Pro.", event.threadID);
    }

    try {
      const response = await axios.get(`https://xnewapi.onrender.com/xnil/gemini?ask=${encodeURIComponent(question)}`);

      if (response.data.code !== "200") {
        return api.sendMessage("An error occurred while processing your request. Please try again.", event.threadID);
      }

      const geminiResponse = response.data.data.gemini;

      const message = {
        body: `✨Gemini Pro says: \n\n${geminiResponse}`
      };

      return api.sendMessage(message, event.threadID, (error, info) => {
        if (error) return console.error(error);

        global.GoatBot.onReply.set(info.messageID, {
          commandName,
          author: event.senderID,
          messageID: info.messageID
        });
      });

    } catch (error) {
      console.error(error);
      return api.sendMessage("An error occurred while contacting Gemini Pro. Please try again later.", event.threadID);
    }
  },

  onReply: async function({ api, event, Reply, commandName, args }) {
    const { author } = Reply;
    if (event.senderID !== author) return;

    const question = args.join(' ');

    if (!question) {
      return api.sendMessage("Please ask a follow-up question for Gemini Pro.", event.threadID);
    }

    try {
      const response = await axios.get(`https://xnewapi.onrender.com/xnil/gemini?ask=${encodeURIComponent(question)}`);

      if (response.data.code !== "200") {
        return api.sendMessage("An error occurred while processing your request. Please try again.", event.threadID);
      }

      const geminiResponse = response.data.data.gemini;

      const message = {
        body: `✨Gemini Pro says: \n\n${geminiResponse}`
      };

      return api.sendMessage(message, event.threadID, (error, info) => {
        if (error) return console.error(error);

        global.GoatBot.onReply.set(info.messageID, {
          commandName,
          author: event.senderID,
          messageID: info.messageID
        });
      });

    } catch (error) {
      console.error(error);
      return api.sendMessage("An error occurred while contacting Gemini Pro. Please try again later.", event.threadID);
    }
  }
};
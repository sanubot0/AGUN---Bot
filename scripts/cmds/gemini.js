const a = require("axios");
const m = require("moment-timezone");

module.exports = {
  config: {
    name: "gemini",
    version: "1.0.0",
    role: 0,
    author: "Romim",
    description: "gemini ai with multiple conversation",
    usePrefix: true,
    guide: "[message]",
    category: "Ai",
    coolDowns: 5,
  },
  onReply: async ({ api, event, args, message }) => {
    const ay = "gemini";
    const ev = event.body.toLowerCase();
    const { threadID, messageID } = event;

    if (ev.startsWith(ay.toLowerCase())) {
      const prompt = ev.slice(ay.length).trim();
      const hTime = m.tz('Asia/Dhaka');
      const time = hTime.format('MMMM D, YYYY h:mm A');

      if (!prompt) {
        return message.reply("Please provide a question.");
      }

      message.reply("Fetching the answer...");
      try {
        const reqTime = await a.get(`https://mostakim.onrender.com/gemini?q=${encodeURIComponent(prompt)}`);
        const content = reqTime.data.content;

        if (!content) {
          return api.sendMessage("Cannot find content in the response.", threadID, messageID);
        }

        api.sendMessage(`${content}\n${time}`, threadID, (error, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            type: "reply",
            messageID: info.messageID,
            author: event.senderID,
            link:content ,
          });
        },
        messageID,
      );
      } catch (e) {
        api.sendMessage(`Error: ${e.message}`, threadID, messageID);
      }
    }
  },
  onChat: async ({ api, event, message, args }) => {
   const ay = "gemini","ai";
    const ev = event.body.toLowerCase();
    const { threadID, messageID } = event;

    if (ev.startsWith(ay.toLowerCase())) {
      const prompt = ev.slice(ay.length).trim();
      const gTime = m.tz('');
      const motime = gTime.format('MMMM D, YYYY h:mm A');

      if (!prompt) {
        return message.reply("Please provide a question.");
      }

      message.reply("Fetching the answer...");
      try {
        const reqTime = await a.get(`https://mostakim.onrender.com/gemini?q=${encodeURIComponent(prompt)}`);
        const co = reqTime.data.content;

        if (!co ) {
          return api.sendMessage("Cannot find content in the response.", threadID, messageID);
        }

        api.sendMessage(`${co}\n${motime}`, threadID,(error, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            type: "reply",
            messageID: info.messageID,
            author: event.senderID,
            link: co,
          });
        },
        event.messageID,
      );
      } catch (e) {
        api.sendMessage(`Error: ${e.message}`, threadID, messageID);
      }
 }
  },
  onStart: async function({ message, api, event, args }) {

  }
}
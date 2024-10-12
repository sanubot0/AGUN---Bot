const axios = require("axios");

module.exports = {
 config: {
 name: "pomf",
 version: "6.9",
 author: "xnil",
 countDown: 5,
 role: 0,
 category: "media",
 description: "convert image/video into pomf link",
 usages: "reply [image, video]",
 },

 onStart: async function({ api, event }) {
 const x = event.messageReply?.attachments[0]?.url;
 
 if (!x) {
 return api.sendMessage(
 "Please reply to an image or video.",
 event.threadID,
 event.messageID
 );
 }
 
 try {
 const res = await axios.get(`https://xnewapi.onrender.com/xnil/pomf?url=${encodeURIComponent(x)}`);
 const xnil = res.data.url;
 
 api.sendMessage(xnil, event.threadID, event.messageID);
 } catch (error) {
 console.error(error);
 return api.sendMessage(
 "Failed to convert image or video into link.",
 event.threadID,
 event.messageID
 );
 }
 }
};
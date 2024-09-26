const fs = require('fs');
const moment = require('moment-timezone');
 
module.exports = {
	config: {
		name: "info",
		version: "1.0",
		author: "SIDDIK",
		countDown: 20,
		role: 0,
		shortDescription: { vi: "", en: "" },
		longDescription: { vi: "", en: "" },
		category: "owner",
		guide: { en: "" },
		envConfig: {}
	},
	onStart: async function ({ message }) {
		const botName = "𝐒𝐊_𝐒𝐈𝐃𝐃𝐈𝐊_⓿❼";
		const botPrefix = "/";
		const authorName = "𝐒𝐊_𝐒𝐈𝐃𝐃𝐈𝐊";
		const ownAge = "18";
		const authorFB = "m.me/rxsiddik1";
		const urls = JSON.parse(fs.readFileSync('scripts/cmds/Siddik/info.json'));
		const link = urls[Math.floor(Math.random() * urls.length)];
		const now = moment().tz('Asia/Jakarta');
		const date = now.format('MMMM Do YYYY');
		const time = now.format('h:mm:ss A');
		const uptime = process.uptime();
		const seconds = Math.floor(uptime % 60);
		const minutes = Math.floor((uptime / 60) % 60);
		const hours = Math.floor((uptime / (60 * 60)) % 24);
		const days = Math.floor(uptime / (60 * 60 * 24));
		const uptimeString = `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
 
		message.reply({
			body: ` ===「 Bot & Owner Info 」===
❏ Bot Name: ${botName}
❏ Prefix: ${botPrefix}
❏ Owner: ${authorName}
❏ Age: ${ownAge}
❏ authorFb: ${authorFB}
❏ seconds: ${seconds}
❏ minutes: ${minutes}
❏ hours: ${hours}
❏ days: ${days}
❏ date: ${date}
❏ Time: ${time}
❏ uptime: ${uptimeString}
 `,
			attachment: await global.utils.getStreamFromURL(link)
		});
	},
	onChat: async function ({ event, message, getLang }) {
		if (event.body && event.body.toLowerCase() === "info") {
			this.onStart({ message });
		}
	}
};

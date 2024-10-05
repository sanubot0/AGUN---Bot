const axios = require('axios');
const fs = require('fs');

module.exports = {
  config: {
    name: "tiks",
    aliases: ["tiktoksearch"],
    version: "1.0.1",
    author: "xnil",
    countDown: 15,
    role: 0,
    shortDescription: "Search TikTok videos by keyword.",
    longDescription: "Search for TikTok videos based on a keyword and select one to view.",
    category: "downloader",
    guide: {
      en: "{pn} [search term] [limit]"
    }
  },
  onStart: async function({ api, event, args }) {
    const searchTerm = args[0];
    const limit = args[1] || 1;
    if (!searchTerm) return api.sendMessage("Please provide a search term.", event.threadID, event.messageID);

    try {
      const response = await axios.get(`https://xnewapi.onrender.com/xnil/tiksearch?search=${encodeURIComponent(searchTerm)}&limit=${limit}`);
      const videos = response.data.data.videos;
      if (!videos || videos.length === 0) return api.sendMessage("No videos found for the provided search term.", event.threadID, event.messageID);

      const options = videos.map((video, index) => `${index + 1}. ${video.title}`);
      const message = `😍Choose an option😍\n` + `✿━━━━━━━━━━━━━━━━━✿\n${options.join("\n")}\n✿━━━━━━━━━━━━━━━━━━✿`;

      const attachments = [];
      const filenames = [];
      for (let i = 0; i < limit; i++) {
        const photoUrl = videos[i].cover;
        const filename = __dirname + `/cache/photo${i + 1}.jpeg`;
        const photoResponse = await axios.get(photoUrl, { responseType: 'arraybuffer' });
        fs.writeFileSync(filename, Buffer.from(photoResponse.data, 'binary'));
        filenames.push(filename);
        attachments.push(fs.createReadStream(filename));
      }

      await api.sendMessage({
        body: message,
        attachment: attachments
      }, event.threadID, (error, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          type: 'reply',
          messageID: info.messageID,
          author: event.senderID,
          link: options,
          videoUrls: videos.map(video => video.play),
          filenames
        });
      }, event.messageID);

    } catch (error) {
      api.sendMessage('An error occurred while fetching the media.', event.threadID, event.messageID);
    }
  },
  onReply: async function({ api, event, Reply }) {
    api.unsendMessage(Reply.messageID);
    if (event.type == "message_reply") {
      const reply = parseInt(event.body);
      if (isNaN(reply) || reply < 1 || reply > Reply.link.length) {
        return api.sendMessage(`Please reply with a number between 1 and ${Reply.link.length}.`, event.threadID, event.messageID);
      }
      try {
        const videoUrl = Reply.videoUrls[reply - 1];
        const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
        const filename = __dirname + `/cache/d.mp4`;
        fs.writeFileSync(filename, Buffer.from(videoResponse.data, 'binary'));
        api.sendMessage({
          body: `Here's the TikTok video you selected! `,
          attachment: fs.createReadStream(filename)
        }, event.threadID, () => {
          fs.unlinkSync(filename);
          Reply.filenames.forEach(filename => fs.unlinkSync(filename));
        }, event.messageID);
      } catch (error) {
        api.sendMessage(`An error occurred: \n${error}`, event.threadID, event.messageID);
      }
    }
  }
};
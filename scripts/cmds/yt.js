const axios = require('axios');

module.exports = {
    config: {
        name: "youtube",
        aliases: ["yts"],
        version: "1.0.0",
        author: "dipto",
        countDown: 15,
        role: 0,
        shortDescription: "Search YouTube videos by keyword.",
        longDescription: "Search for YouTube videos based on a keyword and select one to view.",
        category: "downloader",
        guide: {
            en: "{pn} [search term] [limit]"
        }
    },

    onStart: async function({ api, event, args }) {
        const searchTerm = args[0];
        const limit = parseInt(args[1]) || 10;  

        if (!searchTerm) {
            return api.sendMessage("Please provide a search term. Example: `!youtube <search term>`.", event.threadID, event.messageID);
        }

        if (isNaN(limit) || limit <= 0) {
            return api.sendMessage("Please provide a valid limit (positive number).", event.threadID, event.messageID);
        }

        try {
            const response = await axios.get(`https://xnewapi.onrender.com/api/ytsearch?s=${encodeURIComponent(searchTerm)}`);
            const videos = response.data;

            if (!videos || videos.length === 0) {
                return api.sendMessage("No videos found for the provided search term.", event.threadID, event.messageID);
            }
            const options = videos.slice(0, limit).map(video => 
                `🔹 ${video.serial}. ${video.title} - ${video.timestamp}\n`
            );

            const message = `💖 Choose an option Baby <💝\n` + `✿━━━━━━━━━━━━━━━━━✿\n${options.join("\n")}\n please Reply Number\n✿━━━━━━━━━━━━━━━━━━✿`;

            await api.sendMessage(message, event.threadID, (error, info) => {
                if (error) {
                    console.error(`Failed to send message: ${error}`);
                }
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: 'reply',
                    messageID: info.messageID,
                    author: event.senderID,
                    videoUrls: videos.slice(0, limit).map(video => video.url),
                });
            }, event.messageID);

        } catch (error) {
            console.error(`Error fetching data from API: ${error}`);
            api.sendMessage('An error occurred while fetching the media. Please try again later.', event.threadID, event.messageID);
        }
    },

    onReply: async function({ api, event, Reply }) {
        api.unsendMessage(Reply.messageID);
        if (event.type == "message_reply") {
            const reply = parseInt(event.body);
            if (isNaN(reply) || reply < 1 || reply > Reply.videoUrls.length) {
                return api.sendMessage(`Please reply with a number between 1 and ${Reply.videoUrls.length}.`, event.threadID, event.messageID);
            }
            try {
                const selectedVideoUrl = Reply.videoUrls[reply - 1];

                const downloadResponse = await axios.get(`https://xnewapi.onrender.com/alldl?url=${encodeURIComponent(selectedVideoUrl)}`);
                console.log(downloadResponse.data);
                const videoUrl = downloadResponse.data.video;
                if (!videoUrl) {
                    return api.sendMessage(`Failed to retrieve the video download link.`, event.threadID);
                }
                await api.sendMessage({
                    body: `✿━━━━━━━━━━━━━━━━━✿\nBaby Here's the YouTube video you selected! 🎥\n✿━━━━━━━━━━━━━━━━━✿`,
                    attachment: await global.utils.getStreamFromURL(videoUrl)
                }, event.threadID);

            } catch (error) {
                console.error(`Error downloading video: ${error}`);
                api.sendMessage(`An error occurred: \n${error.message}`, event.threadID, event.messageID);
            }
        }
    }
};
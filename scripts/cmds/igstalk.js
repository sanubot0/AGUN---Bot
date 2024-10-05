const axios = require("axios");

module.exports = {
  config: {
    name: "igstalk",
    aliases: ["stalkig"],
    version: "1.0",
    author: "XNIL",
    countDown: 5,
    role: 0,
    shortDescription: "Get Instagram user info",
    longDescription: {
      en: "Provides you the information of an Instagram user."
    },
    category: "info",
    guide: {
      en: "{pn} <username>"
    }
  },

  onStart: async function({ api, event, args }) {
    const userName = args.join(' ');

    if (!userName) {
      return api.sendMessage("Please provide an Instagram username.", event.threadID);
    }

    try {
      const response = await axios.get(`https://xnewapi.onrender.com/xnil/igstalk?ig=${userName}`);

      if (!response.data || response.data.length === 0) {
        return api.sendMessage("User not found or invalid response.", event.threadID);
      }

      const userData = response.data[0];
      const userInfoMessage = {
        body: `🌺Here's some information about: ${userData.username}🌺\n\n` +
          `❏Id: ${userData.pk}\n` +
          `❏Username: ${userData.username}\n` +
          `❏Full Name: ${userData.full_name}\n` +
          `❏Account Private: ${userData.is_private ? "Yes" : "No"}\n` +
          `❏Verified: ${userData.is_verified ? "Yes" : "No"}\n` +
          `❏Private Account: ${userData.is_private ? "Yes" : "No"}\n` +
          `❏Followers: ${userData.follower_count}\n` +
          `❏Following: ${userData.following_count}\n` +
          `❏FaceBook id : www.facebook.com/${userData.follower_count} || "Nai"\n` +
          `❏Total Media: ${userData.media_count}\n` +
          `❏Biography: ${userData.biography || "No biography available."}\n` +
          `❏Category: ${userData.category}\n` +
          `❏External URL: ${userData.external_url || "No external URL available."}\n` +
          `❏Account Type: ${userData.account_type === 1 ? "❏Personal" : userData.account_type === 2 ? "Business" : "Unknown"}\n` +
          `❏Business Account: ${userData.is_business ? "Yes" : "No"}\n` +
          `❏Is Published: ${userData.is_unpublished ? "No" : "Yes"}\n` +
          `❏Profile Picture:`,
        attachment: await global.utils.getStreamFromURL(userData.profile_pic_url_hd)
      };

      return api.sendMessage(userInfoMessage, event.threadID);

    } catch (error) {
      console.error(error);
      return api.sendMessage("An error occurred while fetching the user information.", event.threadID);
    }
  }
};
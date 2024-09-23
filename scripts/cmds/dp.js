const { loadImage, createCanvas } = require("canvas");
const fs = require("fs-extra");
const axios = require("axios");
 
module.exports = {
  config: {
    name: "dp",
    author: "SIDDIK",
    countDown: 5,
    role: 0,
    category: "png",
    usages: "[@mention]",
    shortDescription: {
      en: "Generates a 'dp' image with the user's profile picture.",
    },
  },
 
module.exports.onLoad = async() => {
  const { resolve } = global.nodemodule["path"];
  const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { downloadFile } = global.utils;
  const dirMaterial = __dirname + `/cache/canvas/`;
  const path = resolve(__dirname, 'cache/canvas', 'arr2.png');
  if (!existsSync(dirMaterial + "canvas")) mkdirSync(dirMaterial, { recursive: true });
  if (!existsSync(path)) await downloadFile("https://i.imgur.com/iaOiAXe.jpeg", path); 
}
 
async function makeImage({ one, two }) {
  const fs = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];
  const axios = global.nodemodule["axios"]; 
  const jimp = global.nodemodule["jimp"];
  const __root = path.resolve(__dirname, "cache", "canvas");
 
  let batgiam_img = await jimp.read(__root + "/arr2.png");
  let pathImg = __root + `/batman${one}_${two}.png`;
  let avatarOne = __root + `/avt_${one}.png`;
  let avatarTwo = __root + `/avt_${two}.png`;
 
  let getAvatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, 'utf-8'));
 
  let getAvatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, 'utf-8'));
 
  let circleOne = await jimp.read(await circle(avatarOne));
  let circleTwo = await jimp.read(await circle(avatarTwo));
  batgiam_img.composite(circleOne.resize(200, 200), 70, 110).composite(circleTwo.resize(200, 200), 465, 110);
 
  let raw = await batgiam_img.getBufferAsync("image/png");
 
  fs.writeFileSync(pathImg, raw);
  fs.unlinkSync(avatarOne);
  fs.unlinkSync(avatarTwo);
 
  return pathImg;
}
async function circle(image) {
  const jimp = require("jimp");
  image = await jimp.read(image);
  image.circle();
  return await image.getBufferAsync("image/png");
}
 
module.exports.run = async function ({ event, api, args }) {    
  const fs = global.nodemodule["fs-extra"];
  const { threadID, messageID, senderID } = event;
  const mention = Object.keys(event.mentions);
  if (!mention[0]) return api.sendMessage("Please mention 1 person.", threadID, messageID);
  else {
      const one = senderID, two = mention[0];
      return makeImage({ one, two }).then(path => api.sendMessage({ body: "—𝗜 𝗹𝗼𝘃𝗲 𝘆𝗼𝘂 𝗺𝗼𝗿𝗲 𝘁𝗵𝗮𝗻 𝘆𝗼𝘂 𝘄𝗶𝘁𝗵𝗼𝘂𝘁 𝗲𝘅𝗽𝗿𝗲𝘀𝘀𝗶𝗼𝗻!☺️💜\n\n—বিনা প্রকাশে আমি তোকে তোর চেয়ে বেশি ভালোবাসি!☺️💜", attachment: fs.createReadStream(path) }, threadID, () => fs.unlinkSync(path), messageID));
  }
                              }

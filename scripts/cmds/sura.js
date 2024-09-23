module.exports.config = {
	name: "sura",
	version: "1.0.1",
	role: 0,
	author: "★𝐌𝟗𝐇𝟒𝐌𝐌𝟒𝐃-𝐁𝟒𝐃𝟗𝐋★",
	description: "get islamick+ sura",
        category: "media",
	usages: "islamick sura audio",
	countDowns: 5,
	dependencies: {
		"request":  ""
	}
};
 
module.exports.onStart = async({api,event,args,client,Users,Threads,__GLOBAL,Currencies}) => {
 
const axios = require('axios');
 
const request = require('request');
 
const fs = require('fs-extra');
 
   var badolkhan = ["╔══❖•𝐌𝐈𝐌-𝐁𝐎𝐓•❖══╗\n\n【• 𝐈𝐒𝐋𝐀𝐌𝐈𝐂𝐊•𝐒𝐔𝐑𝐀•】\n\n╚══❖•𝐌𝐈𝐌-𝐁𝐎𝐓•❖══╝"];
 
  var mim = badolkhan[Math.floor(Math.random() * badolkhan.length)];
 
  var link = [
 
   "https://drive.google.com/uc?id=1xjyq3BrlW3bGrp8y7eedQSuddCbdvLMN",
   
   "https://drive.google.com/uc?id=1CCQqJVqvFsgyAd4ZjZB0BJ3lGN4Kc2l2",
   
   "https://drive.google.com/uc?id=1xnht0PdBt9DnLGzW7GmJUTsTIJnxxByo",
   
   "https://drive.google.com/uc?id=1CDCa4AlqErr1b7JRNWL62AP0WtdjlSOE",
   
   "https://drive.google.com/uc?id=1yK0A3lyIJoPRp6g3UjNrC31n0yLfc1Ht",
   
   "https://drive.google.com/uc?id=1ySwrEG6xVqPdY5BcBP8I3YFCUOX4jV9e",
   
   "https://drive.google.com/uc?id=1CESeRi5Ue4HR6GSDfYJrREGGcsvYJvAB"];
     
 ];
     var callback = () => api.sendMessage({body:`「 ${mim} 」`,attachment: fs.createReadStream(__dirname + "/cache/B4D9L.mp3")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/B4D9L.mp3"));    
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/B4D9L.mp3")).on("close",() => callback());
   };
 

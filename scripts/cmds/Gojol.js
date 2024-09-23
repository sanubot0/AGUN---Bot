module.exports = {
  config: {
    name: "gojol",
    aliases: ["islamicaudio", "lyricaledit"],
    version: "1.0",
    author: "SIDDIK",
    countDown: 5,
    role: 0,
    shortDescription: "get islamic audio",
    longDescription: "it will send you islamic audio from lyrics edit vibe group",
    category: "music",
    guide: "{pn} bd",
  },
 
  sentaudio: [],
 
  onStart: async function ({ api, event, message }) {
    const senderID = event.senderID;
 
    const loadingMessage = await message.reply({
      body: "Loading Islamic  Gojol... Please wait! 🕐",
    });
 
    const link = [ 
   "https://drive.google.com/uc?id=1xjyq3BrlW3bGrp8y7eedQSuddCbdvLMN",
   
   "https://drive.google.com/uc?id=1CCQqJVqvFsgyAd4ZjZB0BJ3lGN4Kc2l2",
   
   "https://drive.google.com/uc?id=1xnht0PdBt9DnLGzW7GmJUTsTIJnxxByo",
   
   "https://drive.google.com/uc?id=1CDCa4AlqErr1b7JRNWL62AP0WtdjlSOE",
   
   "https://drive.google.com/uc?id=1yK0A3lyIJoPRp6g3UjNrC31n0yLfc1Ht",
   
   "https://drive.google.com/uc?id=1ySwrEG6xVqPdY5BcBP8I3YFCUOX4jV9e",
   
   "https://drive.google.com/uc?id=1CESeRi5Ue4HR6GSDfYJrREGGcsvYJvAB"];
 
    const availableAudio = link.filter(audio => !this.sentAudio.includes(audio));
 
    if (availableAudio.length === 0) {
      this.sentAudio = [];
    }
 
    const randomIndex = Math.floor(Math.random() * availableAudio.length);
    const randomAudio = availableAudio[randomIndex];
 
    this.sentAudio.push(randomAudio);
 
    if (senderID !== null) {
      message.reply({
        body: '╰‣ Islamic Gojol By Sk Siddik',
        attachment: await global.utils.getStreamFromURL(randomAudio),
      });
 
      setTimeout(() => {
        api.unsendMessage(loadingMessage.messageID);
      }, 5000);
    }
  },
};

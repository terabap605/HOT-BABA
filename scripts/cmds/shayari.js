const axios = require("axios");

const images = [
  "https://i.ibb.co/KxBqKCMD/1755944202493-0-5154647769363978.jpg",
  "https://i.ibb.co/nMp3sVqB/1755944203527-0-6844357499391724.jpg",
  "https://i.ibb.co/9mybjRXR/1755944204633-0-8237185596125263.jpg",
  "https://i.ibb.co/CqDK9tp/1755944205593-0-15451265481144683.jpg",
  "https://i.ibb.co/NgvhwTHb/1755944206713-0-9248399418413817.jpg",
  "https://i.ibb.co/1fJVfkW0/1755944207548-0-8771376215258824.jpg",
  "https://i.ibb.co/ZR11HLYW/1755944208450-0-8410728131461191.jpg",
  "https://i.ibb.co/xqx5dYHz/1755944209281-0-09026138149100027.jpg",
  "https://i.ibb.co/zWQ1XnjB/image.jpg"
];

module.exports.config = {
  name: "shayari",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Raj",
  description: "র্যান্ডম বাংলা শায়েরি দেখাবে",
  commandCategory: "fun",
  usages: "shayari",
  cooldowns: 5
};

module.exports.onStart = async function({ api, event }) {
  try {
    // র‍্যান্ডম ইমেজ সিলেক্ট
    const randomImage = images[Math.floor(Math.random() * images.length)];

    // শায়েরি fetch
    const response = await axios.get("https://api.princetechn.com/api/fun/shayari?apikey=prince");  
    let shayari = response.data.result || "😅 কোন শায়েরি পাওয়া যায়নি!";

    // ইমেজ স্ট্রিম তৈরি
    const imgStream = (await axios.get(randomImage, { responseType: "stream" })).data;

    // মেসেজ পাঠাও
    return api.sendMessage(
      {
        body: `💌 আপনার শায়েরি:\n\n${shayari}`,
        attachment: imgStream
      },
      event.threadID,
      event.messageID
    );

  } catch (err) {
    console.log(err);
    return api.sendMessage("😢 শায়েরি আনতে সমস্যা হয়েছে।", event.threadID, event.messageID);
  }
};

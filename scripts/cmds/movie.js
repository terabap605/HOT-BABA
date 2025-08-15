const axios = require("axios");

module.exports = {
  config: {
    name: "movie",
    version: "1.1",
    author: "Rahad Boss",
    countDown: 5,
    role: 0,
    shortDescription: "Movie info + poster (Stylish)",
    category: "entertainment",
    guide: "{p}movie <movie name>"
  },
  onStart: async function ({ message, args }) {
    if (!args[0]) return message.reply("🎬 Please provide a movie name!");

    const movieName = encodeURIComponent(args.join(" "));
    const apiKey = "YOUR_OMDB_API_KEY"; // এখানে তোমার OMDb API Key বসাও

    try {
      const res = await axios.get(`https://www.omdbapi.com/?t=${movieName}&apikey=${apiKey}`);
      if (res.data.Response === "False") return message.reply("❌ Movie not found!");

      const m = res.data;
      const bodyMsg = `💖 Bby Movie Search 💖\n━━━━━━━━━━━━━━━━\n🎬 ${m.Title} (${m.Year})\n⭐ IMDb: ${m.imdbRating}\n📜 Plot: ${m.Plot}\n🎭 Genre: ${m.Genre}\n📅 Released: ${m.Released}\n━━━━━━━━━━━━━━━━\n✨ Rahad Boss ✨`;

      message.reply({
        body: bodyMsg,
        attachment: await global.utils.getStreamFromURL(m.Poster)
      });
    } catch (err) {
      message.reply("⚠️ Error fetching movie data!");
    }
  }
};

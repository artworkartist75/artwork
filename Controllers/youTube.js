import axios from "axios";

let youTubeStatsCache = null;
let lastFatched = 0;

const CACHE_TIME = 15*60*1000;

export const getYoutubeStats = async (req, res) => {
  try {

    const now = Date.now();

    if(youTubeStatsCache && now - lastFatched < CACHE_TIME){
        return res.json(youTubeStatsCache);
    }

    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/channels",
      {
        params: {
          part: "statistics",
          id: process.env.YOUTUBE_CHANNEL_ID,
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );
    youTubeStatsCache = response.data.items[0].statistics;
    lastFatched = now;
    
    return res.json(youTubeStatsCache); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
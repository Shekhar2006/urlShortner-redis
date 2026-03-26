import express from 'express';
import cors from 'cors';
import "dotenv/config";
import { createClient } from 'redis';
import { encodeBase62 } from './services/base62_encoding.js';
import { log } from 'console';

const app = express();
const port = process.env.PORT || 3001;
const redisPort = process.env.REDIS_PORT || 6379;

app.use(cors());
app.use(express.json());

// redis initilization
const redisCli = createClient({
    url: `redis://127.0.0.1:${redisPort}`
});

redisCli.on('connect', () => {
    console.log("Redis connected");
});

redisCli.on('error', (error) => {
    console.log("Redis connection failed ", error);
});

// routes
app.post("/shorten", async (req, res) => {
    const originalUrl = req.body["originalUrl"];

    if (!originalUrl) {
        return res.status(400).json({ error: "Url is required" });
    }
    else {
        try {

            const id = await redisCli.incr("global_counter");
            console.log(id);
            const shortUrlId = encodeBase62(id);
            console.log(shortUrlId);
            await redisCli.hSet("urls", shortUrlId, originalUrl);
            return res.status(200).json({ data: shortUrlId });


        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

});



// get long url from short url
app.get("/:shortUrlId", async (req, res) => {
    const shortUrlId = req.params.shortUrlId;
    const originalUrl = await redisCli.hGet("urls", shortUrlId);
    if (originalUrl) {
        return res.status(200).json({ data: originalUrl });
    }
});


// server start
app.listen(port, async () => {
    try {
        await redisCli.connect();
        console.log(`Server listening on port ${port}`);
    } catch (error) {
        console.log("Error", error);
    }
});

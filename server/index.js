import express from 'express';
import cors from 'cors';
import "dotenv/config";
import { createClient } from 'redis';

const app = express();
const port = process.env.PORT || 3000;
const redisPort = process.env.REDIS_PORT || 6379;

// redis initilization
const redisCli = createClient({
    url : `redis://localhost:${redisPort}`
});

redisCli.on('connect',()=>{
    console.log("Redis connected");
})

app.use(cors());
app.use(express.json());

app.post("/shorten" ,async (req, res)=>{
    const {originalUrl} = req.body;

    if(!originalUrl){
        return res.status(400).json({error: "Url is required"});
    }

    try {
        
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
})

app.listen(port , ()=>{
    console.log(`Server listening on port ${port}`);
});

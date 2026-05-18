import express from 'express';
import Redis from 'ioredis';
import mongoose from 'mongoose'

const app = express();

// redis client
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

//  end point to talk to or ping redis
app.get("/redis", async (req, res) => {
    const reply = await redis.ping();
    res.json({ redis: reply });
})

// mongo endpoint
app.get("/mongo", async (req, res) => {
    const url = process.env.MONOG_URL || 'mongodb://localhost:27017/chai_aur_redis';

    // connect
    if(mongoose.connection.readyState === 0){
        await mongoose.connect(url);
    }
    res.json({
        mongo: "connected",
        database: mongoose.connection.name
    })
})

app.listen(3000, ()=>{
    console.log("server running on port 3000")
})
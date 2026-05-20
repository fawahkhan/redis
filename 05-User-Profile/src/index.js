import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json())

// redis client
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379")


app.post("/user:id/json", async (req, res)=>{
    
    await redis.set(`user:${req.params.id}:json` , JSON.stringify(req,body)) ;

    res.json({
        savedAs: "json"
    })
   
})
app.get("/user:id/json", async (req, res)=>{
    
    await redis.get(`user:${req.params.id}:json`) ;

    res.json({
        user: raw ? JSON.parse(raw) : null
    })
   
})


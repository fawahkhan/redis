import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json())

// redis client
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379")


app.post("/user/:id/json", async (req, res)=>{
    
    await redis.set(`user:${req.params.id}:json` , JSON.stringify(req.body)) ;

    res.json({
        savedAs: "json"
    })
   
})
app.get("/user/:id/json", async (req, res)=>{
    
    const raw = await redis.get(`user:${req.params.id}:json`) ;

    res.json({
        user: raw ? JSON.parse(raw) : null
    })
   
})

// ham iss tarah kka data usually hash me rkhte hai kyunki usme hame object milta hai and object me manipulation wagera easily kiya jaa skta hai
// ab ham data ko string me nhi rkhna chahte we want to store it as an object
app.post("/user/:id/hash", async (req, res)=>{
    
    await redis.hset(`user:${req.params.id}:hash` , req.body) ;

    res.json({
        savedAs: "hash"
    })
   
})

app.get("/user/:id/hash", async (req, res)=>{
    // hgetall -- poora ka poora object dedo
    const user = await redis.hgetall(`user:${req.params.id}:hash`) ;

    res.json({
        user
    })
   
})

app.listen(3000, ()=>{
    console.log("server is running on port 3000")
})



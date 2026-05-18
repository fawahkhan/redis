import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json()) // it will be required to send data

// redis client
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// key - this is how we write a key in redis
const BANNER_KEY = "app:banner"

// how to interact with key? 
// --- first we hv to set a value to the banner--- redis.set(key, value that we have to set to the key) 
app.post('/banner', async (req, res)=>{
    await redis.set(BANNER_KEY, req.body.message || "Welcome to chai aur redis!");
    res.json({ success : true })
})

// --- get key value ----
// redis.get(BANNER_KEY)
app.get("/banner" , async (req, res)=>{
    const message = await redis.get(BANNER_KEY);
    res.json({ message })
})

// --- delete key value --- 
// redis.del(BANNER_KEY)

app.delete("/banner" , async (req, res)=>{
    await redis.del(BANNER_KEY);
    res.json({ success : true })
})

// ---- method to check if that key exists in db or not --------
// redis.exists(BANNER_KEY) 
app.get("/banner/exists" , async (req, res)=>{
    const exists = await redis.exists(BANNER_KEY);
    res.json({ 
        exists: Boolean(exists) // with boolean it returns true/false and without boolean it returns 1/0 respectively
    })
})

app.listen(3000 , ()=>{
    console.log("server running on port 3000")
})



// //  end point to talk to or ping redis
// app.get("/redis", async (req, res) => {
//     const reply = await redis.ping();
//     res.json({ redis: reply });
// })


// app.listen(3000, ()=>{
//     console.log("server running on port 3000")
// })
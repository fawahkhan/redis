import express from 'express'
import Redis from 'ioredis'

const app = express()
app.use(express.json())

// MAKE AN OBJECT INSTANCE OF REDIS
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// jab bhi queue banate hai toh queue ki key honi chahiye tabhi usey address krpayenge

const QUEUE_KEY = 'queue:emails'

// to send email
app.post('/emails', async (req, res)=>{
    // jab bhi ham ek queue banate hai toh uske andr kuch bhi rkha ho jo bhi rkhte hai usey JOB bolte hai.
    const job = {
        to : req.body.to,
        subject : req.body.subject || 'No subject',
        body : req.body.body || 'No content',
        createdAt : new Date().toISOString()
    }
    // lpush--- left se ham push krenge
    await redis.lpush(QUEUE_KEY, JSON.stringify(job))
    res.json({
        queued : true ,
        job
    })
})
// yahan se jo data ayega woh string format me ayega coz we stringified it .... jab consume krenge to usey parse krna padega.
// to consume job

app.get('/emails/process-one', async (req,res)=>{
    const rawJob = await redis.rpop(QUEUE_KEY)
    if(!rawJob){
        return res.json({
            message: 'NO jobs in the queue'
        })
    }
    const job = JSON.parse(rawJob);
    // Simulate email sending 
    res.json({message : 'Email sent', job});
})

app.listen(3000, ()=>{
    console.log("Server is running on PORT 3000")
})
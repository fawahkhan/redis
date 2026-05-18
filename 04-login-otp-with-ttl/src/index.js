import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json())

// redis client
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379")

// now we will make a function jisme user hame apna phone number dega and in return ham usey ek key return krenge
function otpKey(phone){
    return `otp:${phone}` ;
}

app.post("/otp", async (req, res)=>{
    const { phone } = req.body ;
    const otp  = Math.floor(10000 + Math.random()*900000).toString();

    await redis.set(otpKey(phone), otp, 'EX' , 30) // ex stands for expiry which is 30 seconds
    res.json({
        message: 'OTP sent',
        otp
    }) // int real application, send OTP via sms
})

app.post('/otp/verify', async (req,res)=>{
    const { phone, otp } = req.body ;
    const savedOtp  =  await redis.get(otpKey(phone))

    if(!savedOtp){
        return res.status(400).json({
            message: 'OTP expired or not found'
        })
    }

    if(savedOtp !== otp){
        return res.status(400).json({
            message: 'OTP invalid'
        })
    }
    // now both edge cased are handled i.e. now the otp is neither invalid nor absent
    // so now we will verify the user and delete the otp 
    await redis.del(otpKey(phone))
    res.json({
        message: 'OTP Verified Successfully'
    })
})

// given a phone number we want to check TTL of its otp.

app.get('/otp/:phone/ttl', async (req, res)=>{
    // jab bhi ham koi key store krwate hai toh sirf ke nhi store hoti sath me uska 
    // metadata bhi store hota hai. expiry is one of them. bas ussi metadata ko extract krlenge
    const ttl = await redis.ttl(otpKey(req.params.phone)) 
    // req.params.phone number is a url and woh key poori dedi ttl me.
    res.json({ ttl })
})

app.listen(3000, ()=>{
    console.log("app is running on port 3000")
})
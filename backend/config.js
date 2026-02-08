import dotenv from 'dotenv';
import mongoose from 'mongoose';
const loadEnv = dotenv.config({ path: process.env.dev == '1' ? './.env.development' : './.env.production1' })


const env = (loadEnv.error ? { PORT : 5000 }: loadEnv.parsed);

const corsOptions = {
    origin: env.CORS_ORIGIN,
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}


const setup = async () => {
    try {
        await mongoose.connect(env.MONGODB_URI, {})
        console.log("Mongo connect OK.")
    } catch(err) {
        console.log({err})
    }
}

export { env , corsOptions,setup  }

import { createClient, RedisClientType } from "redis";

const redisClient: RedisClientType = createClient({
    url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

const connectRedis = async (): Promise<void> => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
        console.log('[redis]: Connected successfully');
    }
};

export { redisClient, connectRedis };
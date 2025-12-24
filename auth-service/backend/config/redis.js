import { createClient } from "redis";

let redis;

export const getRedisClient = () => {
  if (!redis) {
    redis = createClient({
      url: process.env.REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => {
          console.log("🔁 Redis reconnect attempt:", retries);
          return Math.min(retries * 200, 3000);
        },
      },
    });

    redis.on("connect", () => {
      console.log("✅ Redis connected");
    });

    redis.on("ready", () => {
      console.log("🚀 Redis ready");
    });

    redis.on("error", (err) => {
      console.error("❌ Redis error:", err.message || err);
    });

    redis.on("end", () => {
      console.warn("⚠️ Redis connection closed");
    });
  }

  return redis;
};

export const connectRedis = async () => {
  const client = getRedisClient();

  if (!client.isOpen) {
    try {
      await client.connect();
    } catch (err) {
      console.error("❌ Redis initial connect failed:", err.message);
    }
  }
};

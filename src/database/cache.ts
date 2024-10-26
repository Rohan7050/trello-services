const Redis = require('ioredis');
import { REDIS_HOST, REDIS_PASSWORD } from "./database.config";
 
export class RedisCache {
  private readonly cache: any;
  private ttl: number;
 
  constructor(ttl: number) {
    // [1] define ttl and create redis connection
    this.ttl = ttl;
    this.cache = new Redis({
      host: REDIS_HOST
    });
    this.cache.on("connect", () => {
      console.log(`Redis connection established`);
    });
 
    this.cache.on("error", (error: any) => {
      console.error(`Redis error, service degraded: ${error}`);
    });
  }
 
  // [2] generic function, takes `fetcher` argument which is meant to refresh the cache
async get(key: string){
    // [3] if we're not connected to redis, bypass cache
    return new Promise((resolve, reject) => {
      if (this.cache) {
        console.log("key", key)
        this.cache.get(key, (err: any, value: any) => {
          if (err) {
            reject(err)
          } else {
            resolve(value);
          }
        });
      } else {
        reject('No Data Found')
      }
    });
  }
 
  async setCache(key: string, result: any) {
    try {
      const data = await this.cache.set(key, JSON.stringify(result));
      return data
    } catch (e) {
      return e
    }
  }
 
  // [6]
  del(key: string) {
    this.cache.del(key);
  }
 
  flush() {
    this.cache.flushall();
  }
}

import {Inject, Service} from "typedi";
import {RedisClient} from "redis";
import {promisify} from "util";

@Service()
export default class RedisService {

  constructor(
    @Inject('redis') private redis: RedisClient
  ) {}

  public async getKey(s: string): Promise<string> {
    if (!this.existsKey(s)) throw new Error("The requested key does not exists");
    const getAsync = promisify(this.redis.get).bind(this.redis);
    return await getAsync(s);
  }

  public async setKey(key: string, value: string): Promise<boolean> {
    const setAsync = promisify(this.redis.set).bind(this.redis);
    return await setAsync(key, value);
  }

  public async existsKey(s: string): Promise<boolean> {
    const existAsync = promisify(this.redis.exists).bind(this.redis);
    return await existAsync(s);
  }

  public async setKeyExpiration(s: string, e: number): Promise<boolean> {
    const expireAsync = promisify(this.redis.expire).bind(this.redis);
    return await expireAsync(s, e);
  }

  public async deleteKey(s: string): Promise<boolean> {
    if (!this.existsKey(s)) throw new Error("The requested key does not exists");
    const deleteAsync = promisify(this.redis.del).bind(this.redis);
    return await deleteAsync(s);
  }

}

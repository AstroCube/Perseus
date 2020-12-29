import { ClientOpts, RedisClient } from "redis";
import * as redis from "redis";

export default async (opts: ClientOpts): Promise<RedisClient> => {
  return redis.createClient(opts);
}

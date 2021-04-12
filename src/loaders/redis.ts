import * as redis from "redis";
import {ClientOpts, RedisClient} from "redis";

export default async (opts: ClientOpts): Promise<RedisClient> => {
  return redis.createClient(opts);
}

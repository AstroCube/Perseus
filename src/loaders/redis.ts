import { ClientOpts, RedisClient } from "redis";

export default (opts: ClientOpts): RedisClient => {
  return require('redis').createClient(opts);
}

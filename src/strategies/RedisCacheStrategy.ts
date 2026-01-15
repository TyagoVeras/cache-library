import Redis from 'ioredis';
import { cacheConfig } from '../config/cacheConfig';
import { ICacheStrategy } from './ICacheStrategy';

export class RedisCacheStrategy implements ICacheStrategy {
  private cache: Redis;

  constructor() {
    if (!cacheConfig.connectionUrl) {
      throw new Error('Redis connection URL is not defined');
    }
    this.cache = new Redis(cacheConfig.connectionUrl);
  }

  async get(cacheIdentifier: string): Promise<any> {
    const cached = await this.cache.get(cacheIdentifier);
    return cached ? JSON.parse(cached) : null;
  }

  async set(cacheIdentifier: string, value: any, ttl: number): Promise<void> {
    await this.cache.set(cacheIdentifier, JSON.stringify(value), 'PX', ttl); // ttl in milliseconds
  }

  async delete(cacheIdentifier: string): Promise<void> {
    await this.cache.del(cacheIdentifier);
  }

  async deletePattern(pattern: string): Promise<void> {
    const keys = await this.cache.keys(pattern);
    if (keys.length > 0) {
      await this.cache.del(...keys);
    }
  }
}

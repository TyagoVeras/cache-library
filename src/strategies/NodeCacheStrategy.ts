import NodeCache from 'node-cache';
import { ICacheStrategy } from './ICacheStrategy';

export class NodeCacheStrategy implements ICacheStrategy {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache();
  }

  async get(cacheIdentifier: string): Promise<any> {
    return this.cache.get(cacheIdentifier);
  }

  async set(cacheIdentifier: string, value: any, ttl: number): Promise<void> {
    this.cache.set(cacheIdentifier, value, ttl / 1000);
  }
}

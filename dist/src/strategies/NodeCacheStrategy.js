import NodeCache from 'node-cache';
export class NodeCacheStrategy {
    constructor() {
        this.cache = new NodeCache();
    }
    async get(cacheIdentifier) {
        return this.cache.get(cacheIdentifier);
    }
    async set(cacheIdentifier, value, ttl) {
        this.cache.set(cacheIdentifier, value, ttl / 1000);
    }
}

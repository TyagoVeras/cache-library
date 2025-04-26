import { cacheConfig } from '../config/cacheConfig';
import { NodeCacheStrategy } from '../strategies/NodeCacheStrategy';
import { RedisCacheStrategy } from '../strategies/RedisCacheStrategy';
let cacheStrategy;
const strategyMap = {
    'node-cache': NodeCacheStrategy,
    redis: RedisCacheStrategy
};
cacheStrategy = new strategyMap[cacheConfig.strategy]();
function getCacheIdentifier(cacheKey, args) {
    return `${cacheKey}:${JSON.stringify(args)}`;
}
export function cacheInjectable({ cacheKey, ttl }) {
    return function (target, propertyKey, descriptor) {
        const finalCacheKey = `${cacheConfig.defaultRootKey}:${cacheKey}`;
        const finalTtl = ttl || cacheConfig.defaultTtl;
        if (descriptor && propertyKey) {
            // Method decorator
            const originalMethod = descriptor.value;
            descriptor.value = async function (...args) {
                const cacheIdentifier = getCacheIdentifier(finalCacheKey, args);
                const cached = await cacheStrategy.get(cacheIdentifier);
                if (cached) {
                    console.log('Returning cached value for', cacheIdentifier);
                    return cached;
                }
                const result = await originalMethod.apply(this, args);
                await cacheStrategy.set(cacheIdentifier, result, finalTtl);
                console.log('Caching value for', cacheIdentifier);
                return result;
            };
        }
        else {
            // Class decorator
            for (const key of Object.getOwnPropertyNames(target.prototype)) {
                const methodDescriptor = Object.getOwnPropertyDescriptor(target.prototype, key);
                if (methodDescriptor && methodDescriptor.value instanceof Function) {
                    const originalMethod = methodDescriptor.value;
                    methodDescriptor.value = async function (...args) {
                        const cacheIdentifier = getCacheIdentifier(finalCacheKey, args);
                        const cached = await cacheStrategy.get(cacheIdentifier);
                        if (cached) {
                            console.log('Returning cached value for', cacheIdentifier);
                            return cached;
                        }
                        const result = await originalMethod.apply(this, args);
                        await cacheStrategy.set(cacheIdentifier, result, finalTtl);
                        console.log('Caching value for', cacheIdentifier);
                        return result;
                    };
                    Object.defineProperty(target.prototype, key, methodDescriptor);
                }
            }
        }
    };
}

import { cacheConfig } from '../config/cacheConfig';
import { ICacheStrategy } from '../strategies/ICacheStrategy';
import { NodeCacheStrategy } from '../strategies/NodeCacheStrategy';
import { RedisCacheStrategy } from '../strategies/RedisCacheStrategy';

let cacheStrategy: ICacheStrategy;

const strategyMap = {
  'node-cache': NodeCacheStrategy,
  redis: RedisCacheStrategy
};

const Strategy = strategyMap[cacheConfig.strategy];
if (!Strategy) {
  throw new Error(`Unsupported cache strategy: ${cacheConfig.strategy}`);
}

cacheStrategy = new Strategy();

function getCacheIdentifier(cacheKey: string, args: any[]): string {
  return `${cacheKey}:${JSON.stringify(args)}`;
}

export function cacheInjectable({ cacheKey, ttl }: { cacheKey: string; ttl: number }) {
  return function (target: any, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<any>) {
    const finalCacheKey = `${cacheConfig.defaultRootKey}:${cacheKey}`;
    const finalTtl = ttl ?? cacheConfig.defaultTtl;

    if (descriptor && propertyKey) {
      // Method decorator
      const originalMethod = descriptor.value;

      descriptor.value = async function (...args: any[]) {
        const cacheIdentifier = getCacheIdentifier(finalCacheKey, args);
        const cached = await cacheStrategy.get(cacheIdentifier);

        if (cached !== null && cached !== undefined) {
          console.log('Returning cached value for', cacheIdentifier);
          return cached;
        }

        const result = await originalMethod.apply(this, args);
        await cacheStrategy.set(cacheIdentifier, result, finalTtl);

        console.log('Caching value for', cacheIdentifier);
        return result;
      };
    } else {
      // Class decorator
      for (const key of Object.getOwnPropertyNames(target.prototype)) {
        const methodDescriptor = Object.getOwnPropertyDescriptor(target.prototype, key);

        if (methodDescriptor && methodDescriptor.value instanceof Function) {
          const originalMethod = methodDescriptor.value;

          methodDescriptor.value = async function (...args: any[]) {
            const cacheIdentifier = getCacheIdentifier(finalCacheKey, args);
            const cached = await cacheStrategy.get(cacheIdentifier);

            if (cached !== null && cached !== undefined) {
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

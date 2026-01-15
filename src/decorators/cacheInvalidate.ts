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

interface CacheInvalidateOptions {
  cacheKeys?: string[];
  patterns?: string[];
  invalidateAll?: boolean;
}

export function CacheInvalidate(options: CacheInvalidateOptions) {
  return function (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      // Execute the original method first
      const result = await originalMethod.apply(this, args);

      // After successful execution, invalidate cache
      try {
        if (options.invalidateAll) {
          // Invalidate all cache entries with the default root key
          await cacheStrategy.deletePattern(`${cacheConfig.defaultRootKey}:*`);
        } else {
          // Invalidate specific cache keys
          if (options.cacheKeys && options.cacheKeys.length > 0) {
            for (const cacheKey of options.cacheKeys) {
              const fullCacheKey = `${cacheConfig.defaultRootKey}:${cacheKey}`;
              const cacheIdentifier = getCacheIdentifier(fullCacheKey, args);
              await cacheStrategy.delete(cacheIdentifier);
            }
          }

          // Invalidate cache patterns
          if (options.patterns && options.patterns.length > 0) {
            for (const pattern of options.patterns) {
              const fullPattern = `${cacheConfig.defaultRootKey}:${pattern}`;
              await cacheStrategy.deletePattern(fullPattern);
            }
          }
        }
      } catch (error) {
        console.error('Error invalidating cache:', error);
      }

      return result;
    };

    return descriptor;
  };
}

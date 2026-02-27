import * as fs from 'fs';
import * as path from 'path';

export interface CacheConfig {
  strategy: 'node-cache' | 'redis';
  connectionUrl?: string;
  defaultRootKey: string;
  defaultTtl: number;
}

function validateConfig(config: CacheConfig): void {
  if (!config.defaultRootKey) {
    throw new Error('Default root key is not defined');
  }

  if (config.strategy === 'redis' && !config.connectionUrl) {
    throw new Error('Redis connection URL is not defined');
  }
}

function loadConfig(): CacheConfig {
  // 1. Environment variables take precedence
  if (process.env.CACHE_STRATEGY) {
    const config: CacheConfig = {
      strategy: process.env.CACHE_STRATEGY as 'node-cache' | 'redis',
      connectionUrl: process.env.CACHE_CONNECTION_URL,
      defaultRootKey: process.env.CACHE_DEFAULT_ROOT_KEY ?? 'app',
      defaultTtl: process.env.CACHE_DEFAULT_TTL ? parseInt(process.env.CACHE_DEFAULT_TTL, 10) : 3600
    };
    validateConfig(config);
    return config;
  }

  // 2. Fallback to cache-config.json in process.cwd()
  const configPath = path.resolve(fs.realpathSync(process.cwd()), 'cache-config.json');

  if (!fs.existsSync(configPath)) {
    throw new Error(
      `cache-config.json not found at "${configPath}". ` +
      `Either create the file or set the CACHE_STRATEGY environment variable.`
    );
  }

  const configFile = fs.readFileSync(configPath, 'utf-8');
  const config: CacheConfig = JSON.parse(configFile);
  validateConfig(config);
  return config;
}

const config = loadConfig();

export const cacheConfig: CacheConfig = {
  strategy: config.strategy,
  connectionUrl: config.connectionUrl,
  defaultRootKey: config.defaultRootKey,
  defaultTtl: config.defaultTtl ?? 3600
};

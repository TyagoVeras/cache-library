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

const configPath = path.resolve(fs.realpathSync(process.cwd()), 'cache-config.json');
const configFile = fs.readFileSync(configPath, 'utf-8');
const config: CacheConfig = JSON.parse(configFile);
validateConfig(config);

export const cacheConfig: CacheConfig = {
  strategy: config.strategy,
  connectionUrl: config.connectionUrl,
  defaultRootKey: config.defaultRootKey,
  defaultTtl: config.defaultTtl ?? 3600
};

import * as fs from 'fs';
import * as path from 'path';
function validateConfig(config) {
    if (!config.defaultRootKey) {
        throw new Error('Default root key is not defined');
    }
    if (config.strategy === 'redis' && !config.connectionUrl) {
        throw new Error('Redis connection URL is not defined');
    }
}
const configPath = path.resolve(fs.realpathSync(process.cwd()), 'cache-config.json');
const configFile = fs.readFileSync(configPath, 'utf-8');
const config = JSON.parse(configFile);
validateConfig(config);
export const cacheConfig = {
    strategy: config.strategy,
    connectionUrl: config.connectionUrl,
    defaultRootKey: config.defaultRootKey,
    defaultTtl: 3600
};

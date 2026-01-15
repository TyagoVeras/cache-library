// This file serves as the entry point for the cache library. It exports the main functionality of the library, including the cache decorator and any utility functions related to caching.
import 'reflect-metadata';
export { cacheInjectable } from './src/decorators/cache';
export { CacheInvalidate } from './src/decorators/cacheInvalidate';

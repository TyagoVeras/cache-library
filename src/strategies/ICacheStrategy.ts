export interface ICacheStrategy {
  get(cacheIdentifier: string): Promise<any>;
  set(cacheIdentifier: string, value: any, ttl: number): Promise<void>;
  delete(cacheIdentifier: string): Promise<void>;
  deletePattern(pattern: string): Promise<void>;
}

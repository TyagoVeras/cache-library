export interface ICacheStrategy {
  get(cacheIdentifier: string): Promise<any>;
  set(cacheIdentifier: string, value: any, ttl: number): Promise<void>;
}

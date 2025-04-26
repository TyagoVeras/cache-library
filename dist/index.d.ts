declare function cacheInjectable({ cacheKey, ttl }: {
    cacheKey: string;
    ttl: number;
}): (target: any, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<any>) => void;

export { cacheInjectable };

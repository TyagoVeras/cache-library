# Cache Library

A simple caching library for TypeScript that provides a decorator for caching method results.

## Installation

To install the cache library, use npm:

```
npm i @tyagoveras/cache-library
```

## Usage

### Importing the Library

You can import the library in your TypeScript project as follows:

```typescript
import { cacheInjectable } from '@tyagoveras/cache-library';
```

### Using the Cache Decorator

You can use the `cacheInjectable` decorator to cache the results of class methods. Here’s an example:

```typescript
class ExampleService {
  @cacheInjectable({ cacheKey: 'exampleMethod', ttl: 5000 })
  exampleMethod() {
    console.log('Executing exampleMethod');
    return 'result';
  }
}
```

### Parameters

- `cacheKey`: A unique key for the cached result.
- `ttl`: Time-to-live for the cached result in milliseconds.

### Configuration file cache-config.json

The library uses a configuration file named `cache-config.json` to manage cache settings. The file should be placed in the root directory of your project.

```json
{
  "strategy": "node-cache | redis",
  "connectionUrl": "redis://localhost:6379",
  "defaultRootKey": "app",
  "defaultTtl": 60000
}
```

- `strategy`: The caching strategy to use. Options are `node-cache` or `redis`.

### `cacheInjectable(options: { cacheKey: string; ttl: number })`

This decorator can be applied to any class method to enable caching.

## Contributing

Feel free to submit issues or pull requests to improve the library.

## License

This project is licensed under the MIT License.

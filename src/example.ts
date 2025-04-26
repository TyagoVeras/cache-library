import { cacheInjectable } from './decorators/cache';

// @cacheInjectable({ cacheKey: 'ExampleService', ttl: 60000 })
class ExampleService {
  exampleMethod(param: string) {
    console.log('Executing exampleMethod with param:', param);
    return `Result for ${param}`;
  }

  @cacheInjectable({ cacheKey: 'exampleMethod2', ttl: 30000 })
  exampleMethod2(param: string) {
    console.log('Executing exampleMethod2 with param:', param);
    return `Result for ${param}`;
  }
}

const service = new ExampleService();
// console.log(service.exampleMethod('test')); // Exec and cached
// console.log(service.exampleMethod('test')); // Return from cache

console.log(service.exampleMethod2('test2')); // Exec and cached
console.log(service.exampleMethod2('test2')); // Return from cache

// import { cacheInjectable } from './decorators/cache';

// @cacheInjectable({ cacheKey: 'ExampleService', ttl: 60000 })
// class ExampleService {
//   exampleMethod(param: string) {
//     console.log('Executing exampleMethod with param:', param);
//     return `Result for ${param}`;
//   }
// }

// const service = new ExampleService();
// console.log(service.exampleMethod('test')); // Exec and cached

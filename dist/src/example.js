var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { cacheInjectable } from './decorators/cache';
// @cacheInjectable({ cacheKey: 'ExampleService', ttl: 60000 })
class ExampleService {
    exampleMethod(param) {
        console.log('Executing exampleMethod with param:', param);
        return `Result for ${param}`;
    }
    exampleMethod2(param) {
        console.log('Executing exampleMethod2 with param:', param);
        return `Result for ${param}`;
    }
}
__decorate([
    cacheInjectable({ cacheKey: 'exampleMethod2', ttl: 30000 })
], ExampleService.prototype, "exampleMethod2", null);
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

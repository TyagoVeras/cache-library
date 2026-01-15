import { cacheInjectable } from './decorators/cache';
import { CacheInvalidate } from './decorators/cacheInvalidate';

// Example demonstrating @cacheInjectable and @CacheInvalidate decorators
class UserService {
  @cacheInjectable({ cacheKey: 'getUser', ttl: 60000 })
  async getUser(userId: string) {
    console.log('Fetching user from database:', userId);
    // Simulate database call
    return { id: userId, name: 'John Doe', email: 'john@example.com' };
  }

  @cacheInjectable({ cacheKey: 'listUsers', ttl: 30000 })
  async listUsers() {
    console.log('Fetching all users from database');
    return [
      { id: '1', name: 'John Doe' },
      { id: '2', name: 'Jane Smith' }
    ];
  }

  @CacheInvalidate({ cacheKeys: ['getUser'] })
  async updateUser(userId: string, data: any) {
    console.log('Updating user in database:', userId);
    // Simulate update
    return { id: userId, ...data };
  }

  @CacheInvalidate({ patterns: ['getUser*', 'listUsers*'] })
  async deleteUser(userId: string) {
    console.log('Deleting user from database:', userId);
    // Simulate delete
    return { success: true };
  }

  @CacheInvalidate({ invalidateAll: true })
  async resetAllData() {
    console.log('Resetting all data');
    return { success: true };
  }
}

// Example usage
async function runExample() {
  const service = new UserService();

  // First call - will fetch from database and cache
  console.log('\n=== First getUser call ===');
  await service.getUser('123');

  // Second call - will return from cache
  console.log('\n=== Second getUser call (from cache) ===');
  await service.getUser('123');

  // Update user - will invalidate cache for that user
  console.log('\n=== Update user (invalidates cache) ===');
  await service.updateUser('123', { name: 'John Updated' });

  // Third call - will fetch from database again (cache was invalidated)
  console.log('\n=== Third getUser call (cache invalidated) ===');
  await service.getUser('123');

  console.log('\n=== List users ===');
  await service.listUsers();

  // Delete user - will invalidate all user-related caches
  console.log('\n=== Delete user (invalidates all user caches) ===');
  await service.deleteUser('123');
}

// runExample().catch(console.error);

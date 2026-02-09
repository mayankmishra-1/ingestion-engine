import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class TestCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async test() {
    const testKey = 'test-key';
    const testValue = { message: 'Hello Redis!' };

    // Set a value in Redis
    await this.cacheManager.set(testKey, testValue, 10); // TTL = 10 seconds
    console.log(`Set cache key: ${testKey}`);

    // Get the value from Redis
    const cached = await this.cacheManager.get(testKey);
    console.log('Cached value:', cached);
  }
}

// redis-test.ts
import Redis from 'ioredis';

async function main() {
  const redis = new Redis({ host: '127.0.0.1', port: 6379 });

  console.log('🔹 Pinging Redis...');
  const pong = await redis.ping();
  console.log('Redis PONG:', pong);

  const key = 'direct-test';
  const value = { message: 'Hello Redis!' };

  // Store key with TTL 300 seconds
  await redis.set(key, JSON.stringify(value), 'EX', 300);
  console.log('✅ Key set:', key);

  // Retrieve and parse
  const cached = await redis.get(key);
  console.log('🔹 Value from Redis:', JSON.parse(cached!));

  // List keys using SCAN
  console.log('🔹 Keys in Redis:');
  let cursor = '0';
  do {
    const [newCursor, keys] = await redis.scan(cursor, 'MATCH', '*', 'COUNT', '100');
    cursor = newCursor;
    if (keys.length) console.log(keys);
  } while (cursor !== '0');

  // Close connection
  redis.disconnect();
}

main().catch(console.error);

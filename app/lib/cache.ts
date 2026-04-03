type CacheEntry<T> = {
  data: T;
  updatedAt: number;
  expiresAt: number;
};

type CacheResult<T> = {
  data: T;
  outdated: boolean;
  lastUpdated: string;
};

const cacheStore = new Map<string, CacheEntry<unknown>>();

export async function getOrSetCache<T>(
  key: string,
  ttlMs: number,
  resolver: () => Promise<T>,
): Promise<CacheResult<T>> {
  const now = Date.now();
  const existing = cacheStore.get(key) as CacheEntry<T> | undefined;

  if (existing && existing.expiresAt > now) {
    return {
      data: existing.data,
      outdated: false,
      lastUpdated: new Date(existing.updatedAt).toISOString(),
    };
  }

  try {
    const fresh = await resolver();
    const updatedAt = Date.now();
    cacheStore.set(key, {
      data: fresh,
      updatedAt,
      expiresAt: updatedAt + ttlMs,
    });

    return {
      data: fresh,
      outdated: false,
      lastUpdated: new Date(updatedAt).toISOString(),
    };
  } catch (error) {
    if (existing) {
      return {
        data: existing.data,
        outdated: true,
        lastUpdated: new Date(existing.updatedAt).toISOString(),
      };
    }

    throw error;
  }
}

export function clearCacheByPrefix(prefix: string): number {
  let cleared = 0;
  for (const key of cacheStore.keys()) {
    if (key.startsWith(prefix)) {
      cacheStore.delete(key);
      cleared += 1;
    }
  }

  return cleared;
}

export function clearAllCaches(): number {
  const size = cacheStore.size;
  cacheStore.clear();
  return size;
}

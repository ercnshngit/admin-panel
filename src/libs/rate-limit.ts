import { LRUCache } from "lru-cache";
import { NextResponse } from "next/server";

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

export default function rateLimit(options?: Options) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  });

  return {
    check: (res: NextResponse, limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        try {
          const tokenCount = (tokenCache.get(token) as number[]) || [0];
          if (Number(tokenCount[0]) === 0) {
            tokenCache.set(token, tokenCount);
          }
          tokenCount[0] += 1;

          const currentUsage = tokenCount[0];
          const isRateLimited = currentUsage >= limit;
          res.headers.set("X-RateLimit-Limit", String(limit));
          res.headers.set(
            "X-RateLimit-Remaining",
            String(isRateLimited ? 0 : limit - currentUsage)
          );

          return isRateLimited ? reject() : resolve();
        } catch (e) {
          console.log(e);
          return resolve();
        }
      }),
  };
}

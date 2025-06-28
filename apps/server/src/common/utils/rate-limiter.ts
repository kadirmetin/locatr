export class RateLimiter {
  private rateLimitMap = new Map<string, number[]>();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests = 60, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.startCleanup();
  }

  checkLimit(userId: string): boolean {
    const now = Date.now();
    const userRequests = this.rateLimitMap.get(userId) || [];

    const recentRequests = userRequests.filter(
      (time) => now - time < this.windowMs,
    );

    if (recentRequests.length >= this.maxRequests) {
      return false;
    }

    recentRequests.push(now);
    this.rateLimitMap.set(userId, recentRequests);
    return true;
  }

  private startCleanup() {
    setInterval(
      () => {
        const now = Date.now();
        for (const [userId, requests] of this.rateLimitMap.entries()) {
          const recentRequests = requests.filter(
            (time) => now - time < this.windowMs,
          );
          if (recentRequests.length === 0) {
            this.rateLimitMap.delete(userId);
          } else {
            this.rateLimitMap.set(userId, recentRequests);
          }
        }
      },
      5 * 60 * 1000,
    );
  }

  getStats() {
    return {
      rateLimitEntries: this.rateLimitMap.size,
    };
  }
}

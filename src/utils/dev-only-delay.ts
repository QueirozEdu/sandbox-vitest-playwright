import { getFullEnv } from '@/env/config';

/**
 * Adds a small artifitial delay, **only in test development environment**.
 *
 * Useful to simulate latency and view UI transition states (ex: button "Loading...").
 * Does not have any effect in environments like `production` or `preview`, avoiding unwanted delay in production.
 *
 * @param delay - Waiting time in milliseconds (default: 1000ms)
 *
 * @example
 * await devOnlyDelay(500); // only waits if is in 'e2e', 'test' or 'development'
 */
export async function devOnlyDelay(delay: number = 1000): Promise<void> {
  const { currentEnv } = getFullEnv();

  const envsToDelay = ['e2e'];

  const shouldDelay = delay > 0 && envsToDelay.includes(currentEnv);

  if (shouldDelay) {
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  return;
}

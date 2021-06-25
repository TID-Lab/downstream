import { createHash } from 'crypto';

/**
 * Generates a hexidecimal SHA-256 hash from the provided string.
 */
export default function hash(str: string) {
  const shaHash = createHash('sha256');
  return shaHash.update(str).digest('hex');
}

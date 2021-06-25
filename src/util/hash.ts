import { createHash } from 'crypto';

/**
 * Generates a hexidecimal SHA-256 hash from the provided string.
 */
export default function hash(str: string) {
  if (!str) return '';
  const shaHash = createHash('sha256');
  return shaHash.update(str).digest('hex');
}

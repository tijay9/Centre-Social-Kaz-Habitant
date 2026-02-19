// Legacy connection helper (deprecated)
// Redirect all usages to the new shared pool in src/lib/database.ts

import { execute, executeQuery } from '@/lib/database';

// Export minimal compatibility helpers so old imports keep working
export const db = {
  execute,
  executeQuery,
};

// If there were old exports like getConnection/pool/etc., they are intentionally
// removed to avoid using localhost:3306. All code should migrate to '@/lib/database'.

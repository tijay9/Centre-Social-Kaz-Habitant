import mysql from 'mysql2/promise';
import type { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import crypto from 'crypto';

// Single shared pool
// In production (Railway/Vercel), use DATABASE_URL
// In local dev, fall back to DB_* vars (host/user/password/name)
const pool: Pool = mysql.createPool(
  process.env.DATABASE_URL
    ? {
        uri: process.env.DATABASE_URL,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'XnvIKZOMUKkFoFkaYhVZRVdOlEsccVmx',
        database: process.env.DB_NAME || 'dorothy',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      }
);

// Generic low-level execute (no client-side usage)
export async function execute(query: string, params: unknown[] = []) {
  if (typeof window !== 'undefined') {
    throw new Error('Database queries can only be executed on the server side');
  }
  return pool.execute(query, params);
}

// Generic query helper
export async function executeQuery<T extends RowDataPacket[] | ResultSetHeader = RowDataPacket[]>(
  query: string,
  params: unknown[] = []
): Promise<T> {
  const [rows] = await execute(query, params);
  return rows as T;
}

// High-level helpers
export async function findMany<T = Record<string, unknown>>(
  table: string,
  where?: string,
  params: unknown[] = [],
  orderBy?: string
): Promise<T[]> {
  let query = `SELECT * FROM ${table}`;
  if (where && where.trim().length > 0) {
    query += ` WHERE ${where}`;
  }
  if (orderBy && orderBy.trim().length > 0) {
    query += ` ${orderBy}`;
  }
  const rows = await executeQuery<RowDataPacket[]>(query, params);
  return rows as unknown as T[];
}

export async function findById<T = Record<string, unknown>>(table: string, id: string): Promise<T | null> {
  const query = `SELECT * FROM ${table} WHERE id = ?`;
  const results = await executeQuery<RowDataPacket[]>(query, [id]);
  return (results[0] as unknown as T) || null;
}

export async function create(table: string, data: Record<string, unknown>) {
  const columns = Object.keys(data).map((key) => `\`${key}\``).join(', ');
  const placeholders = Object.keys(data).map(() => '?').join(', ');
  const values = Object.values(data);

  const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
  return executeQuery<ResultSetHeader>(query, values);
}

export async function update(table: string, id: string, data: Record<string, unknown>) {
  const setClause = Object.keys(data)
    .map((key) => `\`${key}\` = ?`)
    .join(', ');
  const values = [...Object.values(data), id];

  const query = `UPDATE ${table} SET ${setClause} WHERE id = ?`;
  return executeQuery<ResultSetHeader>(query, values);
}

export async function deleteById(table: string, id: string) {
  const query = `DELETE FROM ${table} WHERE id = ?`;
  return executeQuery<ResultSetHeader>(query, [id]);
}

export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${crypto.randomBytes(8).toString('hex')}`;
}

export const db = {
  execute,
  executeQuery,
  findMany,
  findById,
  create,
  update,
  deleteById,
  generateId,
};

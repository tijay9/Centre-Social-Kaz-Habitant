const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const { URL } = require('url');

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('DATABASE_URL is not defined');
    process.exit(1);
  }

  const schemaPath = path.join(process.cwd(), 'schema.sql');
  if (!fs.existsSync(schemaPath)) {
    console.error('schema.sql not found at', schemaPath);
    process.exit(1);
  }

  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  // Parse DATABASE_URL into a config object for mysql2
  const parsed = new URL(dbUrl);
  const connectionConfig = {
    host: parsed.hostname,
    port: parsed.port ? parseInt(parsed.port, 10) : 3306,
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, ''),
    multipleStatements: true,
  };

  console.log('Connecting to database...', connectionConfig.host, connectionConfig.port);
  const connection = await mysql.createConnection(connectionConfig);

  try {
    console.log('Running schema.sql ...');
    await connection.query(schemaSql);
    console.log('Database migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

main().catch((err) => {
  console.error('Unexpected error in migration script:', err);
  process.exit(1);
});

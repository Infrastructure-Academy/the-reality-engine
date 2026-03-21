import fs from 'fs';
import { createConnection } from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

// Parse DATABASE_URL
const url = new URL(DATABASE_URL);

async function main() {
  const conn = await createConnection({
    host: url.hostname,
    port: parseInt(url.port) || 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1),
    ssl: { rejectUnauthorized: false }
  });

  // Read batch files 2-9
  for (let i = 2; i <= 9; i++) {
    const file = `/home/ubuntu/upload/safe_batch_${i}.sql`;
    if (!fs.existsSync(file)) continue;
    
    const sql = fs.readFileSync(file, 'utf-8');
    try {
      const [result] = await conn.execute(sql);
      console.log(`Batch ${i}: Inserted ${result.affectedRows} rows`);
    } catch (err) {
      console.error(`Batch ${i} error:`, err.message);
    }
  }

  // Verify total
  const [rows] = await conn.execute('SELECT COUNT(*) as total FROM agn_contacts');
  console.log(`\nTotal contacts in database: ${rows[0].total}`);

  await conn.end();
}

main().catch(console.error);

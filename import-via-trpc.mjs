// This script reads batch SQL files and sends them to the running server
// via a simple fetch to a temporary import endpoint
import fs from 'fs';

const BASE_URL = 'http://localhost:3000';

async function importBatch(batchNum) {
  const file = `/home/ubuntu/upload/safe_batch_${batchNum}.sql`;
  if (!fs.existsSync(file)) return 0;
  
  const sql = fs.readFileSync(file, 'utf-8');
  
  try {
    const resp = await fetch(`${BASE_URL}/api/import-contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql })
    });
    const data = await resp.json();
    console.log(`Batch ${batchNum}: ${data.message || data.error}`);
    return data.count || 0;
  } catch (err) {
    console.error(`Batch ${batchNum} error:`, err.message);
    return 0;
  }
}

async function main() {
  let total = 0;
  for (let i = 2; i <= 9; i++) {
    total += await importBatch(i);
  }
  console.log(`\nImported ${total} additional contacts`);
}

main();

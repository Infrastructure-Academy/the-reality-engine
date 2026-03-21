import fs from 'fs';

// Read the extracted contacts
const contacts = JSON.parse(fs.readFileSync('/home/ubuntu/upload/agn_contacts.json', 'utf-8'));

// Build SQL INSERT statements in batches of 50
const batchSize = 50;
const batches = [];

for (let i = 0; i < contacts.length; i += batchSize) {
  const batch = contacts.slice(i, i + batchSize);
  const values = batch.map(c => {
    const name = (c.name || '').replace(/'/g, "''").substring(0, 255);
    const phone = (c.phone || '').replace(/'/g, "''").substring(0, 31);
    const displayName = (c.display_name || '').replace(/'/g, "''").substring(0, 255);
    const msgCount = c.message_count || 0;
    const firstMsg = (c.first_message || '').replace(/'/g, "''").substring(0, 31);
    const lastMsg = (c.last_message || '').replace(/'/g, "''").substring(0, 31);
    return `('${name}', '${phone}', '${displayName}', ${msgCount}, '${firstMsg}', '${lastMsg}', 'whatsapp_agn')`;
  }).join(',\n');
  
  batches.push(`INSERT INTO agn_contacts (name, phone, displayName, messageCount, firstMessage, lastMessage, source) VALUES\n${values};`);
}

// Write all SQL to a file
const sql = batches.join('\n\n');
fs.writeFileSync('/home/ubuntu/upload/import_contacts.sql', sql);
console.log(`Generated SQL for ${contacts.length} contacts in ${batches.length} batches`);
console.log(`SQL file: /home/ubuntu/upload/import_contacts.sql`);

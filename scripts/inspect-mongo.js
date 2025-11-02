#!/usr/bin/env node
/* Quick readonly inspector for MongoDB used by the backend.
   - Loads MONGO_URI from .env
   - Connects with mongoose
   - Lists collections and prints up to 5 documents per collection
   - Redacts common sensitive fields
*/
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const util = require('util');

dotenv.config({ path: require('path').resolve(__dirname, '..', '.env') });
const uri = process.env.MONGO_URI;

if (!uri) {
  console.error('MONGO_URI not found in .env. Aborting.');
  process.exit(1);
}

const redact = (doc) => {
  const copy = JSON.parse(JSON.stringify(doc));
  const sensitive = ['password', 'hashedPassword', 'token', 'jwt', 'resetToken', 'emailVerificationToken'];
  const redactRec = (o) => {
    if (!o || typeof o !== 'object') return;
    for (const k of Object.keys(o)) {
      if (sensitive.includes(k.toLowerCase())) {
        o[k] = '<REDACTED>';
      } else if (typeof o[k] === 'object') {
        redactRec(o[k]);
      }
    }
  };
  redactRec(copy);
  return copy;
};

async function run() {
  try {
    await mongoose.connect(uri, { dbName: undefined, connectTimeoutMS: 5000 });
  } catch (e) {
    console.error('Failed to connect to MongoDB:', e.message || e);
    process.exit(1);
  }

  const db = mongoose.connection.db;
  const cols = await db.listCollections().toArray();
  console.log('Found collections:', cols.map(c => c.name).join(', ') || '(none)');

  for (const c of cols) {
    console.log('\nCollection:', c.name);
    try {
      const docs = await db.collection(c.name).find({}).limit(5).toArray();
      if (docs.length === 0) {
        console.log('  (no documents)');
        continue;
      }
      for (const d of docs) {
        console.log(util.inspect(redact(d), { depth: 4, colors: false }));
      }
    } catch (e) {
      console.error('  Error reading collection', c.name, e.message || e);
    }
  }

  await mongoose.disconnect();
}

run().catch(e => {
  console.error('Unexpected error:', e);
  process.exit(1);
});

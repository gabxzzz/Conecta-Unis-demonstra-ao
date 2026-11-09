import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const dataDir = path.join(__dirname, '..', 'data');
export const dbFile = path.join(dataDir, 'db.json');

const emptyDb = {
  users: [],
  companies: [],
  opportunities: [],
  applications: [],
  notifications: [],
  resets: []
};

export function readDb() {
  if (!fs.existsSync(dbFile)) {
    return structuredClone(emptyDb);
  }
  return JSON.parse(fs.readFileSync(dbFile, 'utf8'));
}

export function writeDb(db) {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(dbFile, JSON.stringify(db, null, 2), 'utf8');
}

export function mutate(fn) {
  const db = readDb();
  const result = fn(db);
  writeDb(db);
  return result;
}

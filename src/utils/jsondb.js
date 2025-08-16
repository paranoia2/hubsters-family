import { JSONDB } from 'tiny-jsondb';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const base = path.join(__dirname, '../../data');

export function getDb(name){
  return new JSONDB(path.join(base, name + '.json'));
}

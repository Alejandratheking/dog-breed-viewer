import Database from 'better-sqlite3';
import { join } from 'path';
import { mkdirSync } from 'fs';

const dbDir = join(process.cwd(), 'db');
mkdirSync(dbDir, { recursive: true });

const dbPath = join(dbDir, 'favourites.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS favourites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image_url TEXT UNIQUE NOT NULL,
    breed TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export interface Favourite {
  id: number;
  image_url: string;
  breed: string;
  created_at: string;
}

const getFavouritesStmt = db.prepare('SELECT * FROM favourites ORDER BY created_at DESC');
const addFavouriteStmt = db.prepare('INSERT INTO favourites (image_url, breed) VALUES (?, ?)');
const removeFavouriteStmt = db.prepare('DELETE FROM favourites WHERE image_url = ?');

export const getFavourites = () => getFavouritesStmt.all() as Favourite[];
export const addFavourite = (imageUrl: string, breed: string) => addFavouriteStmt.run(imageUrl, breed);
export const removeFavourite = (imageUrl: string) => removeFavouriteStmt.run(imageUrl);
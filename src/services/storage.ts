// src/services/storage.ts — Local file storage replacing S3
import fs from 'fs';
import path from 'path';

const BASE_DIR = process.env.VERCEL ? '/tmp/.smartalloc-data' : path.join(process.cwd(), '.smartalloc-data');

export async function uploadToS3(key: string, data: string) {
  const dir = path.dirname(path.join(BASE_DIR, key));
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(BASE_DIR, key), data);
  console.log(`[Storage] Saved report: ${key}`);
}

export async function getFromS3(key: string) {
  const filePath = path.join(BASE_DIR, key);
  if (!fs.existsSync(filePath)) return null;
  return { Body: fs.readFileSync(filePath, 'utf-8') };
}

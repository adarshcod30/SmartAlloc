// src/aws/s3.ts — Local file storage replacing S3 (no AWS needed)
import fs from 'fs';
import path from 'path';

const REPORTS_DIR = path.join(process.cwd(), '.smartalloc-data', 'reports');

export async function uploadToS3(key: string, data: string) {
  const dir = path.dirname(path.join(process.cwd(), '.smartalloc-data', key));
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(process.cwd(), '.smartalloc-data', key), data);
  console.log(`[Storage] Saved report: ${key}`);
}

export async function getFromS3(key: string) {
  const filePath = path.join(process.cwd(), '.smartalloc-data', key);
  if (!fs.existsSync(filePath)) return null;
  return { Body: fs.readFileSync(filePath, 'utf-8') };
}

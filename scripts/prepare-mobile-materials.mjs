import sharp from 'sharp'
import { readdir, mkdir } from 'node:fs/promises'
const root = new URL('../public/assets/materials/', import.meta.url)
await mkdir(new URL('mobile/', root), { recursive: true })
for (const name of await readdir(root)) {
  if (name.endsWith('.jpg')) await sharp(new URL(name, root).pathname).resize(512, 512, { fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 90 }).toFile(new URL('mobile/' + name, root).pathname)
}

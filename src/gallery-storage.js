const DATABASE = 'crtyss-photography'
const STORE = 'works'

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE, 1)
    request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: 'id' })
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function transact(mode, operation) {
  const database = await openDatabase()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE, mode)
    const request = operation(transaction.objectStore(STORE))
    transaction.oncomplete = () => { database.close(); resolve(request.result) }
    transaction.onerror = () => { database.close(); reject(transaction.error) }
    transaction.onabort = () => { database.close(); reject(transaction.error) }
  })
}

export const readSavedPhotos = () => transact('readonly', (store) => store.getAll())
export const deleteSavedPhoto = (id) => transact('readwrite', (store) => store.delete(id))
export const savePhotos = (photos) => transact('readwrite', (store) => {
  let request
  for (const photo of photos) request = store.put(photo)
  return request
})

function encode(canvas, quality) {
  return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('encode')), 'image/jpeg', quality))
}

export async function preparePhoto(file, { title, description, category }) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('format')
  if (file.size > 25 * 1024 * 1024) throw new Error('size')
  let image
  try { image = await createImageBitmap(file, { imageOrientation: 'from-image' }) } catch { throw new Error('decode') }
  try {
    const canvas = document.createElement('canvas')
    const render = async (maximum, quality) => {
      const scale = Math.min(1, maximum / Math.max(image.width, image.height))
      canvas.width = Math.max(1, Math.round(image.width * scale))
      canvas.height = Math.max(1, Math.round(image.height * scale))
      const context = canvas.getContext('2d')
      context.fillStyle = '#fff'
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      return encode(canvas, quality)
    }
    const full = await render(2400, .92)
    const thumbnail = await render(800, .85)
    return {
      id: typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : Array.from(crypto.getRandomValues(new Uint8Array(16)), byte => byte.toString(16).padStart(2, '0')).join(''),
      title: title.trim() || file.name.replace(/\.[^.]+$/, ''),
      description: description.trim(), category, width: image.width, height: image.height,
      full, thumbnail, createdAt: Date.now(),
    }
  } finally { image.close() }
}

export async function api(path, options = {}) {
  const response = await fetch(path, { ...options, headers: { 'X-Admin-Request': '1', ...options.headers }, credentials: 'same-origin' })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || '请求失败')
  return data
}
export const loadContent = () => api('/api/content')
export async function uploadImage(file) {
  const form = new FormData(); form.append('image', file)
  return api('/api/admin/upload', { method: 'POST', body: form })
}

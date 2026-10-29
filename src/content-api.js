export async function api(path, options = {}) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)
  try {
    const response = await fetch(path, { ...options, signal: options.signal || controller.signal, headers: { 'X-Admin-Request': '1', ...options.headers }, credentials: 'same-origin' })
    if (!response.headers.get('content-type')?.includes('application/json')) throw new Error('服务响应异常，请稍后重试')
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || '请求失败')
    return data
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('连接超时，请重试')
    throw error
  } finally { clearTimeout(timeout) }
}
export const loadContent = async () => {
  const data = await api('/api/content')
  if (!Array.isArray(data.projects) || !Array.isArray(data.photos)) throw new Error('作品数据异常，请重试')
  return data
}
export async function uploadImage(file) {
  const form = new FormData(); form.append('image', file)
  return api('/api/admin/upload', { method: 'POST', body: form })
}

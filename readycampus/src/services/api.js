const apiBase = import.meta.env.VITE_API_BASE_URL

async function post(path, payload) {
  const response = await fetch(`${apiBase}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) throw new Error('The service could not accept your request. Please try again later.')
  return response.json()
}

export async function createOrderRequest(order) {
  if (!apiBase) return { connected: false }
  return { connected: true, order: await post('/orders', order) }
}

export async function submitContactMessage(message) {
  if (!apiBase) return { connected: false, reason: 'No contact service is configured. Your message was not sent.' }
  return { connected: true, result: await post('/contact', message) }
}

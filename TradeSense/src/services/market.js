const API_BASE = 'https://api.coingecko.com/api/v3'

async function handleResponse(response) {
  if (!response.ok) {
    let detail = ''

    try {
      const data = await response.clone().json()
      detail = data?.status?.error_message || data?.error || ''
      if (!detail && Object.keys(data || {}).length) {
        detail = JSON.stringify(data)
      }
    } catch (jsonError) {
      try {
        detail = await response.text()
      } catch (textError) {
        detail = ''
      }
    }

    const message = detail ? `请求失败：${response.status} ${detail}` : `请求失败：${response.status}`
    throw new Error(message)
  }

  return response.json()
}

export async function fetchMarketChart({ coinId = 'bitcoin', vsCurrency = 'usd', days = 7, interval } = {}) {
  const safeCoinId = encodeURIComponent(coinId)
  const url = new URL(`${API_BASE}/coins/${safeCoinId}/market_chart`)
  url.searchParams.set('vs_currency', vsCurrency)
  url.searchParams.set('days', String(days))

  if (interval) {
    const normalized = String(interval).toLowerCase()
    const isHourly = normalized === 'hourly'
    if (isHourly && Number(days) > 1) {
      console.warn('CoinGecko 将 interval=hourly 限定为仅企业用户或 days <= 1，将忽略该参数。')
    } else {
      url.searchParams.set('interval', interval)
    }
  }

  const response = await fetch(url.toString())
  return handleResponse(response)
}

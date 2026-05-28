export function formatZMW(amount: number | string, options?: { decimals?: number }) {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount
  const decimals = options?.decimals ?? 2
  return new Intl.NumberFormat('en-ZM', { style: 'currency', currency: 'ZMW', minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value)
}

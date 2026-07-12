type LogLevel = 'info' | 'warn' | 'error'

export function logProductionEvent(event: string, details?: Record<string, unknown>, level: LogLevel = 'info') {
  const payload = {
    event,
    level,
    timestamp: new Date().toISOString(),
    ...details
  }

  if (process.env.NODE_ENV === 'test') {
    return payload
  }

  console[level](JSON.stringify(payload))
  return payload
}

export async function captureError(error: unknown, context?: Record<string, unknown>) {
  const payload = logProductionEvent('application_error', { error: error instanceof Error ? error.message : String(error), context }, 'error')

  if (process.env.SENTRY_DSN) {
    // Placeholder for future Sentry integration.
  }

  return payload
}

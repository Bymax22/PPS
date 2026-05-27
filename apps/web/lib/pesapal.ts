// Pesapal stub - fill with real SDK or HTTP calls to Pesapal API
export async function createPesapalIframe(order) {
  // order = { amount, currency, description, callback_url }
  return { iframeUrl: 'https://pesapal-stub.example/checkout' }
}

export async function verifyPesapalNotification(body) {
  // verify IPN callback signature
  return { ok: true }
}

// Stripe integration stub — payment handling via Pesapal + mobile money
// To re-enable Stripe: npm install stripe and uncomment below

// import Stripe from 'stripe'
// const stripeSecret = process.env.STRIPE_SECRET_KEY || ''
// export const stripe = new Stripe(stripeSecret, { apiVersion: '2022-11-15' })

export function createCheckoutSessionLineItems(items) {
  // items = [{ price: 'price_abc', quantity: 1 }] or simple fallback
  return items
}

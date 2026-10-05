import { createHmac } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import {
  escapeXml,
  normalizeZambianPhone,
  readXmlValue,
  verifyBroadPaySignature,
} from './paymentGateways'

describe('mobile money payment helpers', () => {
  it('normalizes Zambian mobile numbers without accepting malformed numbers', () => {
    expect(normalizeZambianPhone('0971 234 567')).toBe('+260971234567')
    expect(normalizeZambianPhone('+260971234567')).toBe('+260971234567')
    expect(normalizeZambianPhone('071234567')).toBeNull()
  })

  it('escapes and reads XML values safely', () => {
    expect(escapeXml(`A&B <"school">`)).toBe('A&amp;B &lt;&quot;school&quot;&gt;')
    expect(readXmlValue('<API3G><Result>000</Result></API3G>', 'Result')).toBe('000')
    expect(readXmlValue('<API3G><Result>000</Result></API3G>', 'TransToken')).toBeNull()
  })

  it('verifies BroadPay signatures over the declared fields and requires signed status and reference', () => {
    const secret = 'test-secret'
    const fields = 'merchantReference,status,amount,currency'
    const payload = {
      merchantReference: 'PPS-reference',
      status: 'TXN_AUTH_SUCCESSFUL',
      amount: 10,
      currency: 'ZMW',
      signedFields: fields,
    }
    const canonical = [
      `merchantReference=${payload.merchantReference}`,
      `status=${payload.status}`,
      `amount=${payload.amount}`,
      `currency=${payload.currency}`,
    ].join(',')
    const signature = createHmac('sha256', secret).update(canonical).digest('base64')

    expect(verifyBroadPaySignature({ ...payload, signature }, secret)).toBe(true)
    expect(verifyBroadPaySignature({
      ...payload,
      signature,
      signedFields: 'merchantReference,amount,currency',
    }, secret)).toBe(false)
    expect(verifyBroadPaySignature({ ...payload, signature: 'invalid' }, secret)).toBe(false)
  })
})

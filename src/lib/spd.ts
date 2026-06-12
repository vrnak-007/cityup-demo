// Builds a valid Short Payment Descriptor (SPD 1.0) string for Czech QR payments.
// Scanned by Czech banking apps to prefill a transfer.
export interface SpdParams {
  account: string // IBAN, e.g. CZ6508000000001234567890
  amount: number
  vs: string // variabilní symbol
  message: string
}

// Strip combining diacritical marks (U+0300–U+036F) so the SPD message is plain ASCII.
const DIACRITICS = /[̀-ͯ]/g

export function buildSpd({ account, amount, vs, message }: SpdParams): string {
  const am = amount.toFixed(2)
  const msg = message.normalize('NFD').replace(DIACRITICS, '').toUpperCase()
  return `SPD*1.0*ACC:${account}*AM:${am}*CC:CZK*X-VS:${vs}*MSG:${msg}`
}

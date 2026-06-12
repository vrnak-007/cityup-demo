import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

interface Props {
  value: string
  size?: number
}

// Renders a real, scannable QR as a PNG data URL.
export function QrCode({ value, size = 240 }: Props) {
  const [src, setSrc] = useState<string>('')

  useEffect(() => {
    let active = true
    QRCode.toDataURL(value, {
      width: size,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark: '#262626', light: '#ffffff' },
    })
      .then((url) => {
        if (active) setSrc(url)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [value, size])

  return (
    <img
      src={src}
      width={size}
      height={size}
      alt="QR kód pro platbu"
      style={{ width: size, height: size }}
    />
  )
}

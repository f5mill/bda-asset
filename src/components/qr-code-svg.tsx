"use client"

import { QRCodeSVG } from "qrcode.react"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

type QrCodeProps = {
  path: string
  className?: string
}

export function QrCodeSvg({ path, className }: QrCodeProps) {
  const [url, setUrl] = useState("")

  useEffect(() => {
    // This effect runs only on the client, after hydration
    setUrl(`${window.location.origin}${path}`)
  }, [path])

  if (!url) {
    // To avoid hydration mismatch, we'll render a placeholder on the server and during the initial client render.
    return <div className={cn("w-full h-full bg-muted animate-pulse", className)} />
  }

  return (
    <QRCodeSVG
      value={url}
      size={256} // This will be scaled by the container
      bgColor="#ffffff"
      fgColor="#000000"
      level="L"
      includeMargin={false}
      className={cn("w-full h-full", className)}
    />
  )
}

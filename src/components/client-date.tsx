"use client"

import { useState, useEffect } from 'react'

type ClientDateProps = {
  date: string | number | Date
  options?: Intl.DateTimeFormatOptions
  locale?: string
  format?: 'toLocaleString' | 'toLocaleDateString' | 'toLocaleTimeString'
}

export function ClientDate({ date, options, locale, format = 'toLocaleString' }: ClientDateProps) {
  const [dateString, setDateString] = useState('')

  useEffect(() => {
    // This effect runs only on the client, after hydration
    const d = new Date(date);
    let formatted: string;
    switch (format) {
      case 'toLocaleDateString':
        formatted = d.toLocaleDateString(locale, options);
        break;
      case 'toLocaleTimeString':
        formatted = d.toLocaleTimeString(locale, options);
        break;
      default:
        formatted = d.toLocaleString(locale, options);
    }
    setDateString(formatted);
  }, [date, format, locale, options]);

  // Render nothing on the server and during initial client render to avoid mismatch
  if (!dateString) {
    return null;
  }

  return <>{dateString}</>
}

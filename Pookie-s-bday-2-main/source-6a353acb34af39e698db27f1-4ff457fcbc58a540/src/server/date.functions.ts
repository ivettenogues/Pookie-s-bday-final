import { createServerFn } from '@tanstack/react-start'

export const getServerDate = createServerFn().handler(async () => {
  const now = new Date()
  // Use Paris timezone (Europe/Paris = UTC+2 in summer / CEST)
  const parisDate = now.toLocaleDateString('en-CA', { timeZone: 'Europe/Paris' })
  const tahitiDate = now.toLocaleDateString('en-CA', { timeZone: 'Pacific/Tahiti' })
  return {
    parisDate,
    tahitiDate,
    timestamp: now.getTime(),
  }
})

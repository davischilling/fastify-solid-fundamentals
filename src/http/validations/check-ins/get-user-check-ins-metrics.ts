import { z } from 'zod'

export const getUserCheckInsMetricsBodySchema = z.object({
  userId: z.string(),
})

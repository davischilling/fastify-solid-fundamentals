import { z } from 'zod'

export const getUserCheckInsHistoryBodySchema = z.object({
  userId: z.string(),
  page: z.number().optional(),
})

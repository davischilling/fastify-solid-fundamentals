import { z } from 'zod'

export const getGymsbyFiltersBodySchema = z.object({
  filters: z
    .object({
      name: z.string(),
    })
    .optional(),
  page: z.number().optional(),
  orderBy: z
    .object({
      name: z.enum(['asc', 'desc']),
    })
    .optional(),
})

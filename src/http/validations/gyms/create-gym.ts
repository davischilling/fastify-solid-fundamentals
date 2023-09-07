import { z } from 'zod'

export const createGymBodySchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  phone: z.string().nullable(),
})

import { z } from 'zod'

export const getNearbyGymsBodySchema = z.object({
  userLatitude: z.number(),
  userLongitude: z.number(),
})

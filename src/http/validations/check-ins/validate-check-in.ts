import { z } from 'zod'

export const ValidateCheckInBodySchema = z.object({
  checkInId: z.string(),
})

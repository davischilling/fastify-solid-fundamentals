import { Gym } from '@prisma/client'

export const gymMapper = (gym: Gym) => {
  return {
    id: gym.id,
    latitude: gym.latitude.toNumber(),
    longitude: gym.longitude.toNumber(),
    name: gym.name,
    description: gym.description,
    phone: gym.phone,
  }
}

import { PrismaGymsRepository } from '@/repositories'
import { GetNearByGymsUsecase } from '@/use-cases/gyms'

export const makeGetNearByGymsUsecase = () => {
  return new GetNearByGymsUsecase(new PrismaGymsRepository())
}

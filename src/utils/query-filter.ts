/* eslint-disable @typescript-eslint/no-explicit-any */
export const queryFilter = (filters?: any) => {
  if (!filters) return {}
  const where = {} as any
  for (const key in filters) {
    if (filters[key]) {
      where[key] = {
        contains: filters[key],
      }
    }
  }
  return { ...where }
}

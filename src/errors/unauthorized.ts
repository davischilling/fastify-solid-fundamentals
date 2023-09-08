export class UnathorizedError extends Error {
  constructor() {
    super('Unauthorized')
  }
}

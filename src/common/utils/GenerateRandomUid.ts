/**
 * Generates a random UID.
 * @returns A random UID.
 */
export const generateRandomUid = () => {
  return Math.random().toString(36).slice(2, 9);
}

import seedrandom from 'seedrandom';

/**
 * Create a seeded random number generator
 */
export function createSeededRandom(seed: string) {
  const rng = seedrandom(seed);
  
  return {
    /**
     * Get a random number between 0 and 1
     */
    random: () => rng(),
    
    /**
     * Get a random integer between min (inclusive) and max (exclusive)
     */
    randomInt: (min: number, max: number) => {
      return Math.floor(rng() * (max - min)) + min;
    },
    
    /**
     * Shuffle an array using Fisher-Yates algorithm with seeded randomness
     */
    shuffle: <T>(array: T[]): T[] => {
      const result = [...array];
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    }
  };
}

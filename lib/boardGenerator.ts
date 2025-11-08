import { createSeededRandom } from './prng';
import { BoardData, Team, Tile } from '@/types';

/**
 * Generate a deterministic Codenames board from a seed and vocabulary
 * 
 * @param seed - Seed string for deterministic generation
 * @param vocabulary - Array of words to use
 * @param gridSize - Size of the grid (default: 25 for 5x5)
 * @returns BoardData with tiles and team assignments
 */
export function generateBoard(
  seed: string,
  vocabulary: string[],
  gridSize: number = 25
): BoardData {
  if (vocabulary.length < gridSize) {
    throw new Error(`Vocabulary must have at least ${gridSize} words`);
  }

  const rng = createSeededRandom(seed);
  
  // Shuffle vocabulary and take first gridSize words
  const shuffledWords = rng.shuffle(vocabulary);
  const selectedWords = shuffledWords.slice(0, gridSize);
  
  // Determine which team starts (random)
  const teamStart: Team = rng.random() < 0.5 ? "red" : "blue";
  
  // Standard Codenames distribution:
  // Starting team: 9 cards
  // Other team: 8 cards
  // Neutral: 7 cards
  // Assassin: 1 card
  const teams: Team[] = [];
  
  if (teamStart === "red") {
    teams.push(...Array(9).fill("red"));
    teams.push(...Array(8).fill("blue"));
  } else {
    teams.push(...Array(9).fill("blue"));
    teams.push(...Array(8).fill("red"));
  }
  
  teams.push(...Array(7).fill("neutral"));
  teams.push("assassin");
  
  // Shuffle team assignments
  const shuffledTeams = rng.shuffle(teams);
  
  // Create tiles
  const tiles: Tile[] = selectedWords.map((word, index) => ({
    word: word.toUpperCase(),
    team: shuffledTeams[index],
    guessed: false,
    index
  }));
  
  return {
    seed,
    tiles,
    teamStart
  };
}

/**
 * Generate a random seed string
 */
export function generateRandomSeed(): string {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}

export type Team = "red" | "blue" | "neutral" | "assassin";
export type Role = "master" | "guesser";

export interface Tile {
  word: string;
  team: Team;
  guessed: boolean;
  index: number;
}

export interface BoardData {
  seed: string;
  tiles: Tile[];
  teamStart: Team;
}

export interface VocabularySet {
  title: string;
  language: string;
  words: string[];
}

export interface VocabularyManifest {
  languages: {
    [key: string]: {
      name: string;
      sets: {
        [key: string]: string;
      };
    };
  };
}

export interface GameParams {
  seed: string;
  role: Role;
  lang: string;
  set: string;
}

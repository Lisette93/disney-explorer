import type { Character } from "../src/types";

type DisneyResponse = {
  data: Character[];
};

export async function fetchCharacters(): Promise<Character[]> {
  const response = await fetch("https://api.disneyapi.dev/character");

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const json: DisneyResponse = await response.json();

  return json.data;
}

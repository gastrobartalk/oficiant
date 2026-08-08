import type { Mode } from "./game";

export type GameHistory = {
  id: number;
  mode: Mode;
  score: number; // 0–100
  result: "win" | "lose";
  ratingChange: number;
  teaChange: number;
  date: string;
};

const STORAGE_KEY = "history";
const LIMIT = 50; // храним последние 50 партий

export function getHistory(): GameHistory[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];
  try {
    return JSON.parse(saved) as GameHistory[];
  } catch {
    return [];
  }
}

export function addHistory(entry: GameHistory) {
  const history = getHistory();
  history.unshift(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, LIMIT)));
}

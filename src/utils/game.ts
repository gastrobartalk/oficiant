// Вся математика игры: сборка партии, подсчёт баллов, рейтинг и чай.

import { BALANCE, CATEGORIES, RATING_WIN, RATING_LOSS } from "../config";
import { QUESTIONS } from "../data/questions";
import type { Question } from "../data/questions";
import type { Player } from "./player";

export type Mode = "training" | "ranked";

// Ответ игрока на один вопрос партии
export type Turn = {
  question: Question;
  quality: 0 | 1 | 2;
  points: number; // quality * стоимость категории
  max: number; // 2 * стоимость категории
  timedOut: boolean;
};

// Перемешивание (метод Фишера — Йетса, честный в отличие от sort со случайным числом)
export function shuffle<T>(list: T[]): T[] {
  const result = [...list];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Собираем партию. Пока банк маленький — берём случайные вопросы.
// Когда наберём 360 вопросов, здесь появится рецепт по слотам категорий.
export function buildGame(): Question[] {
  const count = Math.min(BALANCE.QUESTIONS_PER_GAME, QUESTIONS.length);
  return shuffle(QUESTIONS).slice(0, count);
}

export function questionWeight(question: Question): number {
  return CATEGORIES[question.category].weight;
}

// Счёт партии по шкале 0–100, независимо от того, какие вопросы выпали.
export function scoreOf(turns: Turn[]): number {
  const max = turns.reduce((sum, turn) => sum + turn.max, 0);
  if (max === 0) return 0;
  const points = turns.reduce((sum, turn) => sum + turn.points, 0);
  return Math.round((points / max) * 100);
}

export function isWin(score: number): boolean {
  return score >= BALANCE.WIN_THRESHOLD;
}

export function ratingDelta(score: number): number {
  const table = isWin(score) ? RATING_WIN : RATING_LOSS;
  for (const row of table) {
    if (score >= row.from) return row.delta;
  }
  return 0;
}

export type GameResult = {
  score: number;
  win: boolean;
  ratingBefore: number;
  ratingAfter: number;
  ratingDelta: number;
  teaEarned: number;
  calibration: boolean; // партия попала в первые 10, рейтинг не отнимался
  streakBonus: boolean;
};

// Применяем итог партии к игроку и возвращаем, что показать на экране.
export function applyResult(player: Player, turns: Turn[], mode: Mode): GameResult {
  const score = scoreOf(turns);
  const win = isWin(score);
  const ratingBefore = player.rating;

  let teaEarned = 0;
  let delta = 0;
  let calibration = false;
  let streakBonus = false;

  if (mode === "training") {
    const room = Math.max(0, BALANCE.TRAINING_TEA_PER_DAY - player.trainingTeaToday);
    teaEarned = Math.min(BALANCE.TEA_FOR_TRAINING_GAME, room);
    player.trainingTeaToday += teaEarned;
  } else {
    delta = ratingDelta(score);

    // первые партии не отнимают рейтинг — игрок осваивается
    if (delta < 0 && player.rankedGames < BALANCE.CALIBRATION_GAMES) {
      delta = 0;
      calibration = true;
    }

    // защита низкого рейтинга
    if (delta < 0 && player.rating < 150) {
      delta = Math.round(delta / 2);
    }

    player.rating = Math.max(0, player.rating + delta);
    player.rankedGames += 1;
    player.rankedToday += 1;

    if (win) {
      player.wins += 1;
      player.winStreak += 1;
      teaEarned += BALANCE.TEA_FOR_WIN;

      if (score === 100) teaEarned += BALANCE.TEA_FOR_PERFECT;

      if (player.winStreak % BALANCE.WIN_STREAK_STEP === 0) {
        teaEarned += BALANCE.TEA_FOR_WIN_STREAK;
        streakBonus = true;
      }
    } else {
      player.winStreak = 0;
      teaEarned += BALANCE.TEA_FOR_LOSS;
    }
  }

  player.tea += teaEarned;

  return {
    score,
    win,
    ratingBefore,
    ratingAfter: player.rating,
    ratingDelta: delta,
    teaEarned,
    calibration,
    streakBonus,
  };
}

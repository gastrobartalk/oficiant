// ============================================================
// НАСТРОЙКИ БАЛАНСА ИГРЫ «ОФИЦИАНТ»
// ------------------------------------------------------------
// Это единственный файл, где нужно менять цифры.
// Всё остальное приложение берёт значения отсюда.
// ============================================================

export const BALANCE = {
  // --- Игра ---
  QUESTIONS_PER_GAME: 5, // сколько вопросов в одной игре
  SECONDS_PER_QUESTION: 45, // время на один вопрос

  // --- Победа ---
  WIN_THRESHOLD: 76, // счёт от этого числа и выше = победа (шкала 0–100)

  // --- Лимиты в сутки ---
  RANKED_GAMES_PER_DAY: 5, // сколько рейтинговых игр можно сыграть за день
  TRAINING_TEA_PER_DAY: 6, // потолок чая с тренировочных игр за день

  // --- Стартовые значения ---
  START_RATING: 300,
  CALIBRATION_GAMES: 10, // первые N рейтинговых игр не отнимают рейтинг

  // --- Чай ---
  TEA_FOR_WIN: 3,
  TEA_FOR_LOSS: 0,
  TEA_FOR_PERFECT: 10, // дополнительно за счёт 100
  TEA_FOR_TRAINING_GAME: 1,
  TEA_FOR_WIN_STREAK: 10, // за каждые 3 победы подряд
  WIN_STREAK_STEP: 3,
  DAILY_LOGIN_TEA_MAX: 5, // потолок ежедневного бонуса (1, 2, 3, 4, 5, 5, 5...)
} as const;

// --- Изменение рейтинга по счёту игры ---
// Победа: чем выше счёт, тем больше прибавка.
export const RATING_WIN = [
  { from: 100, delta: 21 },
  { from: 94, delta: 20 },
  { from: 88, delta: 19 },
  { from: 82, delta: 18 },
  { from: 76, delta: 17 },
];

// Поражение: чем ближе к победе, тем меньше потеря.
export const RATING_LOSS = [
  { from: 61, delta: -14 },
  { from: 41, delta: -17 },
  { from: 0, delta: -20 },
];

// --- Категории вопросов и их стоимость ---
// Стоимость умножается на качество ответа (0, 1 или 2).
export const CATEGORIES = {
  order: { title: "Внутренние порядки", weight: 1, color: "#A2929C" },
  team: { title: "Работа в команде", weight: 1, color: "#8FA8B8" },
  service: { title: "Сервис и гости", weight: 2, color: "#C9A227" },
  kitchen: { title: "Кухня и меню", weight: 3, color: "#D98A4A" },
  bar: { title: "Бар", weight: 3, color: "#6FBF9B" },
  wine: { title: "Вино", weight: 4, color: "#B4485F" },
} as const;

export type CategoryId = keyof typeof CATEGORIES;

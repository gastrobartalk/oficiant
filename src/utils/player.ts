import { BALANCE } from "../config";

export type Player = {
  nickname: string;
  avatar: string;
  rating: number;
  tea: number;
  rankedGames: number;
  wins: number;
  winStreak: number;
  isTrainee: boolean;

  // суточные счётчики
  today: string;
  rankedToday: number;
  trainingTeaToday: number;

  // ежедневный вход
  loginStreak: number;
  lastLogin: string;
};

const STORAGE_KEY = "player";

// Игровой день начинается в 6 утра по местному времени телефона.
// Официант, закончивший смену в 2 часа ночи, остаётся во «вчера» —
// его стрик и лимиты не ломаются на полуночи.
const DAY_STARTS_AT = 6; // час

function todayKey(): string {
  const now = new Date();
  now.setHours(now.getHours() - DAY_STARTS_AT);
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function daysBetween(from: string, to: string): number {
  if (!from) return 999;
  const a = new Date(from + "T00:00:00").getTime();
  const b = new Date(to + "T00:00:00").getTime();
  return Math.round((b - a) / 86400000);
}

const defaultPlayer: Player = {
  nickname: "",
  avatar: "🙂",
  rating: BALANCE.START_RATING,
  tea: 0,
  rankedGames: 0,
  wins: 0,
  winStreak: 0,
  isTrainee: true,
  today: todayKey(),
  rankedToday: 0,
  trainingTeaToday: 0,
  loginStreak: 0,
  lastLogin: "",
};

export function getPlayer(): Player {
  const saved = localStorage.getItem(STORAGE_KEY);
  let player: Player;

  if (saved) {
    // объединяем с настройками по умолчанию, чтобы старые сохранения не ломались
    player = { ...defaultPlayer, ...JSON.parse(saved) };
  } else {
    player = { ...defaultPlayer };
  }

  // новый день — обнуляем суточные лимиты
  const today = todayKey();
  if (player.today !== today) {
    player.today = today;
    player.rankedToday = 0;
    player.trainingTeaToday = 0;
  }

  savePlayer(player);
  return player;
}

export function savePlayer(player: Player) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
}

// Ежедневный бонус: 1, 2, 3, 4, 5, дальше по 5.
// Один пропущенный день не сбрасывает счётчик, а останавливает его.
// Два пропуска подряд — начинаем сначала.
export function claimDailyBonus(): number {
  const player = getPlayer();
  const today = todayKey();

  if (player.lastLogin === today) return 0;

  const gap = daysBetween(player.lastLogin, today);

  if (gap === 1) {
    player.loginStreak = Math.min(player.loginStreak + 1, BALANCE.DAILY_LOGIN_TEA_MAX);
  } else if (gap === 2) {
    player.loginStreak = Math.max(player.loginStreak, 1);
  } else {
    player.loginStreak = 1;
  }

  const bonus = player.loginStreak;
  player.tea += bonus;
  player.lastLogin = today;

  savePlayer(player);
  return bonus;
}

export function rankedGamesLeft(player: Player): number {
  return Math.max(0, BALANCE.RANKED_GAMES_PER_DAY - player.rankedToday);
}

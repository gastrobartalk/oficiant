// Единый расчёт ранга. Все страницы берут ранг только отсюда,
// чтобы на главной и в профиле никогда не показывалось разное.

import type { Player } from "./player";

export type Rank = {
  title: string;
  icon: string;
  from: number;
  to: number | null; // null = последний ранг
};

export const RANKS: Rank[] = [
  { title: "Официант", icon: "🍽", from: 0, to: 800 },
  { title: "Крутой официант", icon: "⭐", from: 800, to: 1400 },
  { title: "Машина сервиса", icon: "🏆", from: 1400, to: null },
];

export type RankInfo = {
  title: string;
  icon: string;
  next: string | null;
  needed: number | null; // сколько рейтинга до следующего ранга
  progress: number; // 0–100
};

export function getRank(player: Player): RankInfo {
  if (player.isTrainee) {
    return {
      title: "Стажёр",
      icon: "🌱",
      next: "Официант",
      needed: null,
      progress: 0,
    };
  }

  const rating = player.rating;
  let current = RANKS[0];

  for (const rank of RANKS) {
    if (rating >= rank.from) current = rank;
  }

  if (current.to === null) {
    return {
      title: current.title,
      icon: current.icon,
      next: null,
      needed: null,
      progress: 100,
    };
  }

  const span = current.to - current.from;
  const done = rating - current.from;
  const progress = Math.max(0, Math.min(100, Math.round((done / span) * 100)));
  const nextRank = RANKS[RANKS.indexOf(current) + 1];

  return {
    title: current.title,
    icon: current.icon,
    next: nextRank.title,
    needed: current.to - rating,
    progress,
  };
}

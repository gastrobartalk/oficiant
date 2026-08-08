import { getPlayer, rankedGamesLeft } from "../utils/player";
import { getRank } from "../utils/rank";
import { BALANCE } from "../config";
import type { Mode } from "../utils/game";
import type { Page } from "../App";

type HomeProps = {
  dailyBonus: number;
  onStart: (mode: Mode) => void;
  onOpen: (page: Page) => void;
};

function Home({ dailyBonus, onStart, onOpen }: HomeProps) {
  const player = getPlayer();
  const rank = getRank(player);
  const left = rankedGamesLeft(player);

  return (
    <div className="screen">
      <p className="eyebrow">Обучение персонала</p>
      <h1 className="brand">
        ОФИЦИ<span>АНТ</span>
      </h1>

      {dailyBonus > 0 && (
        <div className="card card--flat stack">
          <strong className="brass">+{dailyBonus} чая за вход сегодня</strong>
          <p className="muted" style={{ margin: "6px 0 0" }}>
            {player.loginStreak >= BALANCE.DAILY_LOGIN_TEA_MAX
              ? "Максимальный ежедневный бонус. Не пропускайте два дня подряд."
              : `Заходите завтра — получите +${player.loginStreak + 1}`}
          </p>
        </div>
      )}

      <div className="card stack">
        <div className="rank">
          <div className="rank__icon">{rank.icon}</div>
          <div style={{ flex: 1 }}>
            <div className="rank__title">
              {player.nickname || "Без никнейма"}
            </div>
            <div className="rank__next">
              {rank.title}
              {rank.needed !== null && ` · до «${rank.next}» ${rank.needed}`}
            </div>
          </div>
        </div>
        <div className="bar">
          <div className="bar__fill" style={{ width: `${rank.progress}%` }} />
        </div>
      </div>

      <div className="metrics stack">
        <div className="metric">
          <div className="metric__value">{player.rating}</div>
          <div className="metric__label">Рейтинг</div>
        </div>
        <div className="metric">
          <div className="metric__value">{player.tea}</div>
          <div className="metric__label">Чай</div>
        </div>
        <div className="metric">
          <div className="metric__value">
            {player.wins}/{player.rankedGames}
          </div>
          <div className="metric__label">Победы</div>
        </div>
      </div>

      <div className="stack">
        <button className="btn" onClick={() => onStart("training")}>
          Тренировка
          <span className="btn-note">
            Без рейтинга · до {BALANCE.TRAINING_TEA_PER_DAY} чая в день
          </span>
        </button>

        <button
          className="btn btn--ghost"
          disabled={player.isTrainee || left === 0}
          onClick={() => onStart("ranked")}
        >
          Рейтинговая игра
          <span className="btn-note">
            {player.isTrainee
              ? "Откроется после аттестации у менеджера"
              : left === 0
                ? "Лимит на сегодня исчерпан — приходите завтра"
                : `Осталось сегодня: ${left} из ${BALANCE.RANKED_GAMES_PER_DAY}`}
          </span>
        </button>

        <button className="btn btn--quiet" onClick={() => onOpen("profile")}>
          Открыть профиль
        </button>
      </div>
    </div>
  );
}

export default Home;

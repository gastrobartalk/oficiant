import { useState } from "react";
import { getPlayer, savePlayer } from "../utils/player";
import { getRank } from "../utils/rank";
import { BALANCE } from "../config";

const AVATARS = ["🙂", "👨‍🍳", "👩‍🍳", "🍷", "☕", "⭐", "🍸", "🧑‍🍳"];

function Profile() {
  const [player, setPlayer] = useState(getPlayer());
  const [nickname, setNickname] = useState(player.nickname);
  const [avatar, setAvatar] = useState(player.avatar);
  const [saved, setSaved] = useState(false);

  const rank = getRank(player);
  const changed = nickname !== player.nickname || avatar !== player.avatar;

  function save() {
    const updated = { ...player, nickname: nickname.trim(), avatar };
    savePlayer(updated);
    setPlayer(updated);
    setSaved(true);
  }

  return (
    <div className="screen">
      <p className="eyebrow">Профиль</p>
      <h1 className="page-title">
        {avatar} {nickname || "Без никнейма"}
      </h1>

      <div className="card">
        <div className="rank">
          <div className="rank__icon">{rank.icon}</div>
          <div style={{ flex: 1 }}>
            <div className="rank__title">{rank.title}</div>
            <div className="rank__next">
              {rank.next
                ? `До ранга «${rank.next}» ${rank.needed ?? "—"} рейтинга`
                : "Максимальный ранг"}
            </div>
          </div>
        </div>
        <div className="bar">
          <div className="bar__fill" style={{ width: `${rank.progress}%` }} />
        </div>
        {player.isTrainee && (
          <p className="muted" style={{ marginBottom: 0 }}>
            Рейтинговые игры откроет менеджер после первой аттестации.
          </p>
        )}
      </div>

      <div className="metrics">
        <div className="metric">
          <div className="metric__value">{player.rating}</div>
          <div className="metric__label">Рейтинг</div>
        </div>
        <div className="metric">
          <div className="metric__value">{player.tea}</div>
          <div className="metric__label">Чай</div>
        </div>
        <div className="metric">
          <div className="metric__value">{player.rankedGames}</div>
          <div className="metric__label">Игр в рейтинге</div>
        </div>
        <div className="metric">
          <div className="metric__value">{player.wins}</div>
          <div className="metric__label">Побед</div>
        </div>
        <div className="metric">
          <div className="metric__value">{player.winStreak}</div>
          <div className="metric__label">Серия побед</div>
        </div>
        <div className="metric">
          <div className="metric__value">{player.loginStreak}</div>
          <div className="metric__label">Дней подряд</div>
        </div>
      </div>

      <h2 className="page-title stack">Оформление</h2>

      <div className="avatars">
        {AVATARS.map((item) => (
          <button
            key={item}
            className={avatar === item ? "avatar avatar--active" : "avatar"}
            onClick={() => {
              setAvatar(item);
              setSaved(false);
            }}
          >
            {item}
          </button>
        ))}
      </div>

      <input
        className="field"
        value={nickname}
        maxLength={16}
        placeholder="Никнейм"
        onChange={(e) => {
          setNickname(e.target.value);
          setSaved(false);
        }}
      />

      <button className="btn" onClick={save} disabled={!changed}>
        {saved && !changed ? "Сохранено" : "Сохранить"}
      </button>

      <p className="muted stack">
        Победа даёт от 17 до 21 рейтинга, поражение отнимает от 14 до 20.
        Первые {BALANCE.CALIBRATION_GAMES} рейтинговых игр рейтинг не снижают.
      </p>
    </div>
  );
}

export default Profile;

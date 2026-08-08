import { getHistory } from "../utils/history";

function History() {
  const history = getHistory();

  return (
    <div className="screen">
      <p className="eyebrow">История</p>
      <h1 className="page-title">Сыгранные партии</h1>

      {history.length === 0 ? (
        <div className="empty">
          Здесь появятся ваши партии.
          <br />
          Начните с тренировки — она без риска для рейтинга.
        </div>
      ) : (
        <div className="card">
          {history.map((game) => (
            <div className="row" key={game.id}>
              <div
                className={
                  game.result === "win" ? "row__score good" : "row__score bad"
                }
              >
                {game.score}
              </div>
              <div className="row__meta">
                {game.mode === "ranked" ? "Рейтинговая" : "Тренировка"}
                <br />
                {game.date}
              </div>
              <div className="row__delta">
                {game.mode === "ranked" && (
                  <div className={game.ratingChange >= 0 ? "good" : "bad"}>
                    {game.ratingChange > 0 ? "+" : ""}
                    {game.ratingChange}
                  </div>
                )}
                <div className="brass">+{game.teaChange} ☕</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;

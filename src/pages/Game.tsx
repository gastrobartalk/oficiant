import { useEffect, useMemo, useState } from "react";
import { BALANCE, CATEGORIES } from "../config";
import { getPlayer, savePlayer } from "../utils/player";
import { addHistory } from "../utils/history";
import { applyResult, buildGame, questionWeight, shuffle } from "../utils/game";
import type { GameResult, Mode, Turn } from "../utils/game";
import type { Answer } from "../data/questions";

type GameProps = {
  mode: Mode;
  onExit: () => void;
  onReplay: (mode: Mode) => void;
};

type Phase = "playing" | "review" | "finished";

function Game({ mode, onExit, onReplay }: GameProps) {
  const questions = useMemo(() => buildGame(), []);

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("playing");
  const [seconds, setSeconds] = useState<number>(BALANCE.SECONDS_PER_QUESTION);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [chosen, setChosen] = useState<Answer | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);

  const question = questions[index];
  const category = CATEGORIES[question.category];

  // Порядок ответов перемешивается один раз на вопрос
  const options = useMemo(() => shuffle(question.answers), [question]);

  // Таймер. Перезапускается на каждом вопросе — поэтому больше не «залипает».
  useEffect(() => {
    if (phase !== "playing") return;
    setSeconds(BALANCE.SECONDS_PER_QUESTION);
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [index, phase]);

  // Время вышло — засчитываем как неотвеченный вопрос
  useEffect(() => {
    if (phase === "playing" && seconds <= 0) {
      answer(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds, phase]);

  function answer(picked: Answer | null) {
    const weight = questionWeight(question);
    const quality = picked ? picked.quality : 0;

    setChosen(picked);
    setTurns((prev) => [
      ...prev,
      {
        question,
        quality,
        points: quality * weight,
        max: 2 * weight,
        timedOut: picked === null,
      },
    ]);
    setPhase("review");
  }

  function next(allTurns: Turn[]) {
    if (index < questions.length - 1) {
      setIndex(index + 1);
      setChosen(null);
      setPhase("playing");
      return;
    }

    const player = getPlayer();
    const outcome = applyResult(player, allTurns, mode);
    savePlayer(player);

    addHistory({
      id: Date.now(),
      mode,
      score: outcome.score,
      result: outcome.win ? "win" : "lose",
      ratingChange: outcome.ratingDelta,
      teaChange: outcome.teaEarned,
      date: new Date().toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    setResult(outcome);
    setPhase("finished");
  }

  // ---------- Итог партии ----------
  if (phase === "finished" && result) {
    return (
      <div className="screen">
        <p className="eyebrow">
          {mode === "ranked" ? "Рейтинговая игра" : "Тренировка"}
        </p>

        <div className="receipt">
          <div className="receipt__head">
            <div
              className={
                result.win ? "receipt__score receipt__score--win" : "receipt__score"
              }
            >
              {result.score}
            </div>
            <div className="receipt__verdict">
              {result.win ? "Победа" : "Поражение"} · порог {BALANCE.WIN_THRESHOLD}
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            {turns.map((turn, i) => (
              <div className="receipt__row" key={i}>
                <span>
                  {i + 1}. {CATEGORIES[turn.question.category].title}
                </span>
                <span className={turn.points === turn.max ? "good" : ""}>
                  {turn.points} / {turn.max}
                </span>
              </div>
            ))}

            {mode === "ranked" && (
              <div className="receipt__row">
                <span>Рейтинг</span>
                <span className={result.ratingDelta >= 0 ? "good" : "bad"}>
                  {result.ratingBefore} → {result.ratingAfter}
                </span>
              </div>
            )}

            <div className="receipt__total">
              <span>Чай</span>
              <span className="brass">+{result.teaEarned}</span>
            </div>
          </div>
        </div>

        {result.calibration && (
          <p className="muted stack">
            Калибровочная игра — рейтинг пока не снижается. Осталось{" "}
            {Math.max(0, BALANCE.CALIBRATION_GAMES - getPlayer().rankedGames)} из{" "}
            {BALANCE.CALIBRATION_GAMES}.
          </p>
        )}

        {result.streakBonus && (
          <p className="muted stack brass">
            Серия из {BALANCE.WIN_STREAK_STEP} побед подряд — бонусный чай начислен.
          </p>
        )}

        <div className="stack">
          <button className="btn" onClick={() => onReplay(mode)}>
            Сыграть ещё
          </button>
          <button className="btn btn--ghost" onClick={onExit}>
            На главную
          </button>
        </div>
      </div>
    );
  }

  // ---------- Разбор ответа ----------
  if (phase === "review") {
    const best = question.answers.find((a) => a.quality === 2);
    const currentTurn = turns[turns.length - 1];

    return (
      <div className="screen">
        <div className="game-top">
          <span>
            Вопрос {index + 1} из {questions.length}
          </span>
          <span className="timer">
            {currentTurn.points} / {currentTurn.max}
          </span>
        </div>

        <span className="tag" style={{ color: category.color }}>
          {category.title}
        </span>

        <h2 className="question">{question.text}</h2>

        {options.map((option, i) => {
          let className = "answer";
          if (option.quality === 2) className += " answer--best";
          else if (option === chosen) className += " answer--chosen";
          return (
            <div className={className} key={i}>
              {option.text}
            </div>
          );
        })}

        <div className="explain">
          <span className="explain__label">
            {currentTurn.timedOut
              ? "Время вышло"
              : chosen === best
                ? "Верно"
                : "Разбор"}
          </span>
          {question.explain}
        </div>

        <button className="btn" onClick={() => next(turns)}>
          {index < questions.length - 1 ? "Следующий вопрос" : "Показать итог"}
        </button>
      </div>
    );
  }

  // ---------- Вопрос ----------
  return (
    <div className="screen">
      <div className="game-top">
        <span>
          Вопрос {index + 1} из {questions.length}
        </span>
        <span className={seconds <= 10 ? "timer timer--low" : "timer"}>
          {Math.max(0, seconds)} сек
        </span>
      </div>

      <div className="bar" style={{ marginTop: 0, marginBottom: 18 }}>
        <div
          className="bar__fill"
          style={{ width: `${(index / questions.length) * 100}%` }}
        />
      </div>

      <span className="tag" style={{ color: category.color }}>
        {category.title}
      </span>

      <h2 className="question">{question.text}</h2>

      {options.map((option, i) => (
        <button className="answer" key={i} onClick={() => answer(option)}>
          {option.text}
        </button>
      ))}

      <button className="btn btn--quiet stack" onClick={onExit}>
        Выйти из игры
      </button>
    </div>
  );
}

export default Game;

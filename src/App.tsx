import { useState } from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Profile from "./pages/Profile";
import History from "./pages/History";
import type { Mode } from "./utils/game";
import { claimDailyBonus } from "./utils/player";

export type Page = "home" | "game" | "history" | "profile";

const NAV: { id: Page; icon: string; label: string }[] = [
  { id: "home", icon: "🏠", label: "Главная" },
  { id: "game", icon: "🎯", label: "Игра" },
  { id: "history", icon: "📜", label: "История" },
  { id: "profile", icon: "👤", label: "Профиль" },
];

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState<Page>("home");
  const [mode, setMode] = useState<Mode>("training");
  const [bonus, setBonus] = useState(0);
  const [gameKey, setGameKey] = useState(0);

  function handleLogin() {
    setBonus(claimDailyBonus());
    setLoggedIn(true);
  }

  if (!loggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  function startGame(selected: Mode) {
    setMode(selected);
    setGameKey((n) => n + 1); // новый ключ = игра начинается заново
    setPage("game");
  }

  return (
    <>
      {page === "home" && (
        <Home dailyBonus={bonus} onStart={startGame} onOpen={setPage} />
      )}
      {page === "game" && (
        <Game
          key={gameKey}
          mode={mode}
          onExit={() => setPage("home")}
          onReplay={startGame}
        />
      )}
      {page === "history" && <History />}
      {page === "profile" && <Profile />}

      <nav className="nav">
        {NAV.map((item) => (
          <button
            key={item.id}
            className={
              page === item.id ? "nav__item nav__item--active" : "nav__item"
            }
            onClick={() => {
              if (item.id === "game") {
                setPage("home");
              } else {
                setPage(item.id);
              }
            }}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}

export default App;

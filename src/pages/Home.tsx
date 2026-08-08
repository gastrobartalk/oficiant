import Game from "./Game";
import Profile from "./Profile";
import History from "./History";
import { useState } from "react";
import { getPlayer } from "../utils/player";


function Home() {

  const [page, setPage] = useState("home");

  const player = getPlayer();


  if (page === "game") {
    return <Game />;
  }


  if (page === "history") {
    return <History />;
  }


  if (page === "profile") {
    return <Profile />;
  }


  return (

    <div className="app">

      <div className="card">


        <h1>
          ☕ Официант
        </h1>


        <p className="subtitle">
          Добро пожаловать!
        </p>


        <div className="stats">

          <p>
            ☕ Чай: {player.tea}
          </p>


          <p>
            ⭐ Рейтинг: {player.rating}
          </p>


          <p>
            🏆 Ранг: Официант
          </p>


          <p>
            🎮 Игр сыграно: {player.games}
          </p>


          <p>
            🏅 Побед: {player.wins}
          </p>

        </div>


        <button onClick={() => setPage("game")}>
          🎯 Играть
        </button>


        <button onClick={() => setPage("history")}>
          📜 История игр
        </button>


        <button onClick={() => setPage("profile")}>
          👤 Профиль
        </button>


      </div>

    </div>

  );

}


export default Home;
import { useState } from "react";
import { getHistory } from "../utils/history";
import type { GameHistory } from "../utils/history";


function History() {


  const [history] = useState<GameHistory[]>(
    getHistory()
  );



  return (

    <div className="app">

      <div className="card">


        <h1>
          📜 История игр
        </h1>



        {history.length === 0 ? (


          <p>
            Игр пока нет
          </p>


        ) : (


          history.map((game) => (


            <div
              key={game.id}
              className="stats"
            >


              <h3>

                {game.result === "win"

                  ? "🏆 Победа"

                  : "❌ Поражение"

                }

              </h3>



              <p>

                ⭐ Рейтинг:

                {" "}

                {game.ratingChange > 0

                  ? `+${game.ratingChange}`

                  : game.ratingChange

                }

              </p>



              <p>

                ☕ Чай:

                {" "}

                {game.teaChange > 0

                  ? `+${game.teaChange}`

                  : game.teaChange

                }

              </p>



              <p>

                📅 {game.date}

              </p>



            </div>


          ))

        )}



      </div>


    </div>

  );


}


export default History;
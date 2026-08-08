export type Player = {
  name: string;
  nickname: string;
  avatar: string;
  rating: number;
  tea: number;
  activity: number;
  games: number;
  wins: number;
};


const defaultPlayer: Player = {

  name: "Официант",

  nickname: "",

  avatar: "🙂",

  rating: 300,

  tea: 0,

  activity: 0,

  games: 0,

  wins: 0,

};



export function getPlayer(): Player {


  const saved = localStorage.getItem("player");


  if (saved) {

    return JSON.parse(saved);

  }


  localStorage.setItem(
    "player",
    JSON.stringify(defaultPlayer)
  );


  return defaultPlayer;

}



export function savePlayer(player: Player) {


  localStorage.setItem(
    "player",
    JSON.stringify(player)
  );

}
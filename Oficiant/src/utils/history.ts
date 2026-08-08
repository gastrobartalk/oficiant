export type GameHistory = {

  id: number;

  result: "win" | "lose";

  ratingChange: number;

  teaChange: number;

  date: string;

};



export function getHistory(): GameHistory[] {


  const saved = localStorage.getItem("history");


  if (saved) {

    return JSON.parse(saved);

  }


  return [];

}




export function saveHistory(
  history: GameHistory[]
) {


  localStorage.setItem(
    "history",
    JSON.stringify(history)
  );


}
import { useEffect, useState } from "react";
import { getPlayer, savePlayer } from "../utils/player";
import { getHistory, saveHistory } from "../utils/history";


const questions = [

{
text: "Гость просит совет по блюду. Что делает хороший официант?",
answers: [
{
text: "Просто говорит название блюда",
points: 0,
},
{
text: "Рассказывает состав и уточняет предпочтения гостя",
points: 1,
},
{
text: "Рассказывает состав, особенности блюда, предлагает напиток и учитывает предпочтения",
points: 2,
},
],
},


{
text: "Гость недоволен ожиданием заказа. Что делать?",
answers: [
{
text: "Сказать, что кухня занята",
points: 0,
},
{
text: "Извиниться и уточнить статус заказа",
points: 1,
},
{
text: "Извиниться, объяснить ситуацию, предложить решение и контролировать заказ",
points: 2,
},
],
},


{
text: "Как правильно предложить дополнительный напиток?",
answers: [
{
text: "Ничего не предлагать",
points: 0,
},
{
text: "Спросить, хотят ли гости напиток",
points: 1,
},
{
text: "Предложить подходящий напиток, объяснив почему он подходит",
points: 2,
},
],
},

];



function shuffle(array: any[]) {

return [...array].sort(() => Math.random() - 0.5);

}




function Game() {


const [currentQuestion, setCurrentQuestion] = useState(0);


const [currentAnswers, setCurrentAnswers] = useState(
shuffle(questions[0].answers)
);


const [score, setScore] = useState(0);


const [time, setTime] = useState(60);


const [finished, setFinished] = useState(false);


const [saved, setSaved] = useState(false);



const [resultRating, setResultRating] = useState({

old: 0,

new: 0

});





function nextQuestion() {


if (currentQuestion < questions.length - 1) {


const next = currentQuestion + 1;


setCurrentQuestion(next);


setCurrentAnswers(
shuffle(questions[next].answers)
);


setTime(60);



} else {


setFinished(true);


}


}





function chooseAnswer(points:number) {


setScore((oldScore) => oldScore + points);


nextQuestion();


}







useEffect(() => {


const timer = setInterval(() => {


setTime((oldTime) => {


if (oldTime <= 1) {


nextQuestion();


return 60;


}


return oldTime - 1;


});


},1000);



return () => {


clearInterval(timer);


};


},[]);








useEffect(() => {


if (finished && !saved) {


const player = getPlayer();



const maxScore = questions.length * 2;



const win = score >= maxScore * 0.75;




const ratingChange = win

? 20

: -17;





const newRating = Math.max(

0,

player.rating + ratingChange

);






const updatedPlayer = {


...player,


rating: newRating,


activity:

player.activity + (win ? 10 : 0),


games:

player.games + 1,


wins:

win

? player.wins + 1

: player.wins,


};





savePlayer(updatedPlayer);






const history = getHistory();



history.unshift({


id: Date.now(),


result: win ? "win" : "lose",


ratingChange: ratingChange,


teaChange: 0,


date: new Date().toLocaleString()


});



saveHistory(history);







setResultRating({

old: player.rating,

new: newRating

});





setSaved(true);


}


}, [finished]);









if (finished) {



const maxScore = questions.length * 2;


const win = score >= maxScore * 0.75;





return (

<div className="app">

<div className="card">


<h1>
🎉 Игра завершена
</h1>



<h2>
{score} / {maxScore} баллов
</h2>




<p>

{win

? "🏆 Победа!"

: "Попробуйте ещё раз"}

</p>




<p>

⭐ Рейтинг:

<br />

{resultRating.old} → {resultRating.new}

</p>




<p>

☕ Очки активности:

{win ? " +10" : " 0"}

</p>





<button

onClick={() => window.location.reload()}

>

🎯 Сыграть ещё

</button>




</div>

</div>

);


}






const question = questions[currentQuestion];



const progress =

((currentQuestion + 1) / questions.length) * 100;







return (

<div className="app">


<div className="card">



<h1>
☕ Официант
</h1>




<p>
Вопрос {currentQuestion + 1} / {questions.length}
</p>



<p>
⏱ Осталось: {time} сек
</p>





<div className="progress">

<div

style={{

width: `${progress}%`

}}

/>

</div>





<h3>

{question.text}

</h3>







{currentAnswers.map((answer,index)=>(


<button

key={index}

onClick={() => chooseAnswer(answer.points)}

>

{answer.text}

</button>


))}






</div>

</div>

);


}



export default Game;
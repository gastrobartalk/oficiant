import { useState } from "react";
import { getPlayer, savePlayer } from "../utils/player";


function Profile() {


const savedPlayer = getPlayer();


const [player, setPlayer] = useState(savedPlayer);


const [nickname, setNickname] = useState(
savedPlayer.nickname
);


const [avatar, setAvatar] = useState(
savedPlayer.avatar
);



const avatars = [
"🙂",
"👨‍🍳",
"👩‍🍳",
"🍷",
"☕",
"⭐",
"👤"
];




function saveProfile() {


const updatedPlayer = {


...player,


nickname: nickname,


avatar: avatar


};



savePlayer(updatedPlayer);


setPlayer(updatedPlayer);


}




let rank = "Стажёр";


let nextRank = 501;



if (player.rating >= 501) {


rank = "Официант";


nextRank = 1001;


}



if (player.rating >= 1001) {


rank = "Крутой официант";


nextRank = 1501;


}



if (player.rating >= 1501) {


rank = "Машина сервиса";


nextRank = 2000;


}




const progress = Math.min(

100,

((player.rating % 500) / 500) * 100

);






return (


<div className="app">


<div className="card">



<h1>
👤 Профиль
</h1>




<h2>

{avatar} {nickname || player.name}

</h2>




<h3>
Выбери аватар
</h3>




<div>


{avatars.map((item)=>(


<button

key={item}

onClick={() => setAvatar(item)}

>

{item}

</button>


))}


</div>





<h3>
Никнейм
</h3>




<input


value={nickname}


onChange={(e)=>

setNickname(e.target.value)

}


placeholder="Введите никнейм"


/>




<br />





<button

onClick={saveProfile}

>

💾 Сохранить профиль

</button>







<div className="stats">





<p>

🏆 Ранг:

<br />

{rank}

</p>





<p>

⭐ Рейтинг:

<br />

{player.rating}

</p>





<p>

☕ Чай:

<br />

{player.tea}

</p>





<p>

⚡ Активность:

<br />

{player.activity}

</p>





<p>

🎮 Игр:

<br />

{player.games}

</p>





<p>

🏅 Побед:

<br />

{player.wins}

</p>





</div>








<h3>

Прогресс до следующего ранга

</h3>





<div className="progress">


<div


style={{


width: `${progress}%`


}}


/>


</div>





<p>

{player.rating} / {nextRank}

</p>





</div>


</div>


);


}



export default Profile;
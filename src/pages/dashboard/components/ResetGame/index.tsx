import React from 'react';
import { gameAlgo } from 'pages/dashboard/utils';
import { useUserAuth } from 'auth';
import { User } from 'types';

function ResetGame() {
  const user = useUserAuth().user as User;
  const resetGame = async () => {
    const { gameArray } = await gameAlgo(user);
    console.log(gameArray);
  };
  return (
    <div>
      <button onClick={() => resetGame()}>Test Algo</button>
    </div>
  );
}

export default ResetGame;

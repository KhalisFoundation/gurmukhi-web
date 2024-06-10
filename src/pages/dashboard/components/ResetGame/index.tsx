import React from 'react';
import { gameAlgo } from 'pages/dashboard/utils';
import { useUserAuth } from 'auth';
import { User } from 'types';
import { commitBatch, getBatch } from 'database/shabadavalidb';

function ResetGame() {
  const user = useUserAuth().user as User;
  const resetGame = async () => {
    const batch = getBatch();
    const { gameArray } = await gameAlgo(user, batch);
    await commitBatch(batch);
    console.log(gameArray);
  };
  return (
    <div>
      <button onClick={() => resetGame()}>Test Algo</button>
    </div>
  );
}

export default ResetGame;

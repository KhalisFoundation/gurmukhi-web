import React from 'react';
import { gameAlgo } from 'pages/dashboard/utils';
import { User } from 'types';
import { commitBatch, getBatch } from 'database/shabadavalidb';
import { useAppSelector } from 'store/hooks';

function ResetGame() {
  const user = useAppSelector((state) => state.userData) as User;
  const resetGame = async () => {
    const batch = getBatch();
    const { gameArray } = await gameAlgo(user, batch);
    await commitBatch(batch);
    if (!gameArray) {
      console.log(gameArray);
    }
  };
  return (
    <div>
      <button onClick={() => resetGame()}>Test Algo</button>
    </div>
  );
}

export default ResetGame;

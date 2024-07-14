import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ALL_CONSTANT from 'constants/constant';
import { ROUTES } from 'constants/routes';
import { updateUserDocument } from 'database/shabadavalidb';
import { ProgressData } from 'types';
import { useAppSelector } from 'store/hooks';

const EndSessionButton = ({ uid, className = '' }: { uid: string, className: string }) => {
  const navigate = useNavigate();
  const nanakCoin: number = useAppSelector((state) => state.nanakCoin);
  const currentGamePosition = useAppSelector((state) => state.currentGamePosition);
  const currentLevel = useAppSelector((state) => state.currentLevel);
  const gameArray = useAppSelector((state) => state.gameArray);
  const nextSession = useAppSelector((state) => state.nextSession);
  const currentData = {
    coins: nanakCoin,
    progress: {
      currentProgress: currentGamePosition,
      gameSession: gameArray,
      currentLevel: currentLevel,
    },
    nextSession: nextSession,
  } as ProgressData;
  const [saving, setSaving] = useState(false);

  const endSession = async () => {
    setSaving(true);
    await updateUserDocument(uid, currentData);
    setSaving(false);
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <div className={className}>
      <button
        onClick={() => endSession()}
        className='bg-sky-100 border-sky-900 border-[1px] text-xs text-sky-900 p-2 tracking-widest font-light'
      >
        {saving ? ALL_CONSTANT.SAVING : ALL_CONSTANT.END_SESSION}
      </button>
    </div>
  );
};
export default EndSessionButton;

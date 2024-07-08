import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ALL_CONSTANT from 'constants/constant';
import { ROUTES } from 'constants/routes';
import { updateUserDocument } from 'database/shabadavalidb';
import { ProgressData } from 'types';

const EndSessionButton = ({ uid, currentData, className = '' }: { uid: string, currentData: ProgressData, className: string }) => {
  const navigate = useNavigate();
  const [saving, toggleSaving] = useState(false);
  
  const endSession = async (route: string) => {
    toggleSaving(true);
    console.log('Current Data: ', currentData);
    await updateUserDocument(uid, currentData);
    toggleSaving(false);
    navigate(route);
  };

  return (
    <div className={className}>
      <button
        onClick={() => endSession(ROUTES.DASHBOARD)}
        className='bg-sky-100 border-sky-900 border-[1px] text-xs text-sky-900 p-2 tracking-widest font-light'
      >
        {saving ? ALL_CONSTANT.SAVING : ALL_CONSTANT.END_SESSION}
      </button>
    </div>
  );
};
export default EndSessionButton;

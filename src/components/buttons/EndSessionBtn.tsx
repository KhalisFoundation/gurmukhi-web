import React from 'react';
import { useNavigate } from 'react-router-dom';
import ALL_CONSTANT from 'constants/constant';
import { ROUTES } from 'constants/routes';

const EndSessionButton = ({ className = '' }: { className: string }) => {
  const navigate = useNavigate();
  return (
    <div className={className}>
      <button
        onClick={() => navigate(ROUTES.DASHBOARD)}
        className='bg-sky-100 border-sky-900 border-[1px] text-xs text-sky-900 p-2 tracking-widest font-light'
      >
        {ALL_CONSTANT.END_SESSION}
      </button>
    </div>
  );
};
export default EndSessionButton;

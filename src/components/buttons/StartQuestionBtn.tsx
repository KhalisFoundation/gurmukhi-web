import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiamond } from '@fortawesome/free-solid-svg-icons';

interface Props {
  urlString: string;
  text?: string;
  active?: boolean;
}

const StartQuestionBtn = ({ urlString, text, active = true }: Props) => {
  const isActive = active ? '' : ' disabled';
  const linkClass = 'flex flex-row items-center justify-between gap-2 min-w-52' + isActive;
  return (
    <a href={urlString} className={linkClass}>
      <FontAwesomeIcon icon={faDiamond} className="w-2 h-2" color='#D6E9F3' />
      <button
        className='bg-[#D6E9F3] text-[#255C7A] rounded-lg p-3 w-52 text-center'
        color="secondary"
        style={{
          fontFamily: "HvDTrial Brandon Grotesque, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Liberation Sans', sans-serif",
          letterSpacing: '.1rem',
        }}>
        {text?.toUpperCase()}
      </button>
      <FontAwesomeIcon icon={faDiamond} className="w-2 h-2" color='#D6E9F3' />
    </a>
  );
};

export default StartQuestionBtn;

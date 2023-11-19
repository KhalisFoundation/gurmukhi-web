import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiamond } from '@fortawesome/free-solid-svg-icons';

interface Props {
  urlString: string;
  text?: string;
}

const StartQuestionBtn = ({urlString, text}: Props) => {
  return (
    <Link href={urlString} className='flex flex-row items-center justify-between gap-2 min-w-60' passHref>
      <FontAwesomeIcon icon={faDiamond} className="w-2 h-2" color='#D6E9F3' />
      <button
        className='bg-[#D6E9F3] text-[#255C7A] rounded-lg p-4 w-60 text-center'
        color="secondary"
        style={{
          fontFamily: "HvDTrial Brandon Grotesque, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Liberation Sans', sans-serif",
          letterSpacing: ".1rem",
        }}>
        {text?.toUpperCase()}
      </button>
      <FontAwesomeIcon icon={faDiamond} className="w-2 h-2" color='#D6E9F3' />
    </Link>
  );
};

export default StartQuestionBtn;

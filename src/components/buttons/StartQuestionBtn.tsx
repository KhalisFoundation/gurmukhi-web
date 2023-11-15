import Diamond from '@/assets/icons/Diamond';
import Link from 'next/link';
import React from 'react';

interface Props {
  urlString: string;
  text?: string;
}

const StartQuestionBtn = ({urlString, text}: Props) => {
  return (
    <Link href={urlString} className='flex flex-row items-center justify-between gap-2 min-w-60' passHref>
      <Diamond height={16} width={16} />
      <button
        className='bg-[#D6E9F3] text-[#255C7A] rounded-lg p-4 w-60 text-center'
        color="secondary"
        style={{
          fontFamily: "HvDTrial Brandon Grotesque, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Liberation Sans', sans-serif",
          letterSpacing: ".1rem",
        }}>
          {text?.toUpperCase()}
      </button>
      <Diamond height={16} width={16} />
    </Link>
  );
};

export default StartQuestionBtn;

import React from 'react';
import ALL_CONSTANT from 'constants/constant';

interface Props {
  theme: string;
  text: string;
}
const LoaderButton = ({ theme, text }: Props) => {
  return (
    <span>
      <svg
        className='animate-spin h-5 w-5 m-auto'
        viewBox='0 0 24 24'
        style={{
          display: 'inline',
          marginInlineEnd: '0.5rem',
        }}
      >
        <circle
          cx='12'
          cy='12'
          r='10'
          stroke={theme === ALL_CONSTANT.DARK ? '#1F4860' : '#ecf0f1'}
          strokeWidth='2'
          fill='none'
          strokeDasharray='31.4 31.4'
        />
      </svg>
      <span>{text}</span>
      <span className={theme === ALL_CONSTANT.DARK ? 'loader-dark' : 'loader-light'}></span>
    </span>
  );
};
export default LoaderButton;

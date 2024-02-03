import React from 'react';
import ALL_CONSTANT from 'constants/constant';

interface Props {
  theme:string
}
const LoaderButton = ({ theme }:Props)=>{



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
      <span>{ALL_CONSTANT.FETCHING}</span>
      <span className='loader'></span>
    </span>
  );
};
export default LoaderButton;

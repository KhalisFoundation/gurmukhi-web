import React from 'react';

interface LoadingProps {
  size?: string;
}

const Loading: React.FC<LoadingProps> = ({ size = '1/4' }) => {
  return (
    <div className='text-center'>
      <svg
        className={`animate-spin h-${size} w-${size} m-auto`}
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
          stroke='#1F4860'
          strokeWidth='1'
          fill='none'
          strokeDasharray='31.4 31.4'
        />
      </svg>
    </div>
  );
};
export default Loading;

import React from 'react';

interface RadioBtnProps {
  id: string;
  name: string;
  value: string;
}

const RadioBtn = ({ id, name, value } : RadioBtnProps) => {
  return (
    <div className='inline-flex justify-center items-center m-2 p-2 w-min bg-gray-500 rounded'>
      <input
        id={id}
        name={name}
        type="radio"
        value={value.toLowerCase()}
        className='mr-2 cursor-pointer'
      />
      <label
        htmlFor={id}
        className='text-white text-sm font-bold mb-0 cursor-pointer'
      >
        {value}
      </label>
    </div>
  );
};

export default RadioBtn;

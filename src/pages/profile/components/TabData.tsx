import React, { PropsWithChildren } from 'react';

interface TabDataProps {
  heading: string;
  info: string;
  editMode: boolean;
}

const TabData = ({ heading, info, editMode, children }: PropsWithChildren<TabDataProps>) => {
  return (
    <div className='flex'>
      <div className=''>
        <h3 className='text-lg font-bold pr-3'>{heading}</h3>
      </div>
      <div className={editMode ? 'col-span-4' : 'col-span-6'}>
        <h4 className='text-lg'>
          {info}
          {children}
        </h4>
      </div>
    </div>
  );
};
export default TabData;

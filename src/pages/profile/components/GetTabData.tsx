import React from 'react';
const getTabData = (heading: string, info: string, editMode: boolean, children?: JSX.Element) => {
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
export default getTabData;

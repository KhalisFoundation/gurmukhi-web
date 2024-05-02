import React from 'react';

interface ModalProps {
  children: React.ReactNode;
}

const Modal = ({ children }: ModalProps) => {
  return (
    <div className={'absolute top-0 left-0 w-full h-full bg-darkBlue bg-opacity-80 z-10'}>
      <section className='absolute w-4/5 xl:w-1/3 border border-zinc-950 p-8 rounded-lg bg-white w-80% h-4/5 overflow-y-auto top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
        {children}
      </section>
    </div>
  );
};
export default Modal;

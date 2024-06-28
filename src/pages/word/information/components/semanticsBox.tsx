import React from 'react';
import { MiniWord, Semantic } from 'types';
import { convertToTitleCase } from 'utils';

const SemanticsBox = ({ text, semantics }: { text: string, semantics: (MiniWord | Semantic)[] }) => {
  return (
    <div className={'w-5/6 h-full cardImage bg-cover bg-sky-100 bg-blend-soft-light hover:bg-sky-50 border-2 border-sky-200 shadow-lg rounded-lg lg:w-2/5'}>
      <h2 className='text-black tracking-widest ms-2 my-2'>{text}</h2>
      <div className='w-11/12 flex flex-col gap-2 m-auto'>
        {
          semantics.map((semantic: MiniWord | Semantic) => {
            if (typeof semantic !== 'string') {
              return (
                <div
                  key={semantic.id}
                  className={
                    'flex h-min w-full p-4 text-black text-sm rounded-lg z-10 bg-white'
                  }
                >
                  {semantic.word} ({convertToTitleCase(semantic.translation ?? '')})
                </div>
              );
            }
          })
        }
      </div>
    </div>
  );
};

export default SemanticsBox;
import React from 'react';
import { MiniWord } from 'types';
import { useTranslation } from 'react-i18next';
import { convertToTitleCase } from 'utils';
function SemanticsBox({ title, semantics }: { title: string; semantics: MiniWord[] | string[] }) {
  const { t: text } = useTranslation();
  return (
    <div
      className={
        'cardImage bg-cover bg-sky-100 bg-blend-soft-light hover:bg-sky-50 border-2 border-sky-200 shadow-lg rounded-lg w-[250px] h-[250px]'
      }
    >
      <h2 className='text-black tracking-widest ms-2 my-2'>{text(title).toUpperCase()}</h2>
      <div className='flex flex-col flex-wrap gap-2 w-1/2 mx-2'>
        {semantics &&
          semantics.map((word: MiniWord | string) => {
            if (typeof word !== 'string') {
              return (
                <p
                  key={word.id}
                  className={'h-min p-3 text-black text-sm rounded-lg z-10 bg-white'}
                >
                  {word.word} ({convertToTitleCase(word.translation ?? '')})
                </p>
              );
            }
          })}
      </div>
    </div>
  );
}

export default SemanticsBox;

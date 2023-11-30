import React from 'react';
import CONSTANTS from '@/constants';
import LevelsFooter from '@/components/levels-footer/LevelsFooter';
import BackBtn from '@/components/buttons/BackBtn';
import { wordData } from '@/constants/wordsData';
import { useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

const addEndingPunctuation = (sentence: string, lang: string) => {
  const punctuation = lang === 'gurmukhi' ? '।' : '.';
  return sentence.endsWith(punctuation) || sentence.endsWith('?') ? sentence : sentence + punctuation;
};

const highlightWord = (sentence: string, lang: string, word: string) => {
  // check if word in sentence
  if (!sentence.includes(word)) {
    return sentence;
  }
  const splitSentence = sentence.split(word);
  return (
    <span className="text-black gurmukhi">
      {splitSentence[0]}
      <span className="text-black font-bold">{word}</span>
      {addEndingPunctuation(splitSentence[1], lang)}
    </span>
  );
};

export default function Examples() {
  // Use useLocation to get the search parameters from the URL
  const location = useLocation();

  // Extract the "id" parameter from the search string in the URL
  const searchParams = new URLSearchParams(location.search);
  const wordId = searchParams.get('id');

  // fetch word from state using wordId
  const currentWord = wordData[Number(wordId)] ? wordData[Number(wordId)] : {};

  if (!currentWord.word) {
    // Handle case when word is not found
    return <div>{CONSTANTS.WORD_NOT_FOUND}</div>;
  }

  return (
    <div className="flex flex-col static h-screen items-center justify-between">
      <BackBtn />
      <div className='flex flex-col h-full justify-center items-center gap-5 pb-12 brandon-grotesque'>
        <h1 className="text-4xl gurmukhi text-black">{currentWord.word}</h1>
        <h2 className="text-2xl italic text-gray-e4">{currentWord.translation}</h2>
        <img className="w-3/5 h-6" src="/icons/pointy_border.svg" alt="border-top" width={200} height={200} />
        <div className="flex flex-col items-center justify-between gap-5">
          <span className="tracking-widest">{CONSTANTS.EXAMPLES.toUpperCase()}</span>
          <div className="flex flex-col items-left text-left justify-evenly p-8 gap-5">
            {
              currentWord.sentences?.map((sentence, index) => {
                const highlightedSentence = highlightWord(sentence.sentence, 'gurmukhi', currentWord.word ?? '');
                return (
                  <div key={index} className="flex flex-col text-xl">
                    <span className="text-black-111">
                      {highlightedSentence}
                    </span>
                    <span className="text-black">
                      {sentence.sentenceEnglish.endsWith('.') || sentence.sentence.endsWith('?') ? 
                        sentence.sentenceEnglish : sentence.sentenceEnglish + '.'}
                    </span>
                  </div>
                );
              })
            }
          </div>
        </div>
        <img className="w-3/5 h-6 rotate-180" src="/icons/pointy_border.svg" alt="border-top" width={200} height={200} />
      </div>
      <LevelsFooter nextUrl={`${ROUTES.WORD + ROUTES.SEMANTICS}?id=${wordId}`} nextText='Next' absolute={true}/>
    </div>
  );
}

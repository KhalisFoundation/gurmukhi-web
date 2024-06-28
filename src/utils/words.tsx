import React from 'react';
import CONSTANTS from 'constants/constant';

const convertToTitleCase = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(CONSTANTS.DEFAULT_ONE);
};

const addEndingPunctuation = (sentence: string, lang: string) => {
  const punctuation = lang === 'gurmukhi' ? '।' : '.';
  const numberOfSpaces = (sentence.match(/ /g) || []).length;
  if (numberOfSpaces === 0 && lang === 'gurmukhi') return sentence.replace(/।/g, '');
  return numberOfSpaces === 0 || sentence.endsWith(punctuation) || sentence.endsWith('?')
    ? sentence
    : sentence + punctuation;
};

const highlightWord = (sentence: string, word: string, lang?: string) => {
  // check if word in sentence
  if (!sentence.includes(word)) {
    return sentence;
  }
  const splitSentence = sentence.split(word);
  return (
    <span className='text-slate-500 gurmukhi font-semibold'>
      {splitSentence[0]}
      <span className='text-black'>{word}</span>
      {lang ? addEndingPunctuation(splitSentence[1], lang) : splitSentence[1]}
    </span>
  );
};

export {
  addEndingPunctuation,
  highlightWord,
  convertToTitleCase,
};

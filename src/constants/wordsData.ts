export interface WordData {
  id?: number|string;
  word?: string;
  translation?: string;
  meaning?: string;
  meaningEnglish?: string;
  image?: string;
  sentences?: {
    sentence: string;
    sentenceEnglish: string;
  }[];
  synonyms?: (number|string)[];
  antonyms?: (number|string)[];         
};


export const wordData: WordData[] = [
  {
    id: 1,
    word: 'ਉਸਾਰੀ',
    translation: 'to build',
    meaning: 'ਕਿਸੇ ਚੀਜ਼ ਦੀ ਉਸਾਰੀ ਕਰਨ ਦਾ ਮਤਲਬ ਹੈ ਕਿ ਉਸ ਨੂੰ ਬਨਾਉਣਾ',
    meaningEnglish: 'To "ਉਸਾਰ" something means to build or construct it',
    image: 'https://images.unsplash.com/photo-1531834685032-c34bf0d84c77',
    sentences: [
      {
        sentence: 'ਜਦੋ ਗੁਰਜੋਤ ਨੇ ਜਲੰਧਰ ਵਿਚ ਜ਼ਮੀਨ ਖਰੀਦੀ, ਕਿ ਉਸ ਨੂੰ ਇਕ ਨਵੇ ਘਰ ਦੀ ਉਸਾਰੀ ਕਰਨ ਦੀ ਲੋੜ ਪੇਈ?',
        sentenceEnglish: 'When Gurjot bought land in Jalandhar, did he have to construct a new house?',
      },
      {
        sentence: 'ਸਕੂਲ ਦੀ ਨਵੀ ਬਿਲਡਿੰਗ ਦੀ ਉਸਾਰੀ ਨੂੰ ਤਿਨ ਸਾਲ ਲੱਗਣ ਗੇ।',
        sentenceEnglish: 'The school\'s new building\'s construction will take three years',
      },
      {
        sentence: 'ਗੁਰੂ ਰਾਮਦਾਸ ਜੀ ਨੇ ਦਰਬਾਰ ਸਾਹਿਬ ਦੀ ਉਸਾਰੀ ੧੫੮੮ ਵਿੱਚ ਸ਼ੁਰੂ ਕੀਤੀ ਸੀ',
        sentenceEnglish: 'Guru Ram Das Ji began constructing Darbar Sahib in 1588',
      },
    ],
    synonyms: [
      6,
    ],
    antonyms: [
      3,
    ],
  },
  {
    id: 2,
    word: 'ਅਭਿਆਸ',
    translation: 'to practice',
    meaning: 'ਕਿਸੇੇ ਚੀਜ਼ ਦਾ ਅਭਿਆਸ ਕਰਨ ਦਾ ਮਤਲਬ ਹੈ ਕੇ ਤੁਸੀ ਉਸ ਨੂੰ ਬਾਰ ਬਾਰ ਕਰਦੇ ਹੋ',
    meaningEnglish: 'To do ਅਭਿਆਸ of something means you repeat it again and again',
    sentences: [
      {
        sentence: 'ਮੈਂ ਆਪਣੀ ਪੰਜਾਬੀ ਦਾ ਅਭਿਆਸ ਕਰਨ ਵਾਸਤੇ ਰੋਜ਼ ਪੰਜਾਬੀ ਦੀ ਕਿਤਾਬ ਪੜਦਾ ਹਾਂ।',
        sentenceEnglish: 'To practice my Punjabi, I read a Punjabi book every day.',
      },
      {
        sentence: 'ਮੈਂ ਤੇ ਗੁਰਵਿੰਦਰ ਕੁਸ਼ਤੀ ਦੇ ਅਭਿਆਸ ਲਈ ਹਰ ਰੋਜ਼ ਅਖਾੜੇ ਜਾਂਦੇ ਹਾਂ।',
        sentenceEnglish: 'Gurvinder and I go to the ring every day to practice wrestling.'
      },
      {
        sentence:'ਜਦੋਂ ਸਿਮਰਨ ਨੇ ੧੫ ਦਿਨ ਕੀਰਤਨ ਦਾ ਅਭਿਆਸ ਕੀਤਾ, ਉਸ ਦੇ ਪਿਤਾ ਜੀ ਉਸ ਨੂੰ ਡਿਜ਼ਨੀਲੈਂਡ ਲੈ ਗਏ।',
        sentenceEnglish: 'After Simran practiced kirtan for 15 days, her dad took her to Disneyland.',
      },
    ],
    synonyms: [
      1, 4,
    ],
    antonyms: [
      3, 5,
    ],
  },
  {
    id: 3,
    word: 'ਤਬਾਹ',
    translation: 'to destroy',
  },
  {
    id: 4,
    word: 'ਰਿਆਜ਼',
    translation: 'practice'
  },
  {
    id: 5,
    word: 'ਆਲਸ',
    translation: 'laziness',
  },
  {
    id: 6,
    word: 'ਰਚਨਾ',
    translation: 'to create',
  },
];

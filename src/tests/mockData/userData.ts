import { User } from 'types/shabadavalidb';

const mockUserData: User[] = [
  {
    user: null,
    displayName: 'Amitoj Singh',
    role: 'student',
    photoURL: 'some url',
    uid: 'lakhdsfaoidjfakldnnmadflkjj',
    coins: 3,
    email: 'amitojsingh@shabadavali.ca',
    progress: {
      gameSession: [
        {
          key: 'questions-XhqQ5qkJ5AhRvOwdre1x-vIi5VzvEsecyECMc0shq',
          data: {
            question: ' ਮੈਂ ਆਪਣੀ ___ ਵਿੱਚ ਬਹੁਤ ਸ਼ਰਾਰਤਾਂ ਕੀਤੀਆਂ।',
            id: 'vIi5VzvEsecyECMc0shq',
            word_id: 'XhqQ5qkJ5AhRvOwdre1x',
            translation: 'In my ___, I was very naughty.',
            options: [
              {
                id: 'XhqQ5qkJ5AhRvOwdre1x',
                word: 'ਜਵਾਨੀ',
                translation: 'youth',
              },
              {
                id: '3T6DeVO26R3zaxcdUu28',
                word: 'ਗੁਲਾਮੀ',
                translation: 'Slavery',
              },
              {
                translation: 'easy',
                id: 'Cja1Knv9y8SrbpRpS02r',
                word: 'ਸੁਖਾਲਾ',
              },
              {
                word: 'ਉਸਤਤ',
                id: '7R6eKmbxBTAd75LOvqc5',
                translation: 'Praise',
              },
            ],
            type: 'context',
            answer: 0,
            word: 'ਜਵਾਨੀ',
            audioURL:
              'https://storage.googleapis.com/gurmukhi-dev.appspot.com/questions/_%E0%A8%AE%E0%A9%88%E0%A8%82_%E0%A8%86%E0%A8%AA%E0%A8%A3%E0%A9%80_%E0%A8%A1%E0%A9%88%E0%A8%B6_%E0%A8%B5%E0%A8%BF%E0%A9%B1%E0%A8%9A_%E0%A8%AC%E0%A8%B9%E0%A9%81%E0%A8%A4_%E0%A8%B6%E0%A8%B0%E0%A8%BE%E0%A8%B0%E0%A8%A4%E0%A8%BE%E0%A8%82_%E0%A8%95%E0%A9%80%E0%A8%A4%E0%A9%80%E0%A8%86%E0%A8%82%E0%A5%A4-vIi5VzvEsecyECMc0shq.mp3',
          },
        },
      ],
      currentLevel: 1,
      currentProgress: 2,
    },
    nextSession: [
      {
        key: 'questions-XhqQ5qkJ5AhRvOwdre1x-vIi5VzvEsecyECMc0shq',
        data: {
          question: ' ਮੈਂ ਆਪਣੀ ___ ਵਿੱਚ ਬਹੁਤ ਸ਼ਰਾਰਤਾਂ ਕੀਤੀਆਂ।',
          id: 'vIi5VzvEsecyECMc0shq',
          word_id: 'XhqQ5qkJ5AhRvOwdre1x',
          translation: 'In my ___, I was very naughty.',
          options: [
            {
              id: 'XhqQ5qkJ5AhRvOwdre1x',
              word: 'ਜਵਾਨੀ',
              translation: 'youth',
            },
            {
              id: '3T6DeVO26R3zaxcdUu28',
              word: 'ਗੁਲਾਮੀ',
              translation: 'Slavery',
            },
            {
              translation: 'easy',
              id: 'Cja1Knv9y8SrbpRpS02r',
              word: 'ਸੁਖਾਲਾ',
            },
            {
              word: 'ਉਸਤਤ',
              id: '7R6eKmbxBTAd75LOvqc5',
              translation: 'Praise',
            },
          ],
          type: 'context',
          answer: 0,
          word: 'ਜਵਾਨੀ',
          audioURL:
            'https://storage.googleapis.com/gurmukhi-dev.appspot.com/questions/_%E0%A8%AE%E0%A9%88%E0%A8%82_%E0%A8%86%E0%A8%AA%E0%A8%A3%E0%A9%80_%E0%A8%A1%E0%A9%88%E0%A8%B6_%E0%A8%B5%E0%A8%BF%E0%A9%B1%E0%A8%9A_%E0%A8%AC%E0%A8%B9%E0%A9%81%E0%A8%A4_%E0%A8%B6%E0%A8%B0%E0%A8%BE%E0%A8%B0%E0%A8%A4%E0%A8%BE%E0%A8%82_%E0%A8%95%E0%A9%80%E0%A8%A4%E0%A9%80%E0%A8%86%E0%A8%82%E0%A5%A4-vIi5VzvEsecyECMc0shq.mp3',
        },
      },
    ],
    wordIds: ['vIi5VzvEsecyECMc0shq'],
  },
  {
    user: null,
    displayName: 'Amitoj Singh',
    role: 'student',
    photoURL: 'some url',
    uid: 'lakhdsfaoidjfakldnnmadflkjj',
    coins: 0,
    email: 'amitojsingh@shabadavali.ca',
    progress: {
      gameSession: [],
      currentLevel: 0,
      currentProgress: 0,
    },
    nextSession: [],
    wordIds: [],
  },
];

export default mockUserData;

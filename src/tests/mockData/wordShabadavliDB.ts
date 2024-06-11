import { WordShabadavaliDB } from 'types';

const mockWords: WordShabadavaliDB[] = [
  {
    isLearnt: true,
    progress: 3,
    isWordRead: false,
    word_id: 'ajksdhfjkasbdfnjuk',
    id: 'sakfjhuhkwer',
    image: 'https://koi v image',
    questionIds: ['abhdsfa', 'dfjakhsdfkja', 'alkdhjfa'],
    word: 'Kuch v',
  },
  {
    isLearnt: false,
    progress: 2,
    isWordRead: false,
    word_id: 'ajksdhfsdfajkasbdfnjuk',
    id: 'sakfjhuhkwersfass',
    image: 'https://koi vfasdf image',
    questionIds: ['abhdsfa', 'sadfdfjakhsdfkja', 'alkdhjfa'],
    word: 'Kuch v sdfa',
  },
  {
    isLearnt: false,
    progress: 1,
    isWordRead: false,
    word_id: 'ajksdhfdsafjkasbdfnjuk',
    id: 'sakfjhuhkweraaas',
    image: 'https://koi vdsfa image',
    questionIds: ['abhdsfasdfa', 'dfjakhsdfkja', 'alkdhjfa'],
    word: 'Kuch vasdfa',
  },
];
export default mockWords;

export const PAGES = {
  ROOT: '/',
  LOGIN: 'login',
  LOG_OUT: 'logout',
  SIGN_OUT: 'signout',
  DASHBOARD: 'dashboard',
  PROFILE: 'profile',
  SETTINGS: 'settings',
  WORDS: 'word/*',
  WORD: 'word',
  DEFINITION: 'definition',
  EXAMPLES: 'examples',
  INFORMATION: 'information',
  SEMANTICS: 'semantics',
  QUESTIONS: 'questions',
  QUESTION: 'question',
  IMAGE: 'image',
  MEANING: 'meaning_punjabi',
  WIN: 'win',
  WINCOIN: 'wincoin',
};
// dynamically add / in front of every route in above const and keep the same key name
export const ROUTES: { [key: string]: string } = Object.keys(PAGES).reduce((acc, key) => {
  acc[key] = `/${PAGES[key as keyof typeof PAGES]}` as string;
  return acc;
}, {} as { [key: string]: string });

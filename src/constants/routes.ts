export const PAGES = {
  ROOT: '/',
  LOGIN: 'login',
  SIGN_OUT: 'signout',
  DASHBOARD: 'dashboard',
  PROFILE: 'profile',
  QUESTIONS: 'questions',
  SETTINGS: 'settings',
  WORDS: 'word/*',
  WORD: 'word',
  DEFINITION: 'definition',
  EXAMPLES: 'examples',
  INFORMATION: 'information',
  SEMANTICS: 'semantics',
  WIN: 'Win',
};
// dynamically add / in front of every route in above const and keep the same key name
export const ROUTES: { [key: string]: string } = Object.keys(PAGES).reduce((acc, key) => {
  acc[key] = `/${PAGES[key as keyof typeof PAGES]}` as string;
  return acc;
}, {} as { [key: string]: string });

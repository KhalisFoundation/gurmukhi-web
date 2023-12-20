import React from 'react';
import Gurfateh from 'components/gurfateh/Gurfateh';
import SignIn from 'components/signin/SignIn';
import Meta from 'components/meta';
import metaTags from 'constants/meta';

export default function Login() {
  const { title, description } = metaTags.LOGIN;

  return (
    <section className='flex flex-row w-full min-h-screen items-center justify-evenly gap-5 p-12 absolute'>
      <Meta title={title} description={description} />
      <Gurfateh />
      <SignIn />
    </section>
  );
}

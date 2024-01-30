import React from 'react';
import Gurfateh from 'components/gurfateh/Gurfateh';
import SignIn from 'components/signin/SignIn';
import Meta from 'components/meta';
import metaTags from 'constants/meta';

export default function Login() {
  const { title, description } = metaTags.LOGIN;

  return (
    <section className='flex flex-row w-full items-center justify-evenly m-auto'>
      <Meta title={title} description={description} />
      <Gurfateh />
      <SignIn />
    </section>
  );
}

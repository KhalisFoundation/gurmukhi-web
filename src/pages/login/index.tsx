import React from 'react';
import Gurfateh from 'components/gurfateh/Gurfateh';
import SignIn from 'components/signin/SignIn';
import Meta from 'components/meta';
import metaTags from 'constants/meta';

export default function Login() {
  const { title, description } = metaTags.LOGIN;

  return (
    <section className='flex xl:flex-row w-full justify-evenly m-auto my-0 lg:h-5/6 flex-col h-full gap-5'>
      <Meta title={title} description={description} />
      <Gurfateh />
      <SignIn />
    </section>
  );
}

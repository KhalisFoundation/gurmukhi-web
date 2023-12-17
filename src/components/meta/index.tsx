import React from 'react';
import Helmet from 'react-helmet';

function Meta({ title, description }: { title: string; description: string }) {
  return (
    <Helmet>
      <meta charSet='utf-8' />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta name='description' content={description} />
      <title>{title}</title>
      <meta name='robots' content='index, follow'></meta>
    </Helmet>
  );
}
export default Meta;

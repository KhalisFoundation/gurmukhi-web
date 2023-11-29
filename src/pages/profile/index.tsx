import React from 'react';
import CONSTANTS from '@/constants';

export default function Profile() {
  return (
    <section className="flex flex-row w-full h-full items-center justify-between gap-5 p-12 absolute">
      {CONSTANTS.PROFILE}
    </section>
  );
}

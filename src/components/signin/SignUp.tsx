import React from 'react';
import CONSTANTS from '@/constants';
import InputWithIcon from '@/components/input/InputWithIcon';

export default function SignUp() {
  return (
    <div className='appear-from-below'>
      <InputWithIcon id="name" placeholder="Name" type="text" icon="name" />
      <InputWithIcon id="email" placeholder="Email" type="email" icon="email" />
      <InputWithIcon id="password" placeholder="Password" type="password" />
      <InputWithIcon id="cpassword" placeholder="Confirm Password" type="password" />
      <button type='submit' className="w-full p-4 rounded-lg bg-gradient-to-r from-[#4285F4] to-[#61A9D1] text-white text-lg">{CONSTANTS.SIGN_UP}</button>
    </div>
  );
}

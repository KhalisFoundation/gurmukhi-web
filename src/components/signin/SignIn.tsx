"use client"

import React, { FormEvent, useState } from 'react';
import InputWithIcon from '../input/InputWithIcon';
import SignUp from './SignUp';
import CONSTANTS from '@/constants';
import Image from 'next/image';

export default function SignIn() {
  const [isNewUser, setIsNewUser] = useState(false);
  const signToggle = (e: FormEvent) => {
    e.preventDefault();
    const switchElement = document.getElementsByClassName('switch')[0];
    
    if (switchElement?.classList.contains('left-[4px]')) {
      switchElement.classList.toggle('translate-x-[94%]');
    } else {
      switchElement.classList.toggle('translate-x-[94%]');
    }
    setIsNewUser(!isNewUser);
  }

  const handleGoogleSignIn = async (event: React.MouseEvent) => {
    event.preventDefault();
    try {
      // left with getting confirmation of logging to navigate to homepage
      // const success = await signInWithGoogle();
      // if (success) {
      //   navigate(routes.words);
      // }
    } catch (error: any) {
      console.log(error.message);
    }
  }

  return (
    <main className="flex bg-[#f9f9f9] h-full w-1/2 rounded-3xl flex-col justify-center items-center p-12 gap-5 brandon-grotesque">
      <h1 className='fs-rem-2'>{CONSTANTS.WELCOME}</h1>
      <h3 className='grey text-lg'>{CONSTANTS.ENTER_DETAILS}</h3>

      <div className="w-60 mx-8 rounded-full h-10 mt-4 flex p-5 relative items-center justify-between gap-4 bg-[#eee]">
        <div className="w-full flex justify-center grey">
          <button className='signin' onClick={(e) => signToggle(e)}>{CONSTANTS.SIGN_IN}</button>
        </div>
        <div className="w-full flex justify-center grey">
          <button className='signup' onClick={(e) => signToggle(e)}>{CONSTANTS.SIGN_UP}</button>
        </div>
        <span className="switch bg-white shadow text-black flex items-center justify-center w-1/2 rounded-full h-8 transition-all top-[4px] absolute left-[4px]">
          {isNewUser ? CONSTANTS.SIGN_UP : CONSTANTS.SIGN_IN}
        </span>
      </div>

      <form action="/dashboard" className="flex flex-col w-full gap-4 mt-4 ease-in-out duration-200 delay-100" >
        {isNewUser ? (
          <SignUp />
        )
          : (
            <div className='appear-from-below'>
              <InputWithIcon id="username" placeholder="Username" type="text" icon="user" />
              <InputWithIcon id="signin-pwd" placeholder="Password" type="password" />
              <button className="w-full p-4 rounded-lg bg-gradient-to-r from-[#4285F4] to-[#61A9D1] text-white text-lg" type='submit'>{CONSTANTS.SIGN_IN}</button>
            </div>
          )
        }
        <div className="flex justify-center items-center grey">
          <div className="w-1/4 h-[1px] bg-stone-950/[.2] mr-1"></div>
          {CONSTANTS.OR.toUpperCase()}
          <div className="w-1/4 h-[1px] bg-stone-950/[.2] ml-1"></div>
        </div>
        <button 
          className="w-full flex p-4 rounded-lg bg-transparent hover:bg-slate-100 text-black text-lg items-center justify-center gap-4 border border-gray-300"
          onClick={(e) => handleGoogleSignIn(e)}
        >
          <Image height={6} width={6} className="w-6 h-6" src="/icons/google.svg" alt="google" />
          {CONSTANTS.SIGN_IN_WITH_GOOGLE}
        </button>
      </form>

    </main>
  )
}

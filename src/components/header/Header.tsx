"use client"

import React from 'react'
import Shabadavali from '@/icons/Shabadavali'
import Image from 'next/image';
import CONSTANTS from '@/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

interface PropTypes {
  loggedIn?: boolean
}

export default function Header({...props}: PropTypes) {
  const [loggedIn, setLoggedIn] = React.useState(props.loggedIn ?? false);

  return (
    <header className="flex bg-gradient-to-r absolute inset-x-0 top-0 from-transparent items-center justify-between p-4 z-10">
      <a href="/">
        <main className="flex items-center justify-between">
          <Shabadavali />
          <h1 className="title">{CONSTANTS.APP_TITLE}</h1>
        </main>
      </a>
      <nav>
        {loggedIn ? (
          <ul className="flex items-center justify-between gap-4 brandon-grotesque dull-blue">
            <li><a href='/settings'>{CONSTANTS.SETTINGS}</a></li>
            <li><a href='/dashboard'>{CONSTANTS.DASHBOARD}</a></li>
            <li>
              <div className={`flex bg-[#f9f9f9] h-10 w-10 rounded-full shadow items-center justify-evenly gap-2 p-1`}>
                <span className="absolute flex h-2 w-2 ml-2.5 mb-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#31D95E] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#31D95E]"></span>
                </span>
                <Image height={4} width={4} src='/icons/bell.svg' className={`h-4 w-4`} alt='notifications' />
              </div>
            </li>
            <li>
              <div className={`flex bg-[#f9f9f9] h-10 w-auto rounded-full shadow items-center justify-evenly gap-2 p-1`}>
                <span className="text-[1.125rem] pl-2">{CONSTANTS.NUM_COINS}</span>
                <Image height={8} width={8} src='/icons/coin.svg' className={`h-8 w-8`} alt='coin'/>
              </div>
            </li>
            <li>
              <div className="group inline-block">
                <button
                  className="outline-none focus:outline-none px-3 py-1 flex items-center min-w-32"
                >
                  <div className={`flex bg-[#f9f9f9] h-10 w-auto rounded-full shadow items-center justify-evenly gap-2 p-1`}>
                    <Image height={8} width={8} src='/icons/profile.svg' className={`h-8 w-8`} alt='profile' />
                  </div>
                  <span>
                    <FontAwesomeIcon icon={faChevronDown} className="w-3 h-3 fill-current transform group-hover:-rotate-180 transition duration-150 ease-in-out" />
                  </span>
                </button>
                <ul
                  className="bg-[#f9f9f9] border rounded-md transform scale-0 group-hover:scale-100 absolute transition duration-150 ease-in-out origin-top min-w-32 right-8"
                >
                  <li><a href="/profile" className='block px-3 py-2 hover:bg-gray-200'>{CONSTANTS.PROFILE}</a></li>
                  <li><a href="/settings" className='block px-3 py-2 hover:bg-gray-200'>{CONSTANTS.SETTINGS}</a></li>
                  <li><a href="/login" className='block px-3 py-2 hover:bg-gray-200'>{CONSTANTS.SIGN_OUT}</a></li>
                </ul>
              </div>
            </li>
          </ul>
        ) : null}
      </nav>
    </header>
  )
}

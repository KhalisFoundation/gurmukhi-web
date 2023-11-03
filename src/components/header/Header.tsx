"use client"

import React from 'react'
import Shabadavali from '@/assets/icons/Shabadavali'
import Image from 'next/image';

interface PropTypes {
  loggedIn?: boolean
}

export default function Header({...props}: PropTypes) {
  const [loggedIn, setLoggedIn] = React.useState(props.loggedIn ?? false);

  return (
    <header className="flex bg-gradient-to-r from-transparent items-center justify-between p-4 z-10">
      <a href="/">
        <main className="flex items-center justify-between">
          <Shabadavali />
          <h1 className="title">Shabadavali.</h1>
        </main>
      </a>
      <nav>
        {loggedIn ? (
          <ul className="flex items-center justify-between gap-4 brandon-grotesque dull-blue">
            <li><a href='/settings'>Settings</a></li>
            <li><a href='/dashboard'>Dashboard</a></li>
            <li>
              <div className={`flex bg-[#f9f9f9] h-10 w-10 rounded-full shadow items-center justify-evenly gap-2 p-1`}>
                <span className="absolute flex h-2 w-2 ml-2.5 mb-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#31D95E] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#31D95E]"></span>
                </span>
                <Image src='/icons/bell.svg' className={`h-4 w-4`} alt='notifications' />
              </div>
            </li>
            <li>
              <div className={`flex bg-[#f9f9f9] h-10 w-auto rounded-full shadow items-center justify-evenly gap-2 p-1`}>
                <span className="text-[1.125rem] pl-2">13</span>
                <Image src='/icons/coin.svg' className={`h-8 w-8`} alt='coins' />
              </div>
            </li>
            <li>
              <div className="group inline-block">
                <button
                  className="outline-none focus:outline-none px-3 py-1 flex items-center min-w-32"
                >
                  <div className={`flex bg-[#f9f9f9] h-10 w-auto rounded-full shadow items-center justify-evenly gap-2 p-1`}>
                    <Image src='/icons/profile.svg' className={`h-8 w-8`} alt='profile' />
                  </div>
                  <span>
                    <svg
                      className="fill-current h-4 w-4 transform group-hover:-rotate-180
                      transition duration-150 ease-in-out"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                      />
                    </svg>
                  </span>
                </button>
                <ul
                  className="bg-[#f9f9f9] border rounded-md transform scale-0 group-hover:scale-100 absolute transition duration-150 ease-in-out origin-top min-w-32 right-8"
                >
                  <li><a href="/profile" className='block px-3 py-2 hover:bg-gray-200'>Profile</a></li>
                  <li><a href="/settings" className='block px-3 py-2 hover:bg-gray-200'>Settings</a></li>
                  <li><a href="/login" className='block px-3 py-2 hover:bg-gray-200'>Sign Out</a></li>
                </ul>
              </div>
            </li>
          </ul>
        ) : null}
      </nav>
    </header>
  )
}

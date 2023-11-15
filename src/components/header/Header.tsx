"use client"

import React from 'react'
import Shabadavali from '@/assets/icons/Shabadavali'
import ChevronArrow from '@/assets/icons/ChevronArrow';

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
                <img src='/icons/bell.svg' className={`h-4 w-4`} />
              </div>
            </li>
            <li>
              <div className={`flex bg-[#f9f9f9] h-10 w-auto rounded-full shadow items-center justify-evenly gap-2 p-1`}>
                <span className="text-[1.125rem] pl-2">13</span>
                <img src='/icons/coin.svg' className={`h-8 w-8`} />
              </div>
            </li>
            <li>
              <div className="group inline-block">
                <button
                  className="outline-none focus:outline-none px-3 py-1 flex items-center min-w-32"
                >
                  <div className={`flex bg-[#f9f9f9] h-10 w-auto rounded-full shadow items-center justify-evenly gap-2 p-1`}>
                    <img src='/icons/profile.svg' className={`h-8 w-8`} />
                  </div>
                  <span>
                    <ChevronArrow />
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

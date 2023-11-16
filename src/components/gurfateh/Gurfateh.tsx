import React from 'react'
import CONSTANTS from '@/constants'

export default function Gurfateh() {

  return (
    <main className="flex bg-slate-100/75 shadow rounded-3xl flex-col text-left p-14 gap-4">
      <h1 className="text-xl font-bold text-left gurmukhi">{CONSTANTS.GURFATEH_PUNJABI}</h1>
      <p>{CONSTANTS.LOGIN_INFO}</p>
      <img className='absolute w-24 h-24 md:w-20 md:h-auto md:rounded-none rounded-full mx-auto left-2 mt-12' src={'/images/singhFateh.png'} />
    </main>
  )
}

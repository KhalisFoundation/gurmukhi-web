import React from 'react'
import CONSTANTS from '@/constants'

export default function Gurfateh() {

  return (
    <main className='relative flex '>
      <div className="bg-slate-100/75 shadow rounded-3xl flex-col text-left p-14 gap-4 overflow-hidden">
        <div className="flex-grow">
          <h1 className="text-xl font-medium text-black text-left gurmukhi">{CONSTANTS.GURFATEH_PUNJABI}</h1>
          <p className='whitespace-pre-line'>{CONSTANTS.LOGIN_INFO}</p>
        </div>
      </div>
      <div className="absolute -left-10 -bottom-1">
        <img className='w-24 h-24 md:w-20 md:h-auto md:rounded-none rounded-full mx-auto' src={'/images/singhFateh.png'} alt="Singh Fateh" width={100} height={100} />
      </div>
    </main>
  )
}

import Image from 'next/image'
import React from 'react'

export default function Gurfateh() {

  return (
    <main className="flex bg-slate-100/75 shadow rounded-3xl flex-col text-left p-14 gap-4">
      <h1 className="text-xl font-bold text-left gurmukhi">ਵਾਹਿਗੁਰੂ ਜੀ ਕਾ ਖਾਲਸਾ ॥ ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫਤਿਹ ॥</h1>
      <p>Before you start adding new words to your vocabulary,<br/>we just need some information from you.</p>
      <Image width={240} height={306} className='absolute w-24 h-24 md:w-20 md:h-auto md:rounded-none rounded-full mx-auto left-2 mt-12'
        src={'/images/singhFateh.png'}
        alt='fateh-singh' />
    </main>
  )
}

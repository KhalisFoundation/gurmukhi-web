import Image from 'next/image'
import React from 'react'

export default function TextToSpeechBtn() {
  return (
    <button className='bg-white rounded-full p-4'>
      <Image src={'/icons/speaker.svg'} alt="Text to Speech" width={24} height={24} />
    </button>
  )
}

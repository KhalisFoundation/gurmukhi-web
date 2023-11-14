import React from 'react'
import Image from 'next/image'

const wordData = {
  word: 'ਉਸਾਰੀ',
  translation: 'to build',
  meaning: 'ਕਿਸੇ ਚੀਜ਼ ਦੀ ਉਸਾਰੀ ਕਰਨ ਦਾ ਮਤਲਬ ਹੈ ਕਿ ਉਸ ਨੂੰ ਬਨਾਉਣਾ',
  meaningEnglish: 'To "ਉਸਾਰ" something means to build or construct it',
  image: 'https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?q=80&w=3482&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
}

export default function Defintion() {
  // fetch the word from url param
  const {word, translation, meaning, meaningEnglish, image} = wordData // useParams()
  return (
    <div className='container'>
      {word}
      <br/>
      {translation}
      <br/>
      {meaningEnglish}
      <br/>
      {meaning}
      <br/>
      <Image alt='word-image' height={0} width={0} layout="responsive" src={image} className='w-16 h-8'/>
    </div>
  )
}

Defintion.propTypes = {}


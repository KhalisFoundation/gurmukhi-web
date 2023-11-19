import React from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import CONSTANTS from '@/constants'

export default function BackBtn() {
  return (
    <Link href="/dashboard" className='flex w-fit absolute inset-x-6 top-24 items-center gap-1 brandon-grotesque'>
      <FontAwesomeIcon icon={faChevronLeft} className="w-3 h-3" />
      <span className="text-base text-[#333]">{CONSTANTS.BACK}</span>
    </Link>
  )
}

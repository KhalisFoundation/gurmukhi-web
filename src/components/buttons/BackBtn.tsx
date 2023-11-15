import ChevronArrow from '@/assets/icons/ChevronArrow'
import Link from 'next/link'
import React from 'react'

export default function BackBtn() {
  return (
    <Link href="/dashboard" className='flex w-fit absolute inset-x-6 top-24 items-center gap-1 brandon-grotesque'>
      <ChevronArrow className="w-5 h-5 rotate-90" hoverRotate={false} />
      <span className="text-base text-[#333]">Back</span>
    </Link>
  )
}

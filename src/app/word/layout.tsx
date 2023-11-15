import ChevronArrow from '@/assets/icons/ChevronArrow'
import BackBtn from '@/components/buttons/BackBtn'
import LevelsFooter from '@/components/levels-footer/LevelsFooter'
import Image from 'next/image'
import React from 'react'

export default function WordsPageLayout({
  children
}: {
  children: React.ReactNode
}) {
  // check if children contains 
  return (
    <section className="flex flex-col static items-center justify-between gap-5 p-12">
      <BackBtn />
      <div className="flex flex-col static items-center justify-between gap-5 p-12">
        <Image className="w-3/5 h-6" src="/icons/pointy_border.svg" alt="border-top" width={200} height={200} />
        {children}
        <Image className="w-3/5 h-6 rotate-180" src="/icons/pointy_border.svg" alt="border-top" width={200} height={200} />
      </div>
      <LevelsFooter nextUrl="/word/examples" nextText='Next'/>
    </section>
  )
}

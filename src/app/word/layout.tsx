import React from 'react'
import Image from 'next/image'
import BackBtn from '@/components/buttons/BackBtn'
import LevelsFooter from '@/components/levels-footer/LevelsFooter'

export default function WordsPageLayout({
  children
}: {
  children: React.ReactNode
}) {
  // check if children contains 
  return (
    <section className="flex flex-col static items-center justify-between gap-5 p-12">
      {children}
    </section>
  )
}

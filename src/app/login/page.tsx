import Gurfateh from '@/components/gurfateh/Gurfateh'
import Header from '@/components/header/Header'
import SignIn from '@/components/signin/SignIn'
import React from 'react'

export default function Login() {
  return (
    <section className="flex flex-row w-full min-h-screen items-center justify-between gap-5 p-12 absolute">
      <Gurfateh />
      <SignIn />
    </section>
  )
}

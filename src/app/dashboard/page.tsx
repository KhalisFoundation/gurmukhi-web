import React from 'react'
import LevelsFooter from '@/components/levels-footer/LevelsFooter'
import CONSTANTS from '@/constants'

export default function Dashboard() {

  return (
    <div>
      <div>{CONSTANTS.DASHBOARD}</div>
      <LevelsFooter nextUrl='/word/definition?id=1' />
    </div>
  )
}

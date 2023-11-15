import React from 'react'

interface Props {
  height: number;
  width: number;
}

export default function Diamond({height, width}: Props) {
  return (
    <svg width={width.toString()} height={height.toString()} viewBox={'0 0 4 4'} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.68148 1.63948L2.03901 0.993134C1.86148 0.814528 1.57364 0.814527 1.39611 0.993133L0.753643 1.63948C0.57611 1.81809 0.57611 2.10766 0.753643 2.28627L1.39611 2.93262C1.57364 3.11122 1.86148 3.11122 2.03901 2.93262L2.68148 2.28627C2.85901 2.10766 2.85901 1.81809 2.68148 1.63948Z" fill="#D6E9F3"/>
    </svg>
  )
}
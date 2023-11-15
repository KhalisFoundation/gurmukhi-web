import React from 'react'

interface Props {
  className?: string;
  hoverRotate?: boolean;
}

export default function ChevronArrow({className, hoverRotate=true}: Props) {
  let classes = `fill-current ${className ? className : 'h-4 w-4'}`
  if (hoverRotate) {
    classes += ' transform group-hover:-rotate-180 transition duration-150 ease-in-out'
  }
  return (
    <svg
      className={classes}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
    >
      <path
        d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
      />
    </svg>
  )
}

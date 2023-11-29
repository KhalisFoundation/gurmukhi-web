import React from 'react';
import * as Anvaad from 'anvaad-js';

interface Props {
  number: number;
  type: string;
}

export default function LevelHexagon({ ...props }: Props) {
  const dimensions = 'w-16 h-16';
  switch (props.type) {
    case 'completed':
      return (
        <div className="flex justify-center items-center drop-shadow-[0_4px_15px_#fbbc054d] level-completed">
          <img src={'/icons/doneLevel.svg'} alt="level" className={dimensions} />
          <div className="absolute flex justify-center items-center">
            <p className="text-zinc-950/40 text-xl">{Anvaad.unicode(props.number.toString())}</p>
          </div>
        </div>
      );
    case 'current':
      return (
        <div className="flex justify-center items-center drop-shadow-[0_4px_15px_#0567fb80] level-current">
          <img src={'/icons/currentLevel.svg'} alt="level" className={dimensions} />
          <div className="absolute flex justify-center items-center">
            <p className="text-white text-xl">{props.number}</p>
          </div>
        </div>
      );
    case 'locked':
      return (
        <div className="flex justify-center items-center level-locked">
          <img src={'/icons/emptyLevel.svg'} alt="level" className={dimensions} />
        </div>
      );
    default:
      return (
        <div className="flex justify-center items-center">
          <img src={'/icons/emptyLevel.svg'} alt="level" className={dimensions} />
        </div>
      );
  }
}

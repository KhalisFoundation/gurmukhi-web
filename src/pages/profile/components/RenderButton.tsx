import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiamond } from '@fortawesome/free-solid-svg-icons';
const renderButton = (
  textValue: string,
  onClick: () => void,
  disabled: boolean,
  sides: boolean,
) => {
  const linkClass = 'flex flex-row items-center justify-between gap-2 min-w-26';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';
  return (
    <button
      onClick={onClick}
      className={linkClass}
      disabled={disabled}
      color='secondary'
      style={{
        fontFamily:
          "HvDTrial Brandon Grotesque, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Liberation Sans', sans-serif",
        letterSpacing: '.1rem',
      }}
    >
      {sides && (
        <FontAwesomeIcon
          icon={faDiamond}
          className='w-2 h-2 text-lightAzure border border-darkBlue rotate-45'
        />
      )}
      <p
        className={
          'bg-lightAzure text-darkBlue rounded-lg px-2 py-1 w-26 text-center border border-darkBlue' +
          disabledClass
        }
      >
        {textValue}
      </p>
      {sides && (
        <FontAwesomeIcon
          icon={faDiamond}
          className='w-2 h-2 text-lightAzure border border-darkBlue rotate-45'
        />
      )}
    </button>
  );
};

export default renderButton;

import React, { FormEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignature } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope, faEye, faEyeSlash, faUser } from '@fortawesome/free-regular-svg-icons';

interface InputWithIconProps {
  id: string;
  name?: string;
  placeholder: string;
  type: string;
  icon?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  border?: string;
  value?: string;
}

export default function InputWithIcon({ ...props }: InputWithIconProps) {
  const [viewPassword, setViewPassword] = React.useState(false);
  const getIcon = () => {
    switch (props.icon) {
      case 'eye':
        return faEye;
      case 'eye-slash':
        return faEyeSlash;
      case 'user':
        return faUser;
      case 'email':
        return faEnvelope;
      case 'name':
        return faSignature;
      default:
        return faEye;
    }
  };
  const action = (e: FormEvent) => {
    e.preventDefault();
    if (props.type === 'password') {
      const password = document.getElementById(props.id);
      if (password?.getAttribute('type') === 'password') {
        setViewPassword(!viewPassword);
        return password?.setAttribute('type', 'text');
      } else {
        password?.setAttribute('type', 'password');
      }
      setViewPassword(!viewPassword);
    }
  };

  const inputClassName = props.border ? `w-full p-4 rounded-lg bg-gray-eee border-2 border-${props.border}` : 'w-full p-4 rounded-lg bg-gray-eee';
  return (
    <div className="relative mb-6">
      {props.icon === '' ? null : (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3.5" >
          {
            props.type === 'password' ? (
              viewPassword ? (
                <FontAwesomeIcon icon={faEyeSlash} className="text-gray-400 cursor-pointer" onClick={(e) => action(e)}/>
              ) : (
                <FontAwesomeIcon icon={faEye} className="text-gray-400 cursor-pointer" onClick={(e) => action(e)}/>
              )
            ) : <FontAwesomeIcon icon={getIcon()} className="text-gray-400" />
          }
        </div>
      )}
      <input
        id={props.id}
        name={props.name}
        type={props.type}
        value={props.value}
        placeholder={props.placeholder} 
        className={inputClassName}
        onChange={props.onChange}
      />
    </div>
  );
}

import React from 'react';
import { useTranslation } from 'react-i18next';
import InputWithIcon from 'components/input/InputWithIcon';
import { SignError } from 'types';
import LoaderButton from 'components/buttons/LoaderButton';
import ALL_CONSTANT from 'constants/constant';

interface SignUpProps {
  nameChange: React.Dispatch<React.SetStateAction<string>>;
  emailChange: React.Dispatch<React.SetStateAction<string>>;
  passwordChange: React.Dispatch<React.SetStateAction<string>>;
  cpasswordChange: React.Dispatch<React.SetStateAction<string>>;
  errorMessage: SignError | null;
  setErrorMessage: React.Dispatch<React.SetStateAction<SignError | null>>;
  loading: boolean;
}

export default function SignUp({ ...props }: SignUpProps) {
  const { t: text } = useTranslation();

  const getErrorColor = () => {
    if (!!props.errorMessage && props.errorMessage.code == 'error') {
      return text('RED');
    } else {
      return text('GRAY');
    }
  };

  return (
    <div className='appear-from-below'>
      <InputWithIcon
        id='name'
        placeholder={text('NAME')}
        type='text'
        icon='name'
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          props.nameChange(event.target.value)
        }
      />
      <InputWithIcon
        id='email'
        placeholder={text('EMAIL')}
        type='email'
        icon='email'
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          props.emailChange(event.target.value)
        }
      />
      <InputWithIcon
        id='password'
        placeholder={text('PASSWORD')}
        type='password'
        border={getErrorColor() ?? text('RED')}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          props.passwordChange(event.target.value)
        }
      />
      <InputWithIcon
        id='cpassword'
        placeholder={text('CONFIRM_PASSWORD')}
        type='password'
        border={getErrorColor()}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          props.cpasswordChange(event.target.value)
        }
      />
      {props.errorMessage && (
        <div className={'text-red-500 text-sm'}>{props.errorMessage.message}</div>
      )}
      <button
        type='submit'
        className='w-full p-4 rounded-lg bg-gradient-to-r from-brightBlue to-softBlue text-white text-lg'
      >
        {props.loading ? (
          <LoaderButton theme={ALL_CONSTANT.LIGHT} text={ALL_CONSTANT.SIGNING_IN} />
        ) : (
          text('SIGN_UP')
        )}
      </button>
    </div>
  );
}

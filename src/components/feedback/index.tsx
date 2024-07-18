import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InputWithIcon from 'components/input/InputWithIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import ALL_CONSTANT from 'constants/constant';
import RadioBtn from 'components/buttons/RadioBtn';
import CONSTANTS from 'constants/constant';
import { SignError } from 'types';
import { useAppSelector } from 'store/hooks';

function FeedbackForm({ setShowModal }: { setShowModal: (value: boolean) => void }) {
  const { t: text } = useTranslation();
  const user = useAppSelector((state) => state.userData);
  const [action, setAction] = useState('');
  const [name, setName] = useState(user ? user.displayName : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [feedback, setFeedback] = useState('');
  const [errorMessage, setErrorMessage] = useState<SignError | null>(null);

  useEffect(() => {
    if (name && email && feedback) {
      setErrorMessage(null);
      setAction('https://submit.jotform.com/submit/240394066555864');
    } else {
      setAction('');
    }
  }, [name, email, feedback]);

  const handleSubmit = () => {
    if (!name) {
      setErrorMessage({
        message: ALL_CONSTANT.NAME_REQUIRED,
        code: 'error',
      });
    } else if (!email) {
      setErrorMessage({
        message: ALL_CONSTANT.EMAIL_REQUIRED,
        code: 'error',
      });
    } else if (!feedback) {
      setErrorMessage({
        message: ALL_CONSTANT.FEEDBACK_REQUIRED,
        code: 'error',
      });
    }
    return name && email && feedback;
  };

  return (
    <div>
      <div className='flex flex-col w-full'>
        <FontAwesomeIcon
          className='self-start cursor-pointer'
          icon={faXmark}
          onClick={() => setShowModal(false)}
        />
        <h1 className='self-center px-8 pt-2 text-xl'>{text('FEEDBACK_FORM')}</h1>
      </div>
      <form
        method='post'
        target='_blank'
        onSubmit={(e) => {
          const proceed = handleSubmit();
          if (proceed) {
            setTimeout(() => {
              setShowModal(false);
            }, CONSTANTS.SHOW_MODAL_TIMEOUT);
          } else {
            e.preventDefault();
          }
        }}
        className='bg-white px-8 pt-6 pb-8 mb-4'
        action={action}
      >
        <label htmlFor='input_11' className='block text-gray-700 text-sm font-bold mb-2'>
          {text('NAME')}
        </label>
        <InputWithIcon
          id='input_11'
          name='q11_name'
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={text('NAME')}
          icon='user'
        />

        <label htmlFor='input_13' className='block text-gray-700 text-sm font-bold mb-2'>
          {text('EMAIL')}
        </label>
        <InputWithIcon
          id='input_13'
          name='q13_email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={text('EMAIL')}
          icon='email'
        />

        <label htmlFor='input_3_2' className='block text-gray-700 text-sm font-bold mb-2'>
          {text('FEEDBACK_TYPE')}
        </label>
        <div className='grid-rows-2'>
          <span className='form-radio-item'>
            <RadioBtn id='input_3_0' name='q3_feedbackType' value={ALL_CONSTANT.WORD_TITLECASE} />
          </span>
          <span className='form-radio-item'>
            <RadioBtn
              id="input_3_1"
              name="q3_feedbackType"
              value={ALL_CONSTANT.SENTENCE_TITLECASE}
            />
          </span>
          <span className='form-radio-item'>
            <RadioBtn
              id='input_3_2'
              name='q3_feedbackType'
              value={ALL_CONSTANT.QUESTION_TITLECASE}
            />
          </span>
          <span className='form-radio-item'>
            <RadioBtn id='input_3_3' name='q3_feedbackType' value={ALL_CONSTANT.UI_DESIGN} />
          </span>
          <span className='form-radio-item'>
            <RadioBtn id='input_3_4' name='q3_feedbackType' value={ALL_CONSTANT.FUNCTIONALITY} />
          </span>
          <span className='form-radio-item'>
            <RadioBtn id='input_3_5' name='q3_feedbackType' value={ALL_CONSTANT.OTHER} />
          </span>
        </div>

        <label htmlFor='input_4' className='block text-gray-700 text-sm font-bold my-2'>
          {text('DESCRIBE_YOUR_FEEDBACK')}
        </label>
        <textarea
          id='input_4'
          name='q4_describeYour'
          className='w-full p-4 rounded-lg bg-gray-eee border-2 border-gray-eee'
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder={text('FEEDBACK')}
        />

        {errorMessage && errorMessage.message && (
          <div className='text-red-500 text-sm py-2 italic'>{errorMessage.message}</div>
        )}

        <button className='py-2 px-4 rounded-lg bg-gradient-to-r from-brightBlue to-softBlue text-white text-lg'>
          {text('SUBMIT')}
        </button>
      </form>
    </div>
  );
}

export default FeedbackForm;

import React, { useState } from 'react';
import { Modal } from 'components/modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faX } from '@fortawesome/free-solid-svg-icons';

const SubmitFeedback: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [feedbackType, setFeedbackType] = useState<string>('Feedback');
  const [issueType, setIssueType] = useState<string>('' as string);
  const [feedback, setFeedback] = useState<string>('');

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFeedbackType(e.target.value);
  };

  const handleIssueTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIssueType(e.target.value);
  };
  
  const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {  
    setFeedback(e.target.value);
  };

  return (
    <>
      <div className='flex items-center justify-center -rotate-90 absolute bottom-1/2 -right-16 z-10'>
        <button
          className='relative px-5 py-2 font-medium text-white group'
          onClick={openModal}>
          <span className='absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-0 -skew-x-12 bg-orange-500 group-hover:bg-orange-700 group-hover:skew-x-12'></span>
          <span className='absolute inset-0 w-full h-full transition-all duration-300 ease-out transform skew-x-12 bg-orange-700 group-hover:bg-orange-500 group-hover:-skew-x-12'></span>
          <span className='absolute bottom-0 left-0 hidden w-10 h-20 transition-all duration-100 ease-out transform -translate-x-8 translate-y-10 bg-orange-600 -rotate-12'></span>
          <span className='absolute bottom-0 right-0 hidden w-10 h-20 transition-all duration-100 ease-out transform translate-x-10 translate-y-8 bg-orange-400 -rotate-12'></span>
          <span className='relative group-hover:drop-shadow-lg'>Submit Feedback</span>
        </button>
      </div>

      {
        isModalOpen && (
          <Modal>
            <div className='flex w-full justify-between pb-4'>
              <h1>Feedback Form</h1>
              <button onClick={closeModal}>
                <FontAwesomeIcon icon={faX} className='w-3 h-3' />
              </button>
            </div>
            <form className='w-full max-w-lg recoleta'>
              <div className='flex flex-wrap -mx-3 mb-6'>
                <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
                  <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2' htmlFor='grid-first-name'>
                    Name
                  </label>
                  <input className='appearance-none block w-full bg-gray-200 text-gray-700 focus:border focus:border-zinc-950 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white' id='grid-first-name' value={name} onChange={handleNameChange} type='text' required placeholder='Your name'></input>
                </div>
                <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
                  <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2' htmlFor='grid-type'>
                    Type
                  </label>
                  <div className='relative'>
                    <select className='block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500' id='grid-type' value={feedbackType} onChange={handleTypeChange}>
                      <option>Feedback</option>
                      <option>Issue</option>
                    </select>
                    <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
                      <FontAwesomeIcon icon={faChevronDown} className='w-3 h-3' />
                    </div>
                  </div>
                </div>
                {feedbackType === 'Issue' && (
                  <div className='w-full md:w-full px-3 mb-6 md:mb-0'>
                    <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'   htmlFor='grid-issue-with'>
                      Facing issue with ...
                    </label>
                    <div className='relative'>
                      <select className='block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500' id='grid-issue-with' value={issueType} onChange={handleIssueTypeChange}>
                        <option>Word</option>
                        <option>Sentence</option>
                        <option>Question</option>
                      </select>
                      <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
                        <FontAwesomeIcon icon={faChevronDown} className='w-3 h-3' />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className='flex flex-wrap -mx-3 mb-6'>
                <div className='w-full px-3'>
                  <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2' htmlFor='grid-feedback'>
                    {feedbackType === 'issue' ? 'Explain your issue' : 'Feedback'}
                  </label>
                  <textarea name='feedback' rows={4} cols={50} id='grid-feedback' className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' placeholder={feedbackType === 'issue' ? 'Please make sure in which specific state are you facing the issue' : 'Your feedback goes here...'} value={feedback} onChange={handleFeedbackChange}></textarea>
                </div>
              </div>
              <div className='flex w-full justify-center'>
                <button type='submit' className='bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>Submit</button>
              </div>
            </form>
          </Modal>
        )
      }
    </>
  );
};

export default SubmitFeedback;

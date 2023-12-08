import React from 'react';
import Header from 'components/header/Header';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from 'constants/routes';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Header />
      <section className='flex flex-col h-80 w-80 justify-between items-center '>
        <div className='text-center'>
          <h1 className="text-6xl font-bold relative">
            <span className="custom-shadow">4🫨4</span>
          </h1>
          <h2 className="text-xl font-normal my-4">
            This page could not be found.
          </h2>
        </div>
        <button className="group relative h-12 w-48 overflow-hidden rounded-lg bg-white text-lg shadow" onClick={() => navigate(ROUTES.DASHBOARD)}>
          <div className="absolute inset-0 w-3 bg-darkBlue transition-all duration-[250ms] ease-out group-hover:w-full"></div>
          <span className="relative text-black group-hover:text-white">Back to Dashboard!</span>
        </button>
      </section>
    </div>
  );
}

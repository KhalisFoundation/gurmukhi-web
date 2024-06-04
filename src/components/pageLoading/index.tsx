import React, { useEffect, useState } from 'react';
import CONSTANTS from 'constants/constant';
import Loading from 'components/loading';
function PageLoading() {
  const [reloadPrompt, setReloadPrompt] = useState<boolean>(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setReloadPrompt(true);
    }, CONSTANTS.TIMEOUT_NUM);

    return () => {
      clearTimeout(timeout);
    };
  }, []);
  return (
    <div className='h-screen flex flex-col justify-center items-center'>
      <div className='text-[#0369a1] text-4xl font-bold mb-8'>Hold on tight, adventurer!</div>
      <div className='relative w-24 h-24'>
        <Loading />
      </div>
      <div className='text-[#0369a1] text-2xl font-bold mt-8'>
        Family of Raag rattans🎶 and celestial fairies✨ are singing shabads...
      </div>
      {reloadPrompt && (
        <div className='text-[#0369a1] text-2xl font-bold mt-8'>
          It is taking longer than expected🫨 Please reload the page💫
        </div>
      )}
    </div>
  );
}
export default PageLoading;

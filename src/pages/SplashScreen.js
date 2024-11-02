// SplashScreen.js
import React from 'react';

const SplashScreen = () => {
  return (
    <div className="h-screen text-black transition-opacity duration-100 ease-in-out bg-gray-300">
      <h1 className="relative mx-auto text-4xl font-bold text-center top-1/3">SIGECA</h1>
      <img className='relative w-20 mx-auto mt-8 top-1/2' src='https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif' alt=''/>
    </div>
  );
};

export default SplashScreen;

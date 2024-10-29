import React, { useEffect, useState } from 'react';
import { HiHome } from 'react-icons/hi2';
import { FaCloudSun } from 'react-icons/fa';
import { WiEarthquake } from 'react-icons/wi';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import Earthquake from './pages/Earthquake'; 
import Weather from './pages/Weather'; 
import Profile from './pages/Profile';
import SplashScreen from './pages/SplashScreen';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setLoading(false), 100); 
    }, 1500); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      <div>
        {loading && (
          <SplashScreen className={`transition-opacity duration-500 ease-in-out ${fadeOut ? 'opacity-0' : 'opacity-100'}`} />
        )}
        
        {!loading && (
          <>
            <header className="sticky z-50 top-0 flex h-[6vh] justify-between p-4 bg-gray-950 px-[5%]">
              <div className="flex ">
                <h2 className="flex items-center text-2xl text-white">SIGECA</h2>
              </div>
              <div className="flex">
                <NavLink to="/profile" className="flex items-center text-2xl text-white">
                  <img
                    className="ml-8 border-2 border-white rounded-full size-10"
                    src="https://avatarfiles.alphacoders.com/374/thumb-1920-374805.png"
                    alt="User Avatar"
                  />
                </NavLink>
              </div>
            </header>
            <div className="background bg-slate-950 min-h-[84svh]">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/earthquake" element={<Earthquake />} />
                <Route path="/weather" element={<Weather />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </div>
            <footer className="sticky float-end bottom-0 w-full p-2 text-center items-center text-white h-[10vh] bg-gray-950">
              <div className="grid h-full grid-cols-3 align-middle">
                <NavLink to="/" className='justify-center w-full mx-auto'>
                  <HiHome className='pt-1 mx-auto size-7' />
                  <div>Home</div>
                </NavLink>
                <NavLink to="/earthquake" className='justify-center w-full mx-auto'>
                  <WiEarthquake className='pt-1 mx-auto size-7' />
                  <div>Earthquake</div>
                </NavLink>
                <NavLink to="/weather" className='justify-center w-full mx-auto'>
                  <FaCloudSun className='pt-1 mx-auto size-7' />
                  <div>Weather</div>
                </NavLink>
              </div>
            </footer>
          </>
        )}
      </div>
    </BrowserRouter>
  );
}

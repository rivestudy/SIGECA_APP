import React, { useEffect, useState } from 'react';
import { HiHome } from 'react-icons/hi2';
import { FaCloudSun, FaSearch } from 'react-icons/fa';
import { WiEarthquake } from 'react-icons/wi';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import Earthquake from './pages/Earthquake'; 
import Weather from './pages/Weather'; 
import Profile from './pages/Profile';
import Search from './pages/Search';
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
            <header className="sticky z-50 top-0 flex h-[7vh] justify-between p-4 bg-blue-900 shadow-md shadow-gray-800  px-[5%]">
              <div className="flex">
                <h2 className="flex items-center text-2xl font-bold text-white">SIGECA - APP</h2>
              </div>
              <div className="flex">
                <NavLink to="/profile" className="flex items-center text-2xl text-white">
                  <img
                    className="ml-8 border-2 border-white rounded-full size-8"
                    src="https://avatarfiles.alphacoders.com/374/thumb-1920-374805.png"
                    alt="User Avatar"
                  />
                </NavLink>
              </div>
            </header>
            <div className="background text-black bg-slate-200 min-h-[90svh]">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/earthquake" element={<Earthquake />} />
                <Route path="/weather" element={<Weather />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/search" element={<Search />} />
              </Routes>
            </div>
            <footer className="sticky float-end bottom-0 w-full p-2 text-center items-center text-white h-[10vh] bg-slate-900">
              <div className="grid h-full grid-cols-4 align-middle">
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
                <NavLink to="/search" className='justify-center w-full mx-auto'>
                  <FaSearch className='pt-1 mx-auto size-7' />
                  <div>Search</div>
                </NavLink>
              </div>
            </footer>
          </>
        )}
      </div>
    </BrowserRouter>
  );
}

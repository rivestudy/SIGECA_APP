// Weather.js

import React, { useState, useEffect } from "react";
import { WiDaySunny, WiNightClear, WiDayCloudy, WiNightAltCloudy, WiCloudy, WiSmog, WiThunderstorm, WiSmoke, WiNightFog, WiDayFog, WiNightAltSprinkle, WiDayShowers, WiNightAltShowers, WiNightAltRain, WiDayRain, WiShowers } from 'react-icons/wi';
import { MdNorth, MdNorthEast, MdEast, MdSouthEast, MdSouth, MdSouthWest, MdWest, MdNorthWest } from 'react-icons/md';
import { fetchWeatherData, fetchCSVData, structureCSVData } from '../data/fetchapi'; // Adjust the import path as needed

const Weather = () => {
  const [data, setData] = useState({});
  const [province, setProvince] = useState("");
  const [regency, setRegency] = useState("");
  const [district, setDistrict] = useState("");
  const [subDistrict, setSubDistrict] = useState("");
  const [error, setError] = useState('');
  const [weather, setWeather] = useState([]);
  const [location, setLocation] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const csvData = await fetchCSVData("https://raw.githubusercontent.com/kodewilayah/permendagri-72-2019/main/dist/base.csv");
        const structuredData = structureCSVData(csvData);
        setData(structuredData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const { forecasts, location } = await fetchWeatherData(16, subDistrict);
        setWeather(forecasts);
        setLocation(location);
      } catch (err) {
        setError(err.message);
      }
    };

    if (subDistrict) {
      fetchWeather();
    }
  }, [subDistrict]);

  // Get lists for dropdowns
  const provinces = Object.keys(data.provinces || {});
  const regencies = province ? Object.keys(data.provinces[province]?.regencies || {}) : [];
  const districts = regency ? Object.keys(data.provinces[province]?.regencies[regency]?.districts || {}) : [];
  const subDistricts = district ? Object.keys(data.provinces[province]?.regencies[regency]?.districts[district]?.subDistricts || {}) : [];
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl text-white">Select Location</h1>

      {/* Province Dropdown */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <select
            className="justify-center w-full p-2 mx-auto text-white bg-gray-700 rounded"
            onChange={(e) => {
              setProvince(e.target.value);
              setRegency(""); // Reset regency, district, subDistrict
              setDistrict("");
              setSubDistrict("");
            }}
            value={province}
          >
            <option value="">Select Province</option>
            {provinces.map((provCode) => (
              <option key={provCode} value={provCode}>
                {data.provinces[provCode]?.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          {/* Regency Dropdown */}
          {province && (
            <select
              className="justify-center w-full p-2 mx-auto text-white bg-gray-700 rounded"
              onChange={(e) => {
                setRegency(e.target.value);
                setDistrict("");
                setSubDistrict("");
              }}
              value={regency}
            >
              <option value="">Select Regency</option>
              {regencies.map((regCode) => (
                <option key={regCode} value={regCode}>
                  {data.provinces[province]?.regencies[regCode]?.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div>
          {/* District Dropdown */}
          {regency && (
            <select
              className="justify-center w-full p-2 mx-auto text-white bg-gray-700 rounded"
              onChange={(e) => {
                setDistrict(e.target.value);
                setSubDistrict(""); // Reset subDistrict
              }}
              value={district}
            >
              <option value="">Select District</option>
              {districts.map((distCode) => (
                <option key={distCode} value={distCode}>
                  {data.provinces[province]?.regencies[regency]?.districts[distCode]?.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div>
          {/* Sub-District Dropdown */}
          {district && (
            <select
              className="justify-center w-full p-2 mx-auto text-white bg-gray-700 rounded"
              onChange={(e) => setSubDistrict(e.target.value)}
              value={subDistrict}
            >
              <option value="">Select Sub-District</option>
              {subDistricts.map((subCode) => (
                <option key={subCode} value={subCode}>
                  {data.provinces[province]?.regencies[regency]?.districts[district]?.subDistricts[subCode]?.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div>
        {/* Display selected location */}
        {subDistrict && (
          <div className="text-white">
            <div className='p-4 rounded-2xl bg-slate-900'>
              <h2 className="mb-4 text-xl font-bold">Weather Forecast</h2>
              <div className="sticky top-[5%] py-4 bg-slate-900 mb-2">
                <h2 className='text-xl font-bold'>{location.desa}, {location.kecamatan}, {location.kotkab}</h2>
                <h2>Lat : {location.lat}°</h2>
                <h2>Lon : {location.lon}°</h2>
              </div>

              {weather.length > 0 ? (
                <ul className="grid grid-cols-2 gap-4">
                  {weather.map((forecast, index) => {
                    const weatherid = Number(forecast.weather);
                    const timeIndex = forecast.local_datetime; // Check the time index
                    const winddir = forecast.wd_to;
                    let icon;
                    let wind;

                    // Determine if it's daytime or nighttime based on the time index
                    const nightTimes = ['19:00', '22:00', '01:00', '04:00'];
                    const isNight = nightTimes.some(time => timeIndex.includes(time));

                    // Choose icon based on weather and time
                    switch (weatherid) {
                      case 0: // Clear Skies
                        icon = isNight ? <WiNightClear className="text-5xl text-white" /> : <WiDaySunny className="text-5xl text-white" />;
                        break;
                      case 1: // Partly Cloudy
                        icon = isNight ? <WiNightClear className="text-5xl text-white" /> : <WiDaySunny className="text-5xl text-white" />;
                        break;
                      case 2: // Partly Cloudy
                        icon = isNight ? <WiNightAltCloudy className="text-5xl text-white" /> : <WiDayCloudy className="text-5xl text-white" />;
                        break;
                      case 3: // Mostly Cloudy
                        icon = <WiCloudy className="text-5xl text-white" />;
                        break;
                      case 4: // Overcast
                        icon = <WiCloudy className="text-5xl text-white" />;
                        break;
                      case 5: // Haze
                        icon = <WiSmog className="text-5xl text-white" />;
                        break;
                      case 10: // Smoke
                        icon = <WiSmoke className="text-5xl text-white" />;
                        break;
                      case 45: // Fog
                        icon = isNight ? <WiNightFog className="text-5xl text-white" /> : <WiDayFog className="text-5xl text-white" />;
                        break;
                      case 60: // Light Rain
                        icon = isNight ? <WiNightAltSprinkle className="text-5xl text-white" /> : <WiDayShowers className="text-5xl text-white" />;
                        break;
                      case 61: // Rain
                        icon = isNight ? <WiNightAltShowers className="text-5xl text-white" /> : <WiDayShowers className="text-5xl text-white" />;
                        break;
                      case 63: // Heavy Rain
                        icon = isNight ? <WiNightAltRain className="text-5xl text-white" /> : <WiDayRain className="text-5xl text-white" />;
                        break;
                      case 80: // Isolated Shower
                        icon = <WiShowers className="text-5xl text-white" />;
                        break;
                      case 95: // Severe Thunderstorm
                        icon = <WiThunderstorm className="text-5xl text-white" />;
                        break;
                      case 97: // Severe Thunderstorm
                        icon = <WiThunderstorm className="text-5xl text-white" />;
                        break;
                      default:
                        icon = null;
                    }
                    switch (winddir) {
                      case 'N':
                        wind = <MdNorth className="text-2xl text-white" />;
                        break;
                      case 'NE':
                        wind = <MdNorthEast className="text-2xl text-white" />;
                        break;
                      case 'E':
                        wind = <MdEast className="text-2xl text-white" />;
                        break;
                      case 'SE':
                        wind = <MdSouthEast className="text-2xl text-white" />;
                        break;
                      case 'S':
                        wind = <MdSouth className="text-2xl text-white" />;
                        break;
                      case 'SW':
                        wind = <MdSouthWest className="text-2xl text-white" />;
                        break;
                      case 'W':
                        wind = <MdWest className="text-2xl text-white" />;
                        break;
                      case 'NW':
                        wind = <MdNorthWest className="text-2xl text-white" />;
                        break;
                      default:
                        wind = null;
                    }
                    return (
                      <div key={index} className="flex flex-col items-center py-4 text-center border-b border-gray-600">
                        <span className="font-semibold">
                          {new Date(forecast.local_datetime).toLocaleString()}:
                        </span>
                        <div className='my-2'>
                          {icon}
                        </div>

                        <span>
                          {forecast.t}°C | {forecast.hu}%
                        </span>
                        <span className="flex gap-2">
                          {wind}  {forecast.ws} km/h
                        </span>
                        <span>Tutupan awan : {forecast.tcc}%</span>
                        <span>Jarak Pandang : {forecast.vs_text}</span>
                      </div>
                    );
                  })}
                </ul>
              ) : (
                <p>No weather data available.</p>
              )}
            </div>
            <h1 className='mt-4 text-center text-slate-400'>Data diambil dari api.bmkg.go.id</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;

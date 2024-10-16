// pages/Home.js
import React, { useEffect, useState } from 'react';
import { FaMapLocationDot } from "react-icons/fa6";
import { WiDaySunny, WiNightClear, WiDayCloudy, WiNightAltCloudy, WiCloudy, WiSmog, WiThunderstorm, WiSmoke, WiNightFog, WiDayFog, WiNightAltSprinkle, WiDayShowers, WiNightAltShowers, WiNightAltRain, WiDayRain, WiShowers } from 'react-icons/wi';
import { fetchLatestEarthquake, fetchWeatherData } from '../data/fetchapi'; // Adjust the import path as needed
const Home = () => {
    const [earthquake, setEarthquake] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showMap, setShowMap] = useState(false);
    const [weather, setWeather] = useState([]);
    const [location, setLoc] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [earthquakeData, weatherData] = await Promise.all([
                    fetchLatestEarthquake(),
                    fetchWeatherData(8,`33.74.10.1006`)
                ]);
                setEarthquake(earthquakeData);
                setWeather(weatherData.forecasts);
                setLoc(weatherData.location)
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const shakemapBaseUrl = 'https://data.bmkg.go.id/DataMKG/TEWS/';

    const handleToggleMap = () => {
        setShowMap(prev => !prev);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!earthquake) return <div>No earthquake data available.</div>;

    return (
        <div className="p-4 text-white">
            <h1 className='m-3 text-3xl'>Home</h1>
            <div className='p-4 mb-4 rounded-2xl bg-slate-900'>
                <h2 className="mb-4 text-xl font-bold">Recent Earthquake</h2>

                <div className='grid grid-cols-4'>
                    <ul>Magnitudo</ul>
                    <ul className='col-span-3'>: {earthquake.Magnitude} SR</ul>
                    <ul>Episenter</ul>
                    <ul className='col-span-3'>: {earthquake.Wilayah}</ul>
                    <ul>Waktu</ul>
                    <ul className='col-span-3'>: {`${earthquake.Tanggal} - ${earthquake.Jam}`}</ul>
                    <ul>Kedalaman</ul>
                    <ul className='col-span-3'>: {earthquake.Kedalaman}</ul>
                    <ul>Koordinat</ul>
                    <ul className='flex items-center col-span-3'>
                        <span className='mr-2'>: {earthquake.Coordinates}</span>
                        <button
                            className='flex items-center gap-2 text-cyan-500'
                            onClick={handleToggleMap}
                        >
                            <FaMapLocationDot /> Cek Lokasi
                        </button>
                    </ul>
                </div>

                {showMap && earthquake.Shakemap && (
                    <div className={`absolute z-50 p-4 transition-opacity duration-700 ease-in-out transform rounded-lg shadow-lg top-20 left-[5%] right-[5%] bg-slate-800 ${showMap ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        <img
                            src={`${shakemapBaseUrl}${earthquake.Shakemap}`}
                            alt="Shake map"
                            className="w-[1000px] mt-4"
                        />
                        <button
                            className="mt-2 text-red-500"
                            onClick={handleToggleMap}
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
            <div className='p-4 rounded-2xl bg-slate-900'>
                <h2 className="mb-4 text-xl font-bold">Weather Forecast</h2>
                <h2 className='mb-2 text-l'> {location.kecamatan}, {location.kotkab}</h2>
                {weather.length > 0 ? (
                    <ul className="grid grid-cols-4 gap-4">
                        {weather.map((forecast, index) => {
                            const weatherid = Number(forecast.weather);
                            const timeIndex = forecast.local_datetime; // Check the time index
                            let icon;

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

                            return (
                                <div key={index} className="flex flex-col items-center py-4 text-center border-b border-gray-600">
                                    <span className="font-semibold">
                                        {new Date(forecast.local_datetime).toLocaleString()}:
                                    </span>
                                    <div className='my-2'>
                                        {icon}
                                    </div>
                                    <span>
                                        {forecast.t}°C
                                    </span>
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
    );
};

export default Home;

import React, { useEffect, useState } from 'react';
import { WiDaySunny, WiNightClear, WiDayCloudy, WiNightAltCloudy, WiCloudy, WiSmog, WiThunderstorm, WiSmoke, WiNightFog, WiDayFog, WiNightAltSprinkle, WiDayShowers, WiNightAltShowers, WiNightAltRain, WiDayRain, WiShowers } from 'react-icons/wi';
import { fetchWeatherData } from '../data/fetchapi';

const Weather = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [weatherData, setWeatherData] = useState([]); // Changed to store data for multiple areas
    const regionCodes = ["74", "73", "24", "21", "23", "08", "19"]; // Array of region codes

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const promises = regionCodes.map(code => {
                    // Check if the code starts with '7'
                    const loc = code.startsWith('7') ? '1001' : '2001';
                    code = code.startsWith('8') ? "0" + "8" : code; 
                    return fetchWeatherData(4, `33.${code}.01.${loc}`);
                });

                const results = await Promise.all(promises);

                const combinedWeatherData = results.map(data => ({
                    location: data.location,
                    forecasts: data.forecasts,
                }));

                setWeatherData(combinedWeatherData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);



    if (loading) return <div className='h-screen'><img className='relative w-20 mx-auto top-1/3' src='https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif' alt=''/></div>;
    if (error) return <div>Error: {error}</div>;
    if (!weatherData.length) return <div>No weather data available.</div>;

    return (
        <div className="p-4">
            <h1 className='m-3 text-3xl font-bold'>Cuaca di Wilayah Anda</h1>

            {weatherData.map((data, idx) => (
                <div key={idx} className='p-4 mb-4 bg-gray-100 rounded-2xl'>
                    <h2 className="mb-4 text-xl font-bold">{data.location.kotkab}</h2>

                    {data.forecasts.length > 0 ? (
                        <ul className="grid grid-cols-4">
                            {data.forecasts.map((forecast, index) => {
                                const weatherid = Number(forecast.weather);
                                const timeIndex = forecast.local_datetime;
                                let icon;

                                const nightTimes = ['19:00', '22:00', '01:00', '04:00'];
                                const isNight = nightTimes.some(time => timeIndex.includes(time));

                                switch (weatherid) {
                                    case 0:
                                    case 1:
                                        icon = isNight ? <WiNightClear className="text-5xl" /> : <WiDaySunny className="text-5xl" />;
                                        break;
                                    case 2:
                                        icon = isNight ? <WiNightAltCloudy className="text-5xl" /> : <WiDayCloudy className="text-5xl" />;
                                        break;
                                    case 3:
                                    case 4:
                                        icon = <WiCloudy className="text-5xl" />;
                                        break;
                                    case 5:
                                        icon = <WiSmog className="text-5xl" />;
                                        break;
                                    case 10:
                                        icon = <WiSmoke className="text-5xl" />;
                                        break;
                                    case 45:
                                        icon = isNight ? <WiNightFog className="text-5xl" /> : <WiDayFog className="text-5xl" />;
                                        break;
                                    case 60:
                                        icon = isNight ? <WiNightAltSprinkle className="text-5xl" /> : <WiDayShowers className="text-5xl" />;
                                        break;
                                    case 61:
                                        icon = isNight ? <WiNightAltShowers className="text-5xl" /> : <WiDayShowers className="text-5xl" />;
                                        break;
                                    case 63:
                                        icon = isNight ? <WiNightAltRain className="text-5xl" /> : <WiDayRain className="text-5xl" />;
                                        break;
                                    case 80:
                                        icon = <WiShowers className="text-5xl" />;
                                        break;
                                    case 95:
                                    case 97:
                                        icon = <WiThunderstorm className="text-5xl" />;
                                        break;
                                    default:
                                        icon = null;
                                }

                                return (
                                    <div key={index} className="flex flex-col items-center p-4 text-center">
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
            ))}
            <h1 className='mt-4 text-center text-slate-400'>Data diambil dari api.bmkg.go.id</h1>
        </div>
    );
};

export default Weather;

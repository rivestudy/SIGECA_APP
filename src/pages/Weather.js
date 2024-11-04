import React, { useEffect, useState } from 'react';
import WeatherTab from '../components/weathertab'; // Adjust the path as necessary
import { fetchWeatherData } from '../data/fetchapi';

const Weather = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [weatherData, setWeatherData] = useState([]);
    const regionCodes = ["74", "73", "24", "21", "23", "08", "19"];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const promises = regionCodes.map(code => {
                    const loc = code.startsWith('7') ? '1001' : '2001';
                    code = code.startsWith('8') ? "0" + "8" : code;
                    return fetchWeatherData(6, `33.${code}.01.${loc}`);
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

    if (loading) return <div className='h-screen'><img className='relative w-20 mx-auto top-1/3' src='https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif' alt='' /></div>;
    if (error) return <div>Error: {error}</div>;
    if (!weatherData.length) return <div>No weather data available.</div>;

    return (
        <div className="p-4">
            <h1 className='m-3 text-3xl font-bold'>Cuaca di Wilayah Anda</h1>
            <div>
                {weatherData.map((data, idx) => (
                    <div key={idx} className='p-4 mb-4 bg-gray-100 shadow-md rounded-2xl'>
                        <h2 className="mb-1 text-xl font-bold">{data.location.kotkab}</h2>
                        <WeatherTab location={data.location} forecasts={data.forecasts} grid={`grid-cols-3`} />
                    </div>
                ))}
            </div>
            <h1 className='mt-4 text-center text-slate-400'>Data diambil dari api.bmkg.go.id</h1>
        </div>
    );
};

export default Weather;

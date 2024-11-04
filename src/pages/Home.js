import React, { useEffect, useState } from 'react';
import WeatherTab from '../components/weathertab';
import { fetchLatestEarthquake, fetchWeatherData } from '../data/fetchapi';

const Home = () => {
    const [earthquake, setEarthquake] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [weather, setWeather] = useState([]);
    const [location, setLoc] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [earthquakeData, weatherData] = await Promise.all([
                    fetchLatestEarthquake(),
                    fetchWeatherData(9, `33.74.10.1006`)
                ]);
                setEarthquake(earthquakeData);
                setWeather(weatherData.forecasts);
                setLoc(weatherData.location);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getColorClass = (magnitude) => {
        if (magnitude < 3) return 'bg-green-500';
        if (magnitude < 5) return 'bg-yellow-500';
        if (magnitude < 7) return 'bg-orange-500';
        return 'bg-red-500';
    };

    if (loading) return <div className='h-screen'><img className='relative w-20 mx-auto top-1/3' src='https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif' alt='' /></div>;
    if (error) return <div>Error: {error}</div>;
    if (!earthquake) return <div>No earthquake data available.</div>;

    return (
        <div className="p-4">
            <h1 className='m-3 text-3xl font-bold'>Home</h1>
            <div className={`p-4 mb-4 text-black shadow-lg rounded-2xl ${getColorClass(earthquake.Magnitude)}`}>
                <h2 className="mb-2 text-xl font-bold">Gempa Terkini</h2>
                <div className='grid grid-cols-4'>
                    <ul className='font-bold'>Magnitudo</ul>
                    <ul className='col-span-3 font-bold'>: {earthquake.Magnitude} SR</ul>
                    <ul>Episenter</ul>
                    <ul className='col-span-3'>: {earthquake.Wilayah}</ul>
                    <ul>Waktu</ul>
                    <ul className='col-span-3'>: {`${earthquake.Tanggal} - ${earthquake.Jam}`}</ul>
                    <ul>Kedalaman</ul>
                    <ul className='col-span-3'>: {earthquake.Kedalaman}</ul>
                    <ul>Koordinat</ul>
                    <ul className='col-span-3'>: {earthquake.Coordinates}</ul>
                </div>
            </div>

            <div className='p-4 shadow-md bg-gray-50 rounded-2xl'>
                <h2 className="mb-2 text-xl font-bold">Prakiraan Cuaca</h2>
                <h2 className='mb-2 text-l'> {location.kecamatan}, {location.kotkab}</h2>
                {weather.length > 0 ? (
                    <WeatherTab forecasts={weather} grid={`grid-cols-3`} />
                ) : (
                    <p>No weather data available.</p>
                )}
            </div>
            <h1 className='mt-4 text-center text-slate-400'>Data diambil dari api.bmkg.go.id</h1>
        </div>
    );
};

export default Home;

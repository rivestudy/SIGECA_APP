// pages/Earthquake.js
import React, { useEffect, useState } from 'react';
import { fetchLatestEarthquake, fetchRecentEarthquakes, fetchFeeledEarthquakes, getShakemapLink } from '../data/fetchapi'; // Adjust the import path as needed

const Earthquake = () => {
    const [latestEarthquake, setLatestEarthquake] = useState(null);
    const [recentEarthquakes, setRecentEarthquakes] = useState([]);
    const [feeledEarthquakes, setFeeledEarthquakes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [latest, recent, feeled] = await Promise.all([
                    fetchLatestEarthquake(),
                    fetchRecentEarthquakes(),
                    fetchFeeledEarthquakes()
                ]);
                setLatestEarthquake(latest);
                setRecentEarthquakes(recent);
                setFeeledEarthquakes(feeled);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className='h-screen'><img className='relative w-20 mx-auto top-1/3' src='https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif' alt='' /></div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='p-4'>
            <h1 className='m-3 text-3xl font-bold'>Informasi Gempa</h1>
            <div className='p-4 mb-4 bg-gray-100 shadow-lg rounded-2xl'>
                <h2 className="m-3 mb-4 text-xl font-bold">Gempa Terkini</h2>
                {latestEarthquake && (
                    <div className='grid grid-cols-4 m-3'>
                        <ul>Magnitudo</ul>
                        <ul className='col-span-3'>: {latestEarthquake.Magnitude} SR</ul>
                        <ul>Episenter</ul>
                        <ul className='col-span-3'>: {latestEarthquake.Wilayah}</ul>
                        <ul>Waktu</ul>
                        <ul className='col-span-3'>: {`${latestEarthquake.Tanggal} - ${latestEarthquake.Jam}`}</ul>
                        <ul>Kedalaman</ul>
                        <ul className='col-span-3'>: {latestEarthquake.Kedalaman}</ul>
                        <ul>Koordinat</ul>
                        <ul className='col-span-3'>{latestEarthquake.Coordinates}</ul>
                        <img className='col-span-4 mt-2 rounded-lg shadow-md' src={getShakemapLink(latestEarthquake.Shakemap)} alt='' />
                    </div>
                )}
            </div>
            <div className='p-2 mb-4 bg-gray-100 rounded-2xl'>
                <h2 className="m-3 text-xl font-bold">Gempa Dirasakan</h2>
                <ul className='grid grid-cols-1 gap-2 mx-2'>
                    {feeledEarthquakes.map((eq, index) => (
                        <div className={`grid rounded-md  grid-cols-12 p-3 ${index % 2 === 0 ? 'bg-gray-300 shadow-sm shadow-slate-600' : 'bg-gray-100'}`}>
                            <h1 className='my-auto text-center align-middle'>{index + 1}</h1>
                            <div key={index} className={`ml-2 col-span-11 grid grid-cols-4`}>
                                <ul>Magnitudo</ul>
                                <ul className='col-span-3'>: {eq.Magnitude} SR</ul>
                                <ul>Episenter</ul>
                                <ul className='col-span-3'>: {eq.Wilayah}</ul>
                                <ul>Waktu</ul>
                                <ul className='col-span-3'>: {`${eq.Tanggal} - ${eq.Jam}`}</ul>
                                <ul>Kedalaman</ul>
                                <ul className='col-span-3'>: {eq.Kedalaman}</ul>
                                <ul>Koordinat</ul>
                                <ul className='col-span-3'>{eq.Coordinates}</ul>
                            </div>
                        </div>
                    ))}
                </ul>
            </div>
            <div className='p-2 mb-4 bg-gray-100 rounded-2xl'>
                <h2 className="m-3 text-xl font-bold">Gempa M 5+</h2>
                <ul className='grid grid-cols-1 gap-2'>
                    {recentEarthquakes.map((eq, index) => (
                        <div className={`grid rounded-md  grid-cols-12 p-3 ${index % 2 === 0 ? 'bg-gray-300 shadow-sm shadow-slate-600' : 'bg-gray-100'}`}>
                            <h1 className='my-auto text-center align-middle'>{index + 1}</h1>
                            <div key={index} className={`ml-2 col-span-11 grid grid-cols-4`}>
                                <ul>Magnitudo</ul>
                                <ul className='col-span-3'>: {eq.Magnitude} SR</ul>
                                <ul>Episenter</ul>
                                <ul className='col-span-3'>: {eq.Wilayah}</ul>
                                <ul>Waktu</ul>
                                <ul className='col-span-3'>: {`${eq.Tanggal} - ${eq.Jam}`}</ul>
                                <ul>Kedalaman</ul>
                                <ul className='col-span-3'>: {eq.Kedalaman}</ul>
                                <ul>Koordinat</ul>
                                <ul className='col-span-3'>{eq.Coordinates}</ul>
                            </div>
                        </div>
                    ))}
                </ul>
            </div>
            <h1 className='mt-4 text-center text-slate-400'>Data diambil dari api.bmkg.go.id</h1>
        </div>
    );
};

export default Earthquake;

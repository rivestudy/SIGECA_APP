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
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='p-4 bg-slate-950'>
            <div className='p-4 mb-4 text-white rounded-2xl bg-slate-900'>
                <h2 className="mb-4 text-xl font-bold">Latest Earthquake</h2>
                {latestEarthquake && (
                    <div className='grid grid-cols-4'>
                        <ul>Magnitude</ul>
                        <ul className='col-span-3'>: {latestEarthquake.Magnitude} SR</ul>
                        <ul>Episenter</ul>
                        <ul className='col-span-3'>: {latestEarthquake.Wilayah}</ul>
                        <ul>Time</ul>
                        <ul className='col-span-3'>: {`${latestEarthquake.Tanggal} - ${latestEarthquake.Jam}`}</ul>
                        <ul>Depth</ul>
                        <ul className='col-span-3'>: {latestEarthquake.Kedalaman}</ul>
                        <ul>Coordinates</ul>
                        <ul className='col-span-3'>{latestEarthquake.Coordinates}</ul>
                        <img className='col-span-4 p-8' src={getShakemapLink(latestEarthquake.Shakemap)} alt='' />
                    </div>
                )}
            </div>
            <div className='p-4 mb-4 text-white rounded-2xl bg-slate-900'>
                <h2 className="mb-4 text-xl font-bold">Recent Earthquakes Feeled</h2>
                <ul className='grid grid-cols-1 gap-4'>
                    {feeledEarthquakes.map((eq, index) => (
                        <li key={index} className='p-4 border rounded border-slate-600'>
                            <strong>Magnitude:</strong> {eq.Magnitude} SR<br />
                            <strong>Episenter:</strong> {eq.Wilayah}<br />
                            <strong>Time:</strong> {`${eq.Tanggal} - ${eq.Jam}`}<br />
                            <strong>Depth:</strong> {eq.Kedalaman}<br />
                            <strong>Coordinates:</strong> {eq.Coordinates}
                        </li>
                    ))}
                </ul>
            </div>
            <div className='p-4 text-white rounded-2xl bg-slate-900'>
                <h2 className="mb-4 text-xl font-bold">Recent Earthquakes M 5+</h2>
                <ul className='grid grid-cols-1 gap-4'>
                    {recentEarthquakes.map((eq, index) => (
                        <li key={index} className='p-4 border rounded border-slate-600'>
                            <strong>Magnitude:</strong> {eq.Magnitude} SR<br />
                            <strong>Episenter:</strong> {eq.Wilayah}<br />
                            <strong>Time:</strong> {`${eq.Tanggal} - ${eq.Jam}`}<br />
                            <strong>Depth:</strong> {eq.Kedalaman}<br />
                            <strong>Coordinates:</strong> {eq.Coordinates}
                        </li>
                    ))}
                </ul>
            </div>
            <h1 className='mt-4 text-center text-slate-400'>Data diambil dari api.bmkg.go.id</h1>
        </div>
    );
};

export default Earthquake;

// pages/Earthquake.js
import React, { useEffect, useState } from 'react';

const Earthquake = () => {
    const [latestEarthquake, setLatestEarthquake] = useState(null);
    const [recentEarthquakes, setRecentEarthquakes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const shakemaplink = 'https://data.bmkg.go.id/DataMKG/TEWS/';

    useEffect(() => {
        const fetchLatestEarthquake = async () => {
            try {
                const response = await fetch('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setLatestEarthquake(data.Infogempa.gempa);
            } catch (err) {
                setError(err.message);
            }
        };

        const fetchRecentEarthquakes = async () => {
            try {
                const response = await fetch('https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const eq = data.Infogempa.gempa; // Corrected to access gempa array
                const flateq = eq.slice(0, 15); // Get the latest 15 earthquakes
                setRecentEarthquakes(flateq);
            } catch (err) {
                setError(err.message);
            }
        };

        const fetchData = async () => {
            setLoading(true);
            await Promise.all([fetchLatestEarthquake(), fetchRecentEarthquakes()]);
            setLoading(false);
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
                    <img className='col-span-4 p-8' src={`${shakemaplink}${latestEarthquake.Shakemap}`}></img>
                </div>
            )}

            <h2 className="mt-6 mb-4 text-xl font-bold">Recent Earthquakes</h2>
            <ul className='grid grid-cols-1 gap-4'>
                {recentEarthquakes.map((eq, index) => (
                    <li key={index} className='p-4 bg-gray-800 rounded'>
                        <strong>Magnitude:</strong> {eq.Magnitude} SR<br />
                        <strong>Episenter:</strong> {eq.Wilayah}<br />
                        <strong>Time:</strong> {`${eq.Tanggal} - ${eq.Jam}`}<br />
                        <strong>Depth:</strong> {eq.Kedalaman}<br />
                        <strong>Coordinates:</strong> {eq.Coordinates}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Earthquake;

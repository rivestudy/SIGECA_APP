import React, { useState, useEffect } from "react";
import WeatherTab from '../components/weathertab';
import { fetchWeatherData, fetchCSVData, structureCSVData } from '../data/fetchapi'; 

const Search = () => {
    const [data, setData] = useState({});
    const [province, setProvince] = useState("");
    const [regency, setRegency] = useState("");
    const [district, setDistrict] = useState("");
    const [subDistrict, setSubDistrict] = useState("");
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [weatherLoading, setWeatherLoading] = useState(false);
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
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchWeather = async () => {
            if (!subDistrict) return;

            setWeatherLoading(true);
            try {
                const { forecasts, location } = await fetchWeatherData(16, subDistrict);
                setWeather(forecasts);
                setLocation(location);
            } catch (err) {
                setError(err.message);
            } finally {
                setWeatherLoading(false);
            }
        };

        fetchWeather();
    }, [subDistrict]);

    const provinces = Object.keys(data.provinces || {});
    const regencies = province ? Object.keys(data.provinces[province]?.regencies || {}) : [];
    const districts = regency ? Object.keys(data.provinces[province]?.regencies[regency]?.districts || {}) : [];
    const subDistricts = district ? Object.keys(data.provinces[province]?.regencies[regency]?.districts[district]?.subDistricts || {}) : [];

    if (loading) return <div className='h-screen'><img className='relative w-20 mx-auto top-1/3' src='https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif' alt='' /></div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="p-4">
            <h1 className="m-4 text-3xl font-semibold text-black">Cari Prakiraan Cuaca</h1>
            {/* Dropdowns for selecting location */}
            <div className="grid grid-cols-2 gap-4 m-2">
                {/* Province Select */}
                <div>
                    <select
                        className="justify-center w-full p-2 mx-auto text-black bg-gray-100 rounded"
                        onChange={(e) => {
                            setProvince(e.target.value);
                            setRegency("");
                            setDistrict("");
                            setSubDistrict("");
                        }}
                        value={province}
                    >
                        <option value="">Pilih Provinsi</option>
                        {provinces.map((provCode) => (
                            <option key={provCode} value={provCode}>
                                {data.provinces[provCode]?.name}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Regency Select */}
                <div>
                    {province && (
                        <select
                            className="justify-center w-full p-2 mx-auto text-black bg-gray-100 rounded"
                            onChange={(e) => {
                                setRegency(e.target.value);
                                setDistrict("");
                                setSubDistrict("");
                            }}
                            value={regency}
                        >
                            <option value="">Pilih Kota / Kab</option>
                            {regencies.map((regCode) => (
                                <option key={regCode} value={regCode}>
                                    {data.provinces[province]?.regencies[regCode]?.name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
                {/* District Select */}
                <div>
                    {regency && (
                        <select
                            className="justify-center w-full p-2 mx-auto text-black bg-gray-100 rounded"
                            onChange={(e) => {
                                setDistrict(e.target.value);
                                setSubDistrict("");
                            }}
                            value={district}
                        >
                            <option value="">Pilih Kecamatan</option>
                            {districts.map((distCode) => (
                                <option key={distCode} value={distCode}>
                                    {data.provinces[province]?.regencies[regency]?.districts[distCode]?.name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
                {/* Sub-District Select */}
                <div>
                    {district && (
                        <select
                            className="justify-center w-full p-2 mx-auto text-black bg-gray-100 rounded"
                            onChange={(e) => setSubDistrict(e.target.value)}
                            value={subDistrict}
                        >
                            <option value="">Pilih Desa / Kelurahan</option>
                            {subDistricts.map((subCode) => (
                                <option key={subCode} value={subCode}>
                                    {data.provinces[province]?.regencies[regency]?.districts[district]?.subDistricts[subCode]?.name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            {weatherLoading && (
                <div className='justify-center w-full h-screen mx-auto my-4 top-1/3'>
                    <img className='relative justify-center w-1/5 mx-auto top-[12%]' src='https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif' alt='Loading...' />
                </div>
            )}

            <div>
                {subDistrict && !weatherLoading && (
                    <div className="p-2 text-black ">
                        <div className='pt-2 bg-gray-100 rounded-2xl'>
                            <div className="sticky top-[7%] rounded-md p-4 bg-gray-100 mb-2">
                                <h2 className="mb-1 text-xl font-bold">Prakiraan Cuaca</h2>
                                <h2 className='text-xl font-bold'>{location.desa}, {location.kecamatan}, {location.kotkab}</h2>
                                <h2>Lat : {location.lat}°</h2>
                                <h2>Lon : {location.lon}°</h2>
                            </div>

                            {weather.length > 0 ? (
                                <WeatherTab forecasts={weather} grid={`grid-cols-2`} details={true} />
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

export default Search;

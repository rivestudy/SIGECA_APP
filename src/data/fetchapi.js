import Papa from "papaparse";
const shakemaplink = 'https://data.bmkg.go.id/DataMKG/TEWS/';

export const fetchLatestEarthquake = async () => {
    try {
        const response = await fetch('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.Infogempa.gempa;
    } catch (err) {
        throw new Error(err.message);
    }
};

export const fetchRecentEarthquakes = async () => {
    try {
        const response = await fetch('https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const eq = data.Infogempa.gempa; // Access gempa array
        return eq.slice(0, 15); // Get the latest 15 earthquakes
    } catch (err) {
        throw new Error(err.message);
    }
};
export const fetchFeeledEarthquakes = async () => {
    try {
        const response = await fetch('https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const eqf = data.Infogempa.gempa; // Access gempa array
        return eqf.slice(0, 15); // Get the latest 15 earthquakes
    } catch (err) {
        throw new Error(err.message);
    }
};

export const getShakemapLink = (shakemap) => `${shakemaplink}${shakemap}`;
export const fetchWeatherData = async (count, subDistrict = String) => {
    try {
        if (subDistrict) {
            const apilink = 'https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=';
            const response = await fetch(`${apilink}${subDistrict}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const lok = data.data[0].lokasi;
            const forecasts = data.data[0].cuaca;
            const flattenedForecasts = forecasts.flat().slice(0, count);
            return { forecasts: flattenedForecasts, location: lok };
        }
    } catch (err) {
        throw new Error(err.message);
    }
};

export const fetchCSVData = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const csvText = await response.text();
        return new Promise((resolve, reject) => {
            Papa.parse(csvText, {
                complete: (result) => resolve(result.data),
                skipEmptyLines: true,
                error: (error) => reject(error)
            });
        });
    } catch (error) {
        console.error('Error fetching the CSV data:', error);
        throw error;
    }
};

export const structureCSVData = (csvData) => {
    const structured = { provinces: {} };

    csvData.forEach((row) => {
        const [code, name] = row;
        const codeParts = code.split('.');

        if (codeParts.length === 1) {
            structured.provinces[code] = structured.provinces[code] || { name, regencies: {} };
        } else if (codeParts.length === 2) {
            const provinceCode = codeParts[0];
            structured.provinces[provinceCode] = structured.provinces[provinceCode] || { name: '', regencies: {} };
            structured.provinces[provinceCode].regencies[code] = structured.provinces[provinceCode].regencies[code] || { name, districts: {} };
        } else if (codeParts.length === 3) {
            const provinceCode = codeParts[0];
            const regencyCode = `${codeParts[0]}.${codeParts[1]}`;
            structured.provinces[provinceCode] = structured.provinces[provinceCode] || { name: '', regencies: {} };
            structured.provinces[provinceCode].regencies[regencyCode] = structured.provinces[provinceCode].regencies[regencyCode] || { name: '', districts: {} };
            structured.provinces[provinceCode].regencies[regencyCode].districts[code] = structured.provinces[provinceCode].regencies[regencyCode].districts[code] || { name, subDistricts: {} };
        } else if (codeParts.length === 4) {
            const provinceCode = codeParts[0];
            const regencyCode = `${codeParts[0]}.${codeParts[1]}`;
            const districtCode = `${codeParts[0]}.${codeParts[1]}.${codeParts[2]}`;
            structured.provinces[provinceCode] = structured.provinces[provinceCode] || { name: '', regencies: {} };
            structured.provinces[provinceCode].regencies[regencyCode] = structured.provinces[provinceCode].regencies[regencyCode] || { name: '', districts: {} };
            structured.provinces[provinceCode].regencies[regencyCode].districts[districtCode] = structured.provinces[provinceCode].regencies[regencyCode].districts[districtCode] || { name: '', subDistricts: {} };
            structured.provinces[provinceCode].regencies[regencyCode].districts[districtCode].subDistricts[code] = { name };
        }
    });

    return structured;
};
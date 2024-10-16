import React, { useState, useEffect } from "react";
import Papa from "papaparse"; // For CSV parsing
import { WiDaySunny, WiNightClear, WiDayCloudy, WiNightAltCloudy, WiCloudy, WiSmog, WiThunderstorm, WiSmoke, WiNightFog, WiDayFog, WiNightAltSprinkle, WiDayShowers, WiNightAltShowers, WiNightAltRain, WiDayRain, WiShowers } from 'react-icons/wi';
import { MdNorth, MdNorthEast, MdEast, MdSouthEast, MdSouth, MdSouthWest, MdWest, MdNorthWest } from 'react-icons/md';

const Weather = () => {
  const [data, setData] = useState({});
  const [province, setProvince] = useState("");
  const [regency, setRegency] = useState("");
  const [district, setDistrict] = useState("");
  const [subDistrict, setSubDistrict] = useState("");
  const [error, setError] = useState('');
  const [weather, setWeather] = useState([]);
  const [location, setLocation] = useState([]);

  const fetchWeatherData = async () => {
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
        const flattenedForecasts = forecasts.flat().slice(0, 16);
        setWeather(flattenedForecasts);
        setLocation(lok);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/kodewilayah/permendagri-72-2019/main/dist/base.csv") // Update with your GitHub URL
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.text();
      })
      .then((csvText) => {
        Papa.parse(csvText, {
          complete: (result) => {
            const parsedData = result.data;
            const structuredData = structureCSVData(parsedData);
            console.log('Structured Data:', structuredData); // Log the structured data for debugging
            setData(structuredData);
          },
          skipEmptyLines: true,
        });
      })
      .catch((error) => {
        console.error('Error fetching the CSV data:', error);
      });
  }, []);

  useEffect(() => {
    fetchWeatherData(); // Fetch weather whenever subDistrict changes
  }, [subDistrict]);
  const structureCSVData = (csvData) => {
    const structured = { provinces: {} };

    csvData.forEach((row) => {
      const [code, name] = row;
      const codeParts = code.split('.');

      if (codeParts.length === 1) {
        // Province level
        structured.provinces[code] = structured.provinces[code] || { name, regencies: {} };
      } else if (codeParts.length === 2) {
        // Regency level
        const provinceCode = codeParts[0];
        structured.provinces[provinceCode] = structured.provinces[provinceCode] || { name: '', regencies: {} };
        structured.provinces[provinceCode].regencies[code] = structured.provinces[provinceCode].regencies[code] || { name, districts: {} };
      } else if (codeParts.length === 3) {
        // District level
        const provinceCode = codeParts[0];
        const regencyCode = `${codeParts[0]}.${codeParts[1]}`;
        structured.provinces[provinceCode] = structured.provinces[provinceCode] || { name: '', regencies: {} };
        structured.provinces[provinceCode].regencies[regencyCode] = structured.provinces[provinceCode].regencies[regencyCode] || { name: '', districts: {} };
        structured.provinces[provinceCode].regencies[regencyCode].districts[code] = structured.provinces[provinceCode].regencies[regencyCode].districts[code] || { name, subDistricts: {} };
      } else if (codeParts.length === 4) {
        // Subdistrict level
        const provinceCode = codeParts[0];
        const regencyCode = `${codeParts[0]}.${codeParts[1]}`;
        const districtCode = `${codeParts[0]}.${codeParts[1]}.${codeParts[2]}`;

        // Ensure all parent levels are properly initialized
        structured.provinces[provinceCode] = structured.provinces[provinceCode] || { name: '', regencies: {} };
        structured.provinces[provinceCode].regencies[regencyCode] = structured.provinces[provinceCode].regencies[regencyCode] || { name: '', districts: {} };
        structured.provinces[provinceCode].regencies[regencyCode].districts[districtCode] = structured.provinces[provinceCode].regencies[regencyCode].districts[districtCode] || { name: '', subDistricts: {} };

        // Add the subdistrict to the district
        structured.provinces[provinceCode].regencies[regencyCode].districts[districtCode].subDistricts[code] = { name };
      }
    });

    return structured;
  };


  // Get lists for dropdowns
  const provinces = Object.keys(data.provinces || {});
  const regencies = province ? Object.keys(data.provinces[province]?.regencies || {}) : [];
  const districts = regency ? Object.keys(data.provinces[province]?.regencies[regency]?.districts || {}) : [];
  const subDistricts = district ? Object.keys(data.provinces[province]?.regencies[regency]?.districts[district]?.subDistricts || {}) : [];



  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl text-white">Select Location</h1>

      {/* Province Dropdown */} className=""

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <select
           className="justify-center w-full p-2 mx-auto text-white bg-gray-700 rounded mext-white"
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
        <div className="">
          {/* Regency Dropdown */}
          {province && (
            <select
              className="justify-center w-full p-2 mx-auto text-white bg-gray-700 rounded"
              onChange={(e) => {
                setRegency(e.target.value);
                setDistrict(""); // Reset district and subDistrict
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
        <div className="">
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
        <div className="">
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
          <div>
            {/* Display selected location */}
            {subDistrict && (

              <div className="text-white">
                <div className='p-4 rounded-2xl bg-slate-900'>
                  <h2 className="mb-4 text-xl font-bold">Weather Forecast</h2>
                  <div className="sticky top-[5%] py-4 bg-slate-900 mb-2">
                  <h2 className='text-xl font-bold '> {location.desa}, {location.kecamatan}, {location.kotkab}</h2>
                  <h2>Lat : {location.lat}° </h2>
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
                        // Example condition for night

                        // Choose icon based on weather and time
                        switch (weatherid) {
                          case 0: // Clear Skies
                            icon = isNight ? <WiNightClear className="text-5xl text-white" /> : <WiDaySunny className="text-5xl text-whitetext-white" />;
                            break;
                          case 1: // Partly Cloudy
                            icon = isNight ? <WiNightClear className="text-5xl text-whitetext-white" /> : <WiDaySunny className="text-5xl text-whitetext-white" />;
                            break;
                          case 2: // Partly Cloudy
                            icon = isNight ? <WiNightAltCloudy className="text-5xl text-whitetext-white" /> : <WiDayCloudy className="text-5xl text-whitetext-white" />;
                            break;
                          case 3: // Mostly Cloudy
                            icon = <WiCloudy className="text-5xl text-white" />;
                            break;
                          case 4: // Overcast
                            icon = <WiCloudy className="text-5xl text-white" />;
                            break;
                          case 5: // Haze
                            icon = <WiSmog className="text-5xl ttext-white" />;
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
                            wind = <MdSouthEast  className="text-2xl text-white"/>;
                            break;
                          case 'S':
                            wind = <MdSouth  className="text-2xl text-white"/>;
                            break;
                          case 'SW':
                            wind = <MdSouthWest className="text-2xl text-white" />;
                            break;
                          case 'W':
                            wind = <MdWest  className="text-2xl text-white"/>;
                            break;
                          case 'NW':
                            wind = <MdNorthWest className="text-2xl text-white" />;
                            break;
                          default:
                            wind = null; // or a default icon or message
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

        )}
      </div>

    </div>
  );
};

export default Weather;

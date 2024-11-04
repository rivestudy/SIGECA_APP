import React from 'react';
import { WiDaySunny, WiNightClear, WiRain, WiDayCloudy, WiNightAltCloudy, WiCloudy, WiSmog, WiThunderstorm, WiSmoke, WiNightFog, WiDayFog, WiNightAltSprinkle, WiDayShowers, WiNightAltShowers, WiNightAltRain, WiDayRain, WiShowers } from 'react-icons/wi';
import { MdNorth, MdNorthEast, MdEast, MdSouthEast, MdSouth, MdSouthWest, MdWest, MdNorthWest } from 'react-icons/md';
import { AiOutlineThunderbolt } from "react-icons/ai";

const WeatherTab = ({ forecasts, grid, details }) => {
    return (
        <div>
            {forecasts.length > 0 ? (
                <ul className={`grid ${grid}`}>
                    {forecasts.map((forecast, index) => {
                        const weatherid = Number(forecast.weather);
                        const timeIndex = forecast.local_datetime;
                        const winddir = forecast.wd_to;
                        let icon;
                        let wind;
                        const nightTimes = ['19:00', '22:00', '01:00', '04:00'];
                        const isNight = nightTimes.some(time => timeIndex.includes(time));
                        switch (weatherid) {
                            case 0: 
                                icon = isNight ? <WiNightClear className="text-5xl" /> : <WiDaySunny className="text-5xl" />;
                                break;
                            case 1: 
                                icon = isNight ? <WiNightClear className="text-5xl" /> : <WiDaySunny className="text-5xl" />;
                                break;
                            case 2: 
                                icon = isNight ? <WiNightAltCloudy className="text-5xl" /> : <WiDayCloudy className="text-5xl" />;
                                break;
                            case 3: 
                                icon = <WiCloudy className="text-5xl" />;
                                break;
                            case 4:  
                                icon = <WiCloudy className="text-5xl" />;
                                break;
                            case 5:  
                                icon = <WiSmog className="text-5xl" />;
                                break;
                            case 10:  
                                icon = <WiSmoke className="text-5xl" />;
                                break;
                            case 17:  
                                icon = <AiOutlineThunderbolt className="text-5xl" />;
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
                            case 65:   
                                icon = <WiRain className="text-5xl" />;
                                break;
                            case 80:   
                                icon = <WiShowers className="text-5xl" />;
                                break;
                            case 95:   
                                icon = <WiThunderstorm className="text-5xl" />;
                                break;
                            case 97:   
                                icon = <WiThunderstorm className="text-5xl" />;
                                break;
                            default:
                                icon = null;
                        }
                        switch (winddir) {
                            case 'N':
                                wind = <MdNorth className="text-2xl" />;
                                break;
                            case 'NE':
                                wind = <MdNorthEast className="text-2xl" />;
                                break;
                            case 'E':
                                wind = <MdEast className="text-2xl" />;
                                break;
                            case 'SE':
                                wind = <MdSouthEast className="text-2xl" />;
                                break;
                            case 'S':
                                wind = <MdSouth className="text-2xl" />;
                                break;
                            case 'SW':
                                wind = <MdSouthWest className="text-2xl" />;
                                break;
                            case 'W':
                                wind = <MdWest className="text-2xl" />;
                                break;
                            case 'NW':
                                wind = <MdNorthWest className="text-2xl" />;
                                break;
                            default:
                                wind = null;
                        }
                        return (
                            <div key={index} className="flex flex-col items-center px-3 py-4 m-2 text-center rounded-lg">
                                <span className="font-semibold">
                                    {new Date(forecast.local_datetime).toLocaleString()}:
                                </span>
                                <div className='my-2'>
                                    {icon}
                                </div>
                                <span>
                                    {forecast.t}°C | {forecast.hu}%
                                </span>
                                {details ? (
                                    <div>
                                        <h2 className="flex justify-center gap-2">
                                            {wind} {forecast.ws} km/h
                                        </h2>
                                        <h2>Tutupan awan: {forecast.tcc}%</h2>
                                        <h2>Jarak Pandang: {forecast.vs_text}</h2>
                                    </div>
                                ) : null}

                            </div>
                        );
                    })}
                </ul>
            ) : (
                <p>No weather data available.</p>
            )}
        </div>
    );
};

export default WeatherTab;

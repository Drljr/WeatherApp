import React from 'react';
import { BsDroplet } from "react-icons/bs";
import { LuWind } from "react-icons/lu";

interface ForecastData {
    time: string;
    temp_c: number;
    condition: {
        text: string;
    };
}
interface WeatherData {
    location: {
        name: string;
        localtime: Date | string;
    };
    current: {
        temp_c: number;
        condition: {
            text: string;
        };
        wind_mph: number;
        feelslike_c: number;
        humidity: number;
    };
    forecast: {
        forecastday: {
            date: Date;
            day: {
                avgtemp_c: number;
            };
            condition: {
                text: string;
            };
            hour: ForecastData[];
        };
    };
}

function formatDate(localtime: Date) {
    const day = localtime.getDate();
    const month = localtime.getMonth() + 1;
    const year = localtime.getFullYear();

    return `${day}.${month}.${year}`;
}

function greetByTime(localtime: Date) {
    try {
        if (!localtime || !(localtime instanceof Date)) {
            throw new Error("Invalid localtime");
        }

        const currentHour = localtime.getHours();
        let greeting: string;

        if (currentHour >= 0 && currentHour < 12) {
            greeting = "Good Morning";
        } else if (currentHour >= 12 && currentHour < 17) {
            greeting = "Good Afternoon";
        } else {
            greeting = "Good Evening";
        }

        return greeting;
    } catch (error) {
        console.error("Error getting local time:", error);
        return "";
    }
}

const WeatherDisplay: React.FC<{ weatherData: WeatherData | null }> = ({
    weatherData,
}) => {
    if (!weatherData || !weatherData.location || !weatherData.location.localtime) {
        return <div>Error: Weather data is missing or invalid.</div>;
    }

    let localtime: Date;
    if (typeof weatherData.location.localtime === "string") {
        localtime = new Date(weatherData.location.localtime);
    } else {
        localtime = weatherData.location.localtime;
    }

    const city = weatherData.location.name;
    const temperature = weatherData.current.temp_c;
    const wind = weatherData.current.wind_mph;
    const feeling = weatherData.current.feelslike_c;
    const humidity = weatherData.current.humidity;
    const weatherDescription = weatherData.current.condition.text;


    const currentGreeting = greetByTime(localtime);
    const formattedDate = formatDate(localtime);

    // Format the time to display in AM/PM format with uppercase letters
    const formattedTime = localtime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })
        .replace(/(am|pm)/i, function (match) { return match.toUpperCase(); });

    // Extract hourly forecast data
    const hourlyForecastData: ForecastData[] = weatherData.forecast.forecastday[0].hour.slice(0, 6);

    return (
        <div className='data1'>
            <span className='date'>{formattedDate}</span>
            <span className='time'>{formattedTime}</span> {/* Display the formatted time */}
            <span className='city'><h2>{city}</h2></span>
            <span className='temp'><p>{temperature}°</p></span>
            <span className='wind1'><p><LuWind /><span>{wind} mph</span></p></span>
            <span className='humidity1'><p><BsDroplet /><span>{humidity}%</span></p></span>
            <span className='weather-description'>{weatherDescription}</span> {/* Display the weather description */}
            <div className='data2'>
                <span className='greeting'>{currentGreeting}</span>
                <span className='temp2'><p>{temperature}°</p></span>
                <span className='wind2'><p><LuWind /><span>{wind} mph</span></p></span>
                <span className='humidity2'><p><BsDroplet /><span>{humidity}%</span></p></span>
                <span className='feeling'><p>Feels like {feeling}°</p></span>
                <span className='weather-description2'>{weatherDescription}</span>
                <span className='hourly-forecast'><p>Hourly Forecast</p></span>
                <div className='hourly-pill'>
                    {hourlyForecastData.map((hourlyData, index) => {
                        // Parse the time string to get hour and minute
                        const time = new Date(hourlyData.time);
                         // Format hour to display in 12-hour format with AM/PM
                        const hour = time.toLocaleString('en-US', { hour: 'numeric', hour12: true });
                        return (
                            <div key={index} className={`pill-${index + 1}`}>
                                <div className='pill-items'>
                                    <p className='hour-pill'>{hour}</p>
                                    <p className='temp-pill'>{hourlyData.temp_c}°</p>
                                    <p className='condition-pill'>{hourlyData.condition.text}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
};

export default WeatherDisplay;
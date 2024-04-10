import './App.css'
import { useState, useEffect } from 'react';
import Search from './components/Search';
import WeatherDisplay from './components/WeatherDisplay';

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
        };
    };
}


function App() {
  const [city, setCity] = useState<string | null>(null); // Initial city
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const BaseUrl = `https://weatherapi-com.p.rapidapi.com/forecast.json?q=`;

  const apiKey = '4bd7346311mshfb4718560f58675p19c074jsn7c131e391adb';

  const handleSearch = (newCity: string) => {
    setCity(newCity);
  };

  const fetchWeatherData = async () => {
    if (!city) return;
    setIsLoading(true);
    setError(null);

    try {
      const url = `${BaseUrl}${city}&days=3`;
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
        }
      };

      const response = await fetch(url, options);
      if (!response.ok) {
        // Handle non-2xx responses (e.g., API errors)
        // const errorData = await response.json();
        // setError(errorData.message || 'Error fetching weather data.');
        return; // Exit the function if there's an error
      }

      const result: WeatherData = await response.json();

      setWeatherData(result);
    } catch (error) {
      console.error(error);
      setError('Error fetching weather data.');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchWeatherData();
  }, [city]); // Refetch data when city changes

  return (
    <div className="container">
      <div className='widget'>
        <Search onSearch={handleSearch} />
        {isLoading && <p>Loading weather data...</p>}
        {error && <p>Error: {error}</p>}
        {weatherData ? (
          <WeatherDisplay weatherData={weatherData} />
        ) : (
          <>
            {isLoading && <p>Loading weather data...</p>}
            {!isLoading && !error && <p>No weather data found for this city.</p>}
          </>
        )}

      </div>

    </div>
  )
}


export default App

import React, { useState, useEffect } from 'react';

export default function Weather() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [weatherIcon, setWeatherIcon] = useState('');
  const [error, setError] = useState('');
  const [locationDenied, setLocationDenied] = useState(false);

  const updateWeatherData = (data) => {
    setWeather({
      city: data.name,
      temperature: data.main.temp, // Temperatura em Celsius
    });
    setWeatherIcon(`http://openweathermap.org/img/w/${data.weather[0].icon}.png`);
  };

  const fetchWeather = async (cityName) => {
    const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY; 
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error finding the data');
      }

      updateWeatherData(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchWeatherByCoords = async (latitude, longitude) => {
    const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error finding the data');
      }

      updateWeatherData(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        },
        () => {
          setLocationDenied(true); // Usuário negou a localização
        }
      );
    } else {
      setError('Geolocalization not supported.');
    }
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchWeather(city);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {locationDenied && (
        <div className="flex items-center"> {/* Flex container para os elementos do input e botão */}
          <input 
            type="text" 
            value={city} 
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search by city"
            className="bg-gray-700 text-white rounded border border-gray-600 focus:border-indigo-500 focus:bg-gray-800 focus:outline-none focus:shadow-outline-gray mr-2" // Adicionado margem à direita
          />
          <button 
            onClick={() => fetchWeather(city)}
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-1 px-2 rounded"
          >
            Check weather
          </button>
        </div>
      )}
      {weather && (
        <div className="flex items-center space-x-2">
          <p className="m-0">{weather.city}: {weather.temperature.toFixed(2)} °C</p>
          {weatherIcon && <img src={weatherIcon} alt="Ícone do Clima" className="w-6 h-6" />}
        </div>
      )}
      {error && <p>{error}</p>}
    </div>
  );
}
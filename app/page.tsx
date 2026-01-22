'use client';

import Image from 'next/image';
import { IGeoDbResponse, IGeoDbResponseData } from '@/app/types/locations';
import PixelArtDropdown from './components/PixelArtDropdown/PixelArtDropdown';
import { useEffect, useState } from 'react';
import { getLocationLatLon } from './utils/getLocationLatLon';
import { IMainWeatherSituation, IOpenWeatherResponse } from './types/weather';

export default function Home() {
  const [city, setCity] = useState('');
  const [cities, setCities] = useState<string[]>([]);
  const [fullCitiesInfo, setFullCitiesInfo] = useState<IGeoDbResponseData[]>([]);
  const [weatherInfo, setWeatherInfo] = useState<IOpenWeatherResponse>();
  const [gifPath, setGifPath] = useState<string>();

  function getCorrespondingGif(mainWeatherSituation: IMainWeatherSituation) {
    switch (mainWeatherSituation) {
      case 'Clear':
        return '/assets/clear_v2.gif';
      case 'Thunderstorm':
        return '/assets/storm.gif';
      case 'Clouds':
        return '/assets/clouds.gif';
      case 'Drizzle':
        return '/assets/drizzle.gif';
      case 'Rain':
        return '/assets/rains.gif';
      case 'Snow':
        return '/assets/snow.gif';
    }
  }

  async function getWeatherInfo(lat: number, lon: number, startup: boolean) {
    try {
      if (city.length === 0 && !startup) {
        setCities([]);
        return;
      }
      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      const json: IOpenWeatherResponse = await res.json();

      if (startup) setCity(json.name);

      setGifPath(getCorrespondingGif(json.weather[0].main as IMainWeatherSituation));

      setWeatherInfo(json);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSelectCity(cityName: string) {
    setCity(cityName);
    const cityLatLon = getLocationLatLon(cityName, fullCitiesInfo);
    console.log(cityLatLon);
    getWeatherInfo(cityLatLon?.lat as number, cityLatLon?.lon as number, false);
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getWeatherInfo(latitude, longitude, true);
      },
      (error) => {
        console.error('Error getting user location', error);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const locationQueryTimeout = setTimeout(async () => {
      try {
        if (city.length === 0) {
          setCities([]);
          return;
        }
        const res = await fetch(`/api/locations?q=${city}`);
        const json: IGeoDbResponse = await res.json();

        const cities = new Set(
          json.data.map((cityInfo) => {
            return cityInfo.name;
          })
        );

        setFullCitiesInfo(json.data);
        setCities([...cities]);
      } catch (error) {
        console.log(error);
      }
    }, 500);
    return () => clearTimeout(locationQueryTimeout);
  }, [city]);

  return (
    <div
      style={{ backgroundColor: '#a3a9e0ff' }}
      className="flex w-full h-full items-center justify-center"
    >
      <main
        className="flex flex-col items-center justify-between"
        style={{
          width: '100%',
          margin: '0px 20px',
          minWidth: '300px',
          maxWidth: '600px',
          backgroundColor: '#E0DAA3',
          padding: '40px',
          position: 'relative',
          boxShadow: `
            -6px 0 0 0 black,
            6px 0 0 0 black,
            0 -6px 0 0 black,
            0 6px 0 0 black
          `,
        }}
      >
        <h1 style={{ fontSize: '40px', marginBottom: '40px', textAlign: 'center' }}>Weather App</h1>
        <form
          style={{ marginBottom: '20px', width: '100%', display: 'flex', justifyContent: 'center' }}
          className="weather-form"
          onSubmit={(e) => e.preventDefault()}
        >
          <PixelArtDropdown
            items={cities}
            label="Search for a city:"
            value={city}
            setValue={setCity}
            handleSelectValue={handleSelectCity}
          />
        </form>
        {gifPath && (
          <Image
            src={gifPath}
            alt="pixel art gif of a cloud"
            width={400}
            height={400}
            style={{
              imageRendering: 'pixelated',
            }}
          />
        )}
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            fontSize: '12px',
            flexWrap: 'wrap',
            position: 'absolute',
            bottom: '0px',
            padding: '10px',
          }}
        >
          <p>Weather: {weatherInfo?.weather[0].main}</p>
          <p>Temperature: {weatherInfo?.main.temp}°C</p>
        </div>
        {!gifPath && weatherInfo?.weather[0].main !== undefined && (
          <p
            style={{ textAlign: 'center' }}
          >{`Sorry, we don't have a gif for weather ${weatherInfo?.weather[0].main}`}</p>
        )}
      </main>
    </div>
  );
}

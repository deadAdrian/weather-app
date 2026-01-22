import { IOpenWeatherResponse } from '@/app/types/weather';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json(undefined);
  }
  console.log(apiKey);
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&lat=${lat}&lon=${lon}&units=metric`
  );

  if (!res.ok) {
    throw new Error('Error fetching cities');
  }

  const jsonResponse: IOpenWeatherResponse = await res.json();
  console.log(jsonResponse);

  return NextResponse.json(jsonResponse);
}

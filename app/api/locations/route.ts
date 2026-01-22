import { IGeoDbResponse } from '@/app/types/locations';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');

  if (!q || q.length < 1) {
    return NextResponse.json([]);
  }

  const res = await fetch(
    `http://geodb-free-service.wirefreethought.com/v1/geo/places?sort=-population&limit=7&offset=0&namePrefix=${q}`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    throw new Error('Error fetching cities');
  }

  const jsonResponse: IGeoDbResponse = await res.json();

  return NextResponse.json(jsonResponse);
}

import { type NextRequest } from 'next/server'

import { getLocationByName } from "@/utils/location";


export async function POST(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const name = searchParams.get('name')

  if (!name) {
    return new Response('Missing name parameter', { status: 400 });
  }

  try {
    const location = await getLocationByName(name as string);
    return Response.json(location);
  } catch (error) {
    return new Response('Error fetching location', { status: 500 });
  }
}
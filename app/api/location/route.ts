import { getLocationByName } from "@/utils/location-server";
import { type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const name = searchParams.get("name");
  const account = searchParams.get("account");
  const profile = searchParams.get("profile");

  if (!name) {
    return new Response("Missing name parameter", { status: 400 });
  }

  try {
    const location = await getLocationByName(
      name as string,
      account as string,
      profile as string
    );
    return Response.json(location);
  } catch (error) {
    console.log(error);
    return new Response("Error fetching location", { status: 500 });
  }
}

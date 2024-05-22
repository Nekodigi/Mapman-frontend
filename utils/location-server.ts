import {
  Client,
  LatLngLiteral,
  PlaceInputType,
  PlacePhoto,
} from "@googlemaps/google-maps-services-js";

import {
  googleLandmark,
  googleMuseum,
  googlePark,
  googleRestaurant,
  googleShop,
  Location,
} from "@/type/location";
import { periods2hours } from "@/utils/date";
import { SearchOption } from "@/components/context/account";
import { uploadMapPhoto } from "./photo";

const client = new Client({});

//categorize
export const categorize = (location: string) => {
  if (googleMuseum.includes(location)) {
    return "museum";
  } else if (googlePark.includes(location)) {
    return "park";
  } else if (googleLandmark.includes(location)) {
    return "landmark";
  } else if (googleShop.includes(location)) {
    return "shop";
  } else if (googleRestaurant.includes(location)) {
    return "restaurant";
  } else {
    return "other";
  }
};

// TODO THIS IS BAD BECAUSE IT IS CLIENT SIDE
export const photo2url = async (
  photo: PlacePhoto,
  name: string,
  account: string,
  profile: string
) => {
  const url = await uploadMapPhoto(
    `https://maps.googleapis.com/maps/api/place/photo?photo_reference=${photo.photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY!}`,
    account,
    profile,
    name
  );

  return url;
};

export const getLocationByName = async (
  name: string,
  account: string,
  profile: string
) => {
  //get place id
  const id_res = await client.findPlaceFromText({
    params: {
      input: name,
      fields: ["place_id"],
      inputtype: PlaceInputType.textQuery,
      key: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY!,
    },
  });
  if (id_res.data.candidates.length === 0) {
    return null;
  }
  const id = id_res.data.candidates[0].place_id;
  //get place detail
  const res = (
    await client.placeDetails({
      params: {
        place_id: id!,
        fields: [
          "name",
          "geometry",
          "opening_hours",
          "types",
          "website",
          "photos",
        ],
        key: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY!,
      },
    })
  ).data.result;
  if (
    res.name === undefined ||
    res.geometry === undefined ||
    res.types === undefined
  ) {
    return null;
  }
  const location: Location = {
    name: res.name,
    id: id,
    original_categories: res.types,
    category: categorize(res.types[0]),
    hours: periods2hours(res.opening_hours?.periods),
    importance: 1,
    lon: res.geometry?.location.lng,
    lat: res.geometry?.location.lat,
    zoom: 15,
    imgs:
      // res.photos?.map((photo: PlacePhoto) =>
      //   photo2url(photo, name, account, profile)
      // ) || [],
      await Promise.all(
        res.photos?.map(async (photo: PlacePhoto) => {
          return await photo2url(photo, name, account, profile);
        }) || []
      ),
    website: res.website,
    status: {
      checkSum: "",
      isArchived: false,
      isDeleted: false,
      archivedAt: undefined,
      createdAt: new Date(),
    },
  };
  return location;
};

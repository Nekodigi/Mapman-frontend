import {
  Client,
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

export const photo2url = (photo: PlacePhoto) => {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=128&photo_reference=${photo.photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY!}`;
};

export const getLocationByName = async (name: string) => {
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
    original_categories: res.types,
    category: categorize(res.types[0]),
    hours: periods2hours(res.opening_hours?.periods),
    importance: 1,
    lon: res.geometry?.location.lng,
    lat: res.geometry?.location.lat,
    zoom: 15,
    imgs: res.photos?.map((photo: PlacePhoto) => photo2url(photo)) || [],
    map: "google",
    website: res.website,
    status: {
      checkSum: "",
      isArchived: false,
      isDeleted: false,
      archivedAt: undefined,
      createdAt: new Date(),
    },
  };
  // }
  return location;
};

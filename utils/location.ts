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

const client = new Client({});

export const filter = (loc: Location, so: SearchOption) => {
  let visible = true;
  const hour = so.hours;
  if (so.lcat !== "all") {
    visible = visible && loc.category === so.lcat;
  }
  if (hour.type === "anytime") {
  } else if (hour.type === "now") {
    if (!loc.hours) return true;
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const min = now.getMinutes();
    const time = hour * 2 + min / 30;
    visible = visible && loc.hours[day][0] <= time && loc.hours[day][1] >= time;
  } else if (hour.type === "select") {
    const time = hour.time;
    if (!loc.hours || time === undefined) return true;
    if (hour.week === undefined) {
      visible = visible && loc.hours.some((h) => h[0] <= time && h[1] >= time);
    } else {
      visible =
        visible &&
        loc.hours[hour.week][0] <= time &&
        loc.hours[hour.week][1] >= time;
    }
  }
  return visible;
};

export const almostZero = (a: number | undefined, epsilon = 0.01) => {
  if (a === undefined) return false;
  return Math.abs(a) < epsilon;
};
export const distance = (a: Location, b: Location) => {
  return gDistance({ lat: a.lat, lng: a.lon }, { lat: b.lat, lng: b.lon });
};
export const gDistance = (a: LatLngLiteral, b: LatLngLiteral) => {
  const lat1 = (a.lat * Math.PI) / 180;
  const lon1 = (a.lng * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const lon2 = (b.lng * Math.PI) / 180;

  const dlon = lon2 - lon1;

  const ref =
    Math.acos(
      Math.min(
        Math.sin(lat1) * Math.sin(lat2) +
          Math.cos(lat1) * Math.cos(lat2) * Math.cos(dlon),
        1
      )
    ) * 6371;

  if (isNaN(ref)) return 10000000000;
  return ref;
};

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
    id: id,
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
  return location;
};

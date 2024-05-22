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
  // is any of them invalid return infinity
  if (a === undefined || b === undefined) {
    return 10000000000;
  }
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

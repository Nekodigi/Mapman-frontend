import {
  googleLandmark,
  googleMuseum,
  googlePark,
  googleRestaurant,
  googleShop,
} from "@/type/location";

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

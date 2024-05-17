import { Document } from "./document";
import { Location } from "./location";
import { Status } from "./status";


export type MapType = "google" | "gaode";
export type Profile = {
  name: string;
  locations: Location[];
  documents: Document[];
  cover: string;
  status: Status;
  map: MapType
};

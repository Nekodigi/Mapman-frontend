import { Document } from "./document";
import { Location } from "./location";
import { Status } from "./status";

export type Profile = {
  name: string;
  locations: Location[];
  documents: Document[];
  cover: string;
  status: Status;
};

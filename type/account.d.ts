import { Profile } from "./profile";
import { Status } from "./status";

export type ThemeType = "light" | "dark";

export type Account = {
  name: string;
  email: string;
  currentProfile: string;
  profiles: Profile[];
  theme: ThemeType;
  subscription: string; //
  status: Status;
};

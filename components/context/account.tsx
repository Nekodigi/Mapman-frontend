"use client";
//context to provide acocount info

import {
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Account } from "@/type/account";
import { Week } from "@/type/date";
import { LCategory, Location } from "@/type/location";
import { distance } from "@/utils/location";

type LocationEditorContextType = {
  loc: Location;
  setLoc: (loc: Location) => void;
  id: number; // -1 add
  setId: (id: number) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  finish: () => void;
};
type HoursFilter = {
  type: "now" | "anytime" | "select";
  week?: Week;
  time?: number;
};
export type SearchOption = {
  center?: Location;
  hours: HoursFilter;
  lcat: LCategory;
};
type AccountContextType = {
  account: Account;
  setAccount: (account: Account) => void;
  locs: Location[];
  locsDispatch: React.Dispatch<any>;
  locEditor: LocationEditorContextType;
  searchOption: SearchOption;
  setSearchOption: React.Dispatch<React.SetStateAction<SearchOption>>;
};
type AccountProviderProps = {
  children: React.ReactNode;
};

export const AccountContext = createContext<AccountContextType | undefined>(
  undefined
);

export const AccountProvider = ({ children }: AccountProviderProps) => {
  type Action = {
    type: "add" | "edit" | "delete" | "setAll";
    location?: Location;
    index?: number;
    locations?: Location[];
  };
  const called = useRef(false);
  const [searchOption, setSearchOption] = useState<SearchOption>({
    center: undefined,
    hours: { type: "now" },
    lcat: "museum",
  });
  const [account, setAccount] = useState<Account>({
    name: "mapman",
    email: "test@a.a",
    currentProfile: "default",
    profiles: [
      {
        name: "default",
        locations: [],
        documents: [],
        cover: "",
        status: {
          checkSum: "0",
          isArchived: false,
          isDeleted: false,
          createdAt: new Date(),
        },
      },
    ],
    theme: "light",
    subscription: "free",
    status: {
      checkSum: "0",
      isArchived: false,
      isDeleted: false,
      createdAt: new Date(),
    },
  });
  const locsDispatch = (action: Action) => {
    const newAccount = { ...account };
    const index = account.profiles.findIndex(
      (profile) => profile.name === account.currentProfile
    );
    switch (action.type) {
      case "add":
        setAccount((prev) => {
          const newAccount = { ...prev };
          const locationExists = newAccount.profiles[index].locations.find(
            (location) => location.name === action.location!.name
          );
          if (locationExists) return newAccount;
          newAccount.profiles[index].locations = [
            ...newAccount.profiles[index].locations,
            action.location!,
          ];
          return newAccount;
        });
        break;
      case "edit":
        newAccount.profiles[index].locations = newAccount.profiles[
          index
        ].locations.map((location, index) =>
          index === action.index ? action.location! : location
        );
        setAccount(newAccount);
        break;
      case "delete":
        newAccount.profiles[index].locations = newAccount.profiles[
          index
        ].locations.filter((_, index) => index !== action.index);
        setAccount(newAccount);
        break;
      case "setAll":
        newAccount.profiles[index].locations = action.locations!;
        setAccount(newAccount);
        break;
    }
  };
  const [loc, setLoc] = useState<Location>({
    name: "",
    category: "museum",
    hours: [
      [0, 0],
      [20, 34],
      [20, 34],
      [20, 34],
      [20, 34],
      [20, 34],
      [0, 0],
    ],
    importance: 1,
    lon: 0,
    lat: 0,
    zoom: 15,
    imgs: [],
    map: "google",
    status: {
      checkSum: "",
      isArchived: false,
      isDeleted: false,
      archivedAt: undefined,
      createdAt: new Date(),
    },
  });
  const finish = () => {
    setOpen(false);
    if (id === -1) {
      locsDispatch({ type: "add", location: loc, index: -1 });
    } else {
      locsDispatch({ type: "edit", location: loc, index: id });
    }
  };
  const [id, _setId] = useState<number>(-1);
  const [open, setOpen] = useState<boolean>(false);
  const setId = (id: number) => {
    _setId(id);
    if (id === -1) {
      setLoc({
        name: "",
        category: "museum",
        hours: [
          [0, 0],
          [20, 34],
          [20, 34],
          [20, 34],
          [20, 34],
          [20, 34],
          [0, 0],
        ],
        importance: 1,
        lon: 139.650027,
        lat: 35.6764225,
        zoom: 10,
        imgs: [],
        map: "google",
        status: {
          checkSum: "",
          isArchived: false,
          isDeleted: false,
          archivedAt: undefined,
          createdAt: new Date(),
        },
      });
    } else {
      const index = account.profiles.findIndex(
        (profile) => profile.name === account.currentProfile
      );
      setLoc(account.profiles[index].locations[id]);
    }
  };
  const locEditor = { loc, setLoc, id, setId, open, setOpen, finish };

  useEffect(() => {
    if (called.current) {
      return;
    }
    called.current = true;
    //load from JSON
    const account_cache = localStorage.getItem("account");
    setAccount(account ? JSON.parse(account_cache!) : account);
    localStorage.setItem("account", JSON.stringify(account));
  }, []);

  useEffect(() => {
    localStorage.setItem("account", JSON.stringify(account));
  }, [account]);

  const locs = useMemo(() => {
    const index = account.profiles.findIndex(
      (profile) => profile.name === account.currentProfile
    );
    return account.profiles[index].locations;
  }, [account]);

  useEffect(() => {
    //calculate all distance from center
    if (searchOption.center === undefined) {
      return;
    }
    const center = searchOption.center;
    locs.map((loc) => {
      loc.vars = loc.vars || {};
      loc.vars.distance = distance(
        center, loc)
    });
    // sort by distance
    locs.sort((a, b) => {
      return a.vars?.distance! - b.vars?.distance!;
    });
    locsDispatch({ type: "setAll", locations: locs });
    console.log(locs)
  }, [searchOption.center, locs]);
  

  return (
    <AccountContext.Provider
      value={{
        account,
        setAccount,
        locs,
        locsDispatch,
        locEditor,
        searchOption,
        setSearchOption,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

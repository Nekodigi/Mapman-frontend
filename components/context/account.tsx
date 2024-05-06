"use client";
//context to provide acocount info

import {
  createContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

import { Account } from "@/type/account";
import { Location } from "@/type/location";

type LocationEditorContextType = {
  loc: Location;
  setLoc: (loc: Location) => void; 
  id: number; // -1 add 
  setId : (id: number) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  finish: () => void;
};

type AccountContextType = {
  account: Account;
  setAccount: (account: Account) => void;
  locs: Location[];
  locsDispatch: React.Dispatch<any>;
  locEditor: LocationEditorContextType;
};

export const AccountContext = createContext<AccountContextType | undefined>(
  undefined
);

type AccountProviderProps = {
  children: React.ReactNode;
};

export const AccountProvider = ({ children }: AccountProviderProps) => {
  type Action = {
    type: "add" | "edit" | "delete";
    location: Location;
    index: number;
  };
  const called = useRef(false);
  
  // useEffect(() => {
  //   //set profiles[currentProfile].locations to locs
  //   setAccount((prev) => {
  //     const newAccount = { ...prev };
  //     //get index of currentProfile
  //     const index = newAccount.profiles.findIndex(
  //       (profile) => profile.name === newAccount.currentProfile
  //     );
  //     newAccount.profiles[index].locations = locs;
  //     return newAccount;
  //   });
  // }, [locs]);


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
          console.log(action.location)
          const locationExists = newAccount.profiles[index].locations.find(
            (location) => location.name === action.location.name
          );
          if (locationExists) return newAccount;
          newAccount.profiles[index].locations = [...newAccount.profiles[index].locations, action.location];
          return newAccount;
        });
        break;
      case "edit":
        newAccount.profiles[index].locations = newAccount.profiles[
            index
          ].locations.map((location, index) =>
            index === action.index ? action.location : location
          );
        setAccount(newAccount);
        break;
      case "delete":
        newAccount.profiles[index].locations = newAccount.profiles[
            index
          ].locations.filter((_, index) => index !== action.index);
        setAccount(newAccount);
        break;
    }
  }

  const [loc, setLoc] = useState<Location>({
    name: "",
    category: "museum",
    hours: [[0, 0], [20, 34], [20, 34], [20, 34], [20, 34], [20, 34], [0, 0]],
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
      locsDispatch({ type: "add", location: loc, index: -1});
    } else {
      locsDispatch({ type: "edit", location: loc, index: id });
    }
  }
  const [id, setId] = useState<number>(-1);
  const [open, setOpen] = useState<boolean>(false);
  const locEditor = { loc, setLoc, id, setId, open, setOpen, finish };

  useEffect(() => {
    if (called.current) {
      return;
    }
    called.current = true;
    //load from JSON
    const account_cache = localStorage.getItem("account");
    //setAccount(account ? JSON.parse(account_cache!) : account);
    locsDispatch({
      type: "add",
      location: {
        name: "default",
        category: "other",
        importance: 0,
        price: "Free",
        lon: 0,
        lat: 0,
        zoom: 10,
        imgs: ["/images/spot.webp"],
        map: "google",
        status: {
          checkSum: "0",
          isArchived: false,
          isDeleted: false,
          createdAt: new Date(),
        },
      },
      index: 0,
    });

    locsDispatch({
      type: "add",
      location: {
        name: "test",
        category: "park",
        importance: 0,
        price: "Free",
        lon: 1,
        lat: 1,
        zoom: 10,
        imgs: ["/images/spot.webp"],
        map: "google",
        status: {
          checkSum: "0",
          isArchived: false,
          isDeleted: false,
          createdAt: new Date(),
        },
      },
      index: 0,
    });

    locsDispatch({
      type: "add",
      location: {
        name: "lm",
        category: "landmark",
        importance: 0,
        price: "Free",
        lon: 0,
        lat: 1,
        zoom: 10,
        imgs: ["/images/spot.webp"],
        map: "google",
        status: {
          checkSum: "0",
          isArchived: false,
          isDeleted: false,
          createdAt: new Date(),
        },
      },
      index: 0,
    });
  }, []);

  useEffect(() => {
    //console.log(account.profiles[0].locations);
    localStorage.setItem("account", JSON.stringify(account));
    //console.log(localStorage.getItem("account"));
    console.log("account_updated")
  }
  , [account]);

  const locs = useMemo(() => {
    const index = account.profiles.findIndex(
      (profile) => profile.name === account.currentProfile
    );
    console.log(account.profiles[index].locations)
    console.log("updated")
    return account.profiles[index].locations;
  }, [account]);

  return (
    <AccountContext.Provider
      value={{ account, setAccount, locs, locsDispatch, locEditor }}
    >
      {children}
    </AccountContext.Provider>
  );
};

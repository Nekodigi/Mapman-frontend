"use client";
//context to provide acocount info

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { Account } from "@/type/account";
import { Location } from "@/type/location";

type AccountContextType = {
  account: Account;
  setAccount: (account: Account) => void;
  locs: Location[];
  locsDispatch: React.Dispatch<any>;
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
  const [locs, locsDispatch] = useReducer(
    (state: Location[], action: Action) => {
      switch (action.type) {
        case "add":
          return [...state, action.location];
        case "edit":
          return state.map((location: Location, index: number) =>
            index === action.index ? action.location : location
          );
        case "delete":
          return state.filter((_, index: number) => index !== action.index);
        default:
          return state;
      }
    },
    []
  );

  const [account, setAccount] = useState<Account>({
    name: "mapman",
    email: "test@a.a",
    currentProfile: "default",
    profiles: [
      {
        name: "default",
        locations: locs,
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

  //save to local storage every time account is updated
  useEffect(() => {
    localStorage.setItem("account", JSON.stringify(account));
  }, [account]);

  useEffect(() => {
    if (called.current) {
      return;
    }
    called.current = true;
    //load from JSON
    const account = localStorage.getItem("account");
    setAccount(account ? JSON.parse(account) : account);

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

    // localStorage.setItem("account", JSON.stringify(account));
  }, []);

  return (
    <AccountContext.Provider
      value={{ account, setAccount, locs, locsDispatch }}
    >
      {children}
    </AccountContext.Provider>
  );
};

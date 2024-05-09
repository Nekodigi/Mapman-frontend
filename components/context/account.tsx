"use client";
//context to provide acocount info

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Account } from "@/type/account";
import { Week } from "@/type/date";
import { LCategory, Location } from "@/type/location";
import { distance } from "@/utils/location";
import { useSession } from "next-auth/react";
import { isEqual } from "lodash";

const DEFAULT_LOC: Location = {
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
};

const DEFAULT_ACCOUNT: Account = {
  name: "mapman",
  email: "",
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
};
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
  viewCenter?: Location;
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
type Action = {
  type: "add" | "edit" | "delete" | "setAll";
  location?: Location;
  index?: number;
  locations?: Location[];
};
export const AccountContext = createContext<AccountContextType | undefined>(
  undefined
);
// TODO DON'T WAIT FOR ACCOUNT TO BE READY
export const AccountProvider = ({ children }: AccountProviderProps) => {
  const { data: session, status } = useSession();
  const phase = useRef<"initializing" | "loading" | "ready">("initializing");

  const [searchOption, setSearchOption] = useState<SearchOption>({
    center: undefined,
    hours: { type: "now" },
    lcat: "museum",
  });
  const [account, setAccount] = useState<Account>(DEFAULT_ACCOUNT);
  const locsDispatch = useCallback(
    (action: Action) => {
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
    },
    [account]
  );
  const [loc, setLoc] = useState<Location>(DEFAULT_LOC);
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
      setLoc(DEFAULT_LOC);
    } else {
      const index = account.profiles.findIndex(
        (profile) => profile.name === account.currentProfile
      );
      setLoc(account.profiles[index].locations[id]);
    }
  };
  const locs = useMemo(() => {
    const index = account.profiles.findIndex(
      (profile) => profile.name === account.currentProfile
    );
    return account.profiles[index].locations;
  }, [account]);
  const locEditor: LocationEditorContextType = {
    loc,
    setLoc,
    id,
    setId,
    open,
    setOpen,
    finish,
  };
  const saveAccount = async (acc: Account) => {
    //console.log(phase.current);
    if (phase.current !== "ready" || status === "loading") {
      return;
    }
    console.log("change saving...");
    localStorage.setItem("account", JSON.stringify(acc));
    if (acc.email === "") {
      console.log("only local change saved!");
      return;
    }
    await fetch("/api/account", {
      method: "POST",
      body: JSON.stringify(acc),
    });
    console.log(acc.profiles[0].locations);
    console.log("change saved!");
  };
  //* return undefined when identical
  const fetchAccount = async (cache: Account) => {
    const res = (await (
      await fetch(`/api/account/?email=${cache.email}`)
    ).json()) as Account;
    //console.log("initial synced account", res);
    if (!isEqual(cache, res)) {
      return res;
    }
  };
  const fetchAccountCache = () => {
    let account_cache = DEFAULT_ACCOUNT;
    // load account
    try {
      const cache = localStorage.getItem("account");
      if (cache !== null) account_cache = JSON.parse(cache) as Account;
    } catch (e) {}
    if (status === "authenticated")
      account_cache.email = session?.user?.email || "";
    // render account
    setAccount(account_cache);
    return account_cache;
  };

  useEffect(() => {
    if (phase.current !== "initializing") return;
    console.time("cache");
    const account_cache = fetchAccountCache();
    setAccount(account_cache);
    console.timeEnd("cache");

    if (status === "loading") return;
    phase.current = "loading";
    const email = session?.user?.email || "";
    account_cache.email = email;
    if (email === undefined || email === "") {
      phase.current = "ready";
      console.log("initialization completed(not registered)");
      return;
    }
    //socket.emit("setAccount", { email: email });
    // console.log("defined socket");
    // socket.on("account", (data: Account) => {
    //   if (!isEqual(data, account_cache)) {
    //     setAccount(data);
    //     console.log("changed by socket");
    //   }
    // });

    (async () => {
      const remote = await fetchAccount(account_cache);
      if (remote) {
        setAccount(remote);
      }
      phase.current = "ready";
      console.log("initialization completed");
    })();
    //localStorage.setItem("account", JSON.stringify(account));
  }, [status]);
  //* UPLOAD CHANGES
  useEffect(() => {
    saveAccount(account);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account.profiles, locs]);

  useEffect(() => {
    //calculate all distance from center
    if (searchOption.center !== undefined) {
      const center = searchOption.center;
      let newLocs = locs.map((loc) => {
        loc.vars = loc.vars || {};
        loc.vars.distance = distance(center, loc);
        return loc;
      });
      // sort by distance
      newLocs = newLocs.sort((a, b) => {
        return a.vars?.distance! - b.vars?.distance!;
      });
      if (isEqual(newLocs, locs)) return;
      locsDispatch({ type: "setAll", locations: newLocs });
    }
  }, [searchOption.center, locs, locsDispatch]);

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

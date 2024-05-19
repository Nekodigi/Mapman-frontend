//region IMPORTS
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
import { LCategory, Location } from "@/type/location";
import { distance } from "@/utils/location";
import { useSession } from "next-auth/react";
import { isEqual } from "lodash";
import { useGeolocated } from "react-geolocated";
import { useToast } from "../ui/use-toast";
//endregion

//region CONSTANT
const MINUTE_MS = 60000;
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
  currentProfile: "Default",
  profiles: [
    {
      name: "Default",
      locations: [],
      documents: [],
      cover: "",
      map: "google",
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
//endregion

//region TYPE
type LocationEditorContextType = {
  loc: Location;
  setLoc: (loc: Location) => void;
  fetchLocation: (name: string) => void;
  id: number; // -1 add
  invoke: (id: number, name: string) => void;
  //setId: (id: number) => void;
  open: boolean;
  //setOpen: (open: boolean) => void;
  status: "loading" | "ready";
  setStatus: React.Dispatch<React.SetStateAction<"loading" | "ready">>;
  finish: () => void;
};
export type HoursFilter = {
  type: "now" | "anytime" | "select";
  week: number;
  time: number;
};
export type SearchOption = {
  center?: Location;
  viewCenter?: Location;
  hours: HoursFilter;
  lcat: LCategory;
  layer: "roadmap" | "satellite" | "hybrid" | "terrain";
};
export type Vars = {
  heading?: number;
  orient?: DeviceOrientationEvent;
  coords?: GeolocationCoordinates;
  isMobile: boolean;
};
type AccountContextType = {
  account: Account;
  setAccount: React.Dispatch<React.SetStateAction<Account>>;
  locs: Location[];
  locsDispatch: React.Dispatch<any>;
  locEditor: LocationEditorContextType;
  searchOption: SearchOption;
  setSearchOption: React.Dispatch<React.SetStateAction<SearchOption>>;
  vars?: Vars;
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
//endregion

export const AccountContext = createContext<AccountContextType | undefined>(
  undefined
);

// TODO DON'T WAIT FOR ACCOUNT TO BE READY
export const AccountProvider = ({ children }: AccountProviderProps) => {
  //region STATE
  const { toast } = useToast();
  const { data: session, status } = useSession();
  const phase = useRef<"initializing" | "loading" | "ready">("initializing");
  const [searchOption, setSearchOption] = useState<SearchOption>({
    center: undefined,
    hours: {
      type: "anytime",
      week: new Date().getDay(),
      time: new Date().getHours() * 2 + new Date().getMinutes() / 30,
    },
    lcat: "all",
    layer: "roadmap",
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
          setAccount((prev) => {
            const newAccount = { ...prev };
            newAccount.profiles[index].locations = newAccount.profiles[
              index
            ].locations.map((location, index) =>
              index === action.index ? action.location! : location
            );
            return newAccount;
          });
          break;
        case "delete":
          setAccount((prev) => {
            const newAccount = { ...prev };
            newAccount.profiles[index].locations = newAccount.profiles[
              index
            ].locations.filter((_, index) => index !== action.index);
            return newAccount;
          });
          break;
        case "setAll":
          newAccount.profiles[index].locations = action.locations!;
          newAccount.profiles = [...newAccount.profiles];
          setAccount(newAccount);
          break;
      }
    },
    [account]
  );
  const [loc, setLoc] = useState<Location>(DEFAULT_LOC);
  const [lastFetchName, setLastFetchName] = useState<string>("");
  const [editorStatus, setEditorStatus] = useState<"loading" | "ready">(
    "ready"
  );
  const [open, setOpen] = useState<boolean>(false);
  const [id, setId] = useState<number>(-1);
  const finish = useCallback(() => {
    setOpen(false);
    setLastFetchName("");
    if (id === -1) {
      locsDispatch({ type: "add", location: { ...loc }, index: -1 });
    } else {
      locsDispatch({ type: "edit", location: { ...loc }, index: id });
    }
  }, [loc, id, locsDispatch]);
  const fetchLocation = async (name: string) => {
    if (lastFetchName === name) return;
    toast({ title: "Getting information from Google Map. Please wait..." });
    setEditorStatus("loading");
    const location = await fetch(`/api/location?name=${name}`, {
      method: "POST",
    }).then((res) => res.json());
    if (location) {
      setEditorStatus("ready");
      setLoc(location);
      setLastFetchName(name);
    } else {
      toast({ title: "Failed to fetch location" });
      setEditorStatus("ready");
      setLastFetchName(name);
    }
  };
  const invoke = (id: number, name: string) => {
    let l = loc;
    if (id === -1) {
      l = DEFAULT_LOC;
      l.name = name;
    } else {
      l = locs[id];
    }
    window.history.pushState(null, "", "?open=true");
    if (l.name !== "" && l.name !== lastFetchName && id === -1) {
      fetchLocation(l.name);
    }
    setId(id);
    setLoc(l);
  };
  const saveAccount = async (acc: Account) => {
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
    console.log("change saved!");
  };

  const locs = useMemo(() => {
    console.log("locs memo");
    saveAccount(account);
    const index = account.profiles.findIndex(
      (profile) => profile.name === account.currentProfile
    );
    return account.profiles[index].locations;
  }, [account, account.profiles, account.currentProfile]);
  const [heading, setHeading] = useState<number | undefined>(undefined);
  const [orient, setOrient] = useState<DeviceOrientationEvent | undefined>(
    undefined
  );
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      watchPosition: true,
      userDecisionTimeout: 5000,
    });
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (!navigator) return;
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    setIsMobile(isMobile);
  }, []);

  const vars: Vars = { heading, coords, orient, isMobile };
  //endregion

  //region FUNCTION
  const everyMinute = () => {
    if (searchOption.hours.type === "now") {
      setSearchOption((prev) => ({
        ...prev,
        hours: {
          type: "now",
          week: new Date().getDay(),
          time: new Date().getHours() * 2 + new Date().getMinutes() / 30,
        },
      }));
    }
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

  //endregion

  //region EFFECTS
  useEffect(() => {
    if (searchOption.hours.type !== "now") return;
  }, [searchOption.hours.type]);

  useEffect(() => {
    if (phase.current !== "initializing") return;
    console.time("cache");
    const account_cache = fetchAccountCache();
    setAccount(account_cache);
    console.timeEnd("cache");

    if (status === "loading") return;
    phase.current = "loading";
    const interval = setInterval(() => {
      everyMinute();
    }, MINUTE_MS);

    const email = session?.user?.email || "";
    account_cache.email = email;
    if (email === undefined || email === "") {
      phase.current = "ready";
      console.log("initialization completed(not registered)");
      return;
    }
    (async () => {
      const remote = await fetchAccount(account_cache);
      if (remote) {
        setAccount(remote);
      }
      phase.current = "ready";
      console.log("initialization completed");
    })();
    return () => clearInterval(interval);
  }, [status]);
  //* UPLOAD CHANGES
  useEffect(() => {
    saveAccount(account);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account.profiles]);

  useEffect(() => {
    //calculate all distance from center
    if (searchOption.center === undefined) return;
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
  }, [searchOption.center, locs, locsDispatch]);
  useEffect(() => {
    if (searchOption.viewCenter === undefined || locs.length === 0) return;
    const center = searchOption.viewCenter;
    if (distance(center, locs[0]) == locs[0].vars?.viewDistance) return;

    let newLocs = locs.map((loc) => {
      loc.vars = loc.vars || {};
      loc.vars.viewDistance = distance(center, loc);
      return loc;
    });
    locsDispatch({ type: "setAll", locations: newLocs });
  }, [searchOption.viewCenter, locs, locsDispatch]);

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null && event.absolute) {
        const mult = event.absolute ? 1 : -1;
        setHeading(event.alpha * mult);
        setOrient(event);
      }
    };
    window.addEventListener("deviceorientationabsolute", handleOrientation);
    return () => {
      window.removeEventListener(
        "deviceorientationabsolute",
        handleOrientation
      );
    };
  }, []);

  //endregion

  const locEditor: LocationEditorContextType = {
    loc,
    setLoc,
    id,
    open,
    invoke,
    finish,
    status: editorStatus,
    setStatus: setEditorStatus,
    fetchLocation,
  };
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
        vars,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

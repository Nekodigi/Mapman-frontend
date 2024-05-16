"use client";

import { Search as JSSearch } from "js-search";
import React, { useMemo, useContext, useCallback } from "react";

import { useGeolocated } from "react-geolocated";
import { AccountContext } from "@/components/context/account";
import { LocCatDD } from "@/components/dropdown/locCatDD";
import { Search } from "@/components/molecules/search";
import { HoursFilterDD } from "@/components/dropdown/hoursFilterDD";
import { Location } from "@/type/location";
import { distance } from "@/utils/location";
import { useRouter } from "next/navigation";
import { MapComponent } from "./MapComponent";
import { Button } from "@/components/ui/button";
import { Layers } from "lucide-react";

interface MapState {
  center: google.maps.LatLngLiteral;
  zoom: number;
}

// TODO * as CONTEXT!
const MapOverlay: React.FC = () => {
  const account = useContext(AccountContext);
  const router = useRouter();
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      watchPosition: true,
      userDecisionTimeout: 5000,
    });

  const locsAppend = useMemo(() => {
    if (!account) return [];
    const locs = [...account.locs];
    if (isGeolocationAvailable && isGeolocationEnabled && coords) {
      locs.push({
        name: "Current Position",
        lat: coords.latitude,
        lon: coords.longitude,
        vars: {
          distance: distance(
            { lat: coords.latitude, lon: coords.longitude } as Location,
            account.searchOption.viewCenter || ({ lat: 0, lon: 0 } as Location)
          ),
        },
      } as Location);
    }
    return locs;
  }, [account, coords, isGeolocationAvailable, isGeolocationEnabled]);

  const jss = useMemo(() => {
    const s = new JSSearch("name");
    s.addIndex("name");
    if (!account) return s;
    s.addDocuments(locsAppend || []);

    return s;
  }, [account]);

  const search = useCallback(
    (query: string) => {
      const locs = query === "" ? locsAppend : jss.search(query);
      return locs?.map((loc) => (loc as Location).name) || [];
    },
    [locsAppend, jss]
  );

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 flex h-full flex-col justify-between p-2">
      <Search
        search={search}
        finish={(loc: string) => {
          if (loc === "Current Position") {
            coords &&
              account?.setSearchOption((prev) => ({
                ...prev,
                viewCenter: {
                  lat: coords.latitude,
                  lon: coords.longitude,
                } as Location,
              }));
          } else {
            account?.setSearchOption((prev) => ({
              ...prev,
              center: jss.search(loc)[0] as Location,
              viewCenter: jss.search(loc)[0] as Location,
            }));
            router.push(`/map/details/${loc}`);
          }
        }}
      />
      <div className="pointer-events-auto flex gap-4 self-start">
        <HoursFilterDD />
        {account && (
          <LocCatDD
            lcat={account.searchOption.lcat}
            setLcat={(v) =>
              v &&
              account.setSearchOption((prev) => ({
                ...prev,
                lcat: v,
              }))
            }
            allowAll
            shadow
          />
        )}
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            account?.setSearchOption((prev) => ({
              ...prev,
              layer: prev.layer === "roadmap" ? "hybrid" : "roadmap",
            }));
          }}
        >
          <Layers className="size-4" />
        </Button>
      </div>
    </div>
  );
};

const MapUI = () => {
  return (
    <div className="relative h-full">
      <MapComponent />
      <MapOverlay />
    </div>
  );
};

export default MapUI;

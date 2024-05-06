"use client";

import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { Search as JSSearch } from "js-search";
import { Flag } from "lucide-react";
import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useContext,
  useCallback,
} from "react";

import { AccountContext } from "@/components/context/account";
import { LocCatDD } from "@/components/molecules/locCatDD";
import { Search } from "@/components/molecules/search";
import { HoursFilterDD } from "@/components/organisms/hoursFilterDD";
import { Button } from "@/components/ui/button";
import { LCategory, Location } from "@/type/location";

interface MapProps {
  initialCenter: google.maps.LatLngLiteral;
  initialZoom: number;
}

interface MapState {
  center: google.maps.LatLngLiteral;
  zoom: number;
}

const render = (status: Status): JSX.Element | null => {
  switch (status) {
    case Status.LOADING:
      return <h1>Loading Map</h1>;
    case Status.FAILURE:
      return <h1>Error loading maps</h1>;
    default:
      return null;
  }
};

const MyMapComponent: React.FC<MapProps> = ({ initialCenter, initialZoom }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [center, setCenter] =
    useState<google.maps.LatLngLiteral>(initialCenter);
  const [zoom, setZoom] = useState<number>(initialZoom);
  const account = useContext(AccountContext);

  useEffect(() => {
    if (account?.locs) {
      //add or remove changed markers
      markers.forEach((marker) => marker.setMap(null));
      setMarkers([]);

      setMarkers(
        account.locs.map(
          (loc) =>
            new google.maps.Marker({
              position: { lat: loc.lat, lng: loc.lon },
              map,
              title: loc.name,
            })
        )
      );
    }
  }, [map, account?.locs]);

  useEffect(() => {
    if (ref.current && !map) {
      // Ensure the div ref exists and map is not initialized
      const newMap = new google.maps.Map(ref.current, {
        center,
        scaleControl: true,
        disableDefaultUI: true,
        zoom,
      });
      setMap(newMap);
    } else if (map) {
      map.setCenter(center);
      map.setZoom(zoom);
    }
  }, [map, center, zoom]);

  useEffect(() => {
    if (account?.searchOption.center) {
      setCenter({
        lat: account.searchOption.center.lat,
        lng: account.searchOption.center.lon,
      });
      setZoom(account.searchOption.center.zoom);
    }
  }, [account?.searchOption]);

  const updateCenter = (newCenter: google.maps.LatLngLiteral): void => {
    setCenter(newCenter);
  };

  const getCurrentCenter = (): void => {
    if (map) {
      const currentCenter = map.getCenter();
      alert(`Current Center: ${currentCenter?.lat()}, ${currentCenter?.lng()}`);
    }
  };

  return (
    <>
      <div ref={ref} className="h-[360px] w-full" />
    </>
  );
};

// TODO * as CONTEXT!
const MapOverlay: React.FC = () => {
  const [lcat, setLcat] = useState<LCategory>("museum");
  const account = useContext(AccountContext);

  const jss = useMemo(() => {
    const s = new JSSearch("name");
    s.addIndex("name");
    s.addDocuments(account?.locs || []);

    return s;
  }, [account]);

  const search = useCallback(
    (query: string) => {
      const locs = query === "" ? account?.locs : jss.search(query);
      return locs?.map((loc) => (loc as Location).name) || [];
    },
    [jss]
  );

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 flex h-[360px] flex-col justify-between p-4">
      <Search
        search={search}
        finish={(loc) =>
          account?.setSearchOption((prev) => ({
            ...prev,
            center: jss.search(loc)[0] as Location,
          }))
        }
      />
      <div className="pointer-events-auto flex gap-4">
        <HoursFilterDD />

        <LocCatDD lcat={lcat} setLcat={setLcat} allowAll />
        <Button variant="outline" size="icon">
          <Flag className="size-4" />
        </Button>
      </div>
    </div>
  );
};

const MapUI = () => {
  return (
    <div className="h-[360px]">
      <Wrapper
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY!}
        render={render as any}
      >
        <MyMapComponent
          initialCenter={{ lat: -34.397, lng: 150.644 }}
          initialZoom={8}
        />
        <MapOverlay />
      </Wrapper>
    </div>
  );
};

export default MapUI;

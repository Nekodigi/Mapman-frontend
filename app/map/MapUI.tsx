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
import { gDistance } from "@/utils/location";

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
  const svgMarker = {
    path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
    fillColor: "blue",
    fillOpacity: 0.6,
    strokeWeight: 0,
    rotation: 0,
    scale: 2,
    anchor: new google.maps.Point(0, 20),
  };

  useEffect(() => {
    if (account?.locs && map) {
      const infoWindow = new google.maps.InfoWindow();

      //add or remove changed markers
      // don't change marker if it not changed
      setMarkers(
        account.locs.map((loc, i) => {
          //if marker include loc
          const exist = markers.find((marker) => {
            if (marker.getTitle() === loc.name) {
              return true;
            }
            return false;
          });
          console.log("esitst", loc.vars?.distance);
          if (exist) {
            exist.setOpacity(loc.vars?.distance === 0 ? 1 : 0.3);

            return exist;
          } else {
            console.log("create new marker");

            //create marker
            const marker = new google.maps.Marker({
              position: { lat: loc.lat, lng: loc.lon },
              map: map,
              title: loc.name,
              opacity: loc.vars?.distance === 0 ? 1 : 0.3,
              clickable: true,
              // icon: svgMarker,
            });
            marker.addListener("click", () => {
              infoWindow.close();
              infoWindow.setContent(marker.getTitle());
              infoWindow.open(marker.getMap(), marker);
            });
            return marker;
          }
        })
      );
    }
    if (map) {
      map.setCenter(center);
      const bounds = new google.maps.LatLngBounds();
      const filtered = account?.locs.filter((loc) =>
        loc.vars?.distance ? loc.vars?.distance < 5 : true
      );
      filtered?.forEach((loc) =>
        bounds.extend(new google.maps.LatLng(loc.lat, loc.lon))
      );
      // account?.locs.forEach((loc) =>
      //   bounds.extend(new google.maps.LatLng(loc.lat, loc.lon))
      // );
      map.fitBounds(bounds);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, account]); //

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
      //map.setZoom(zoom);
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

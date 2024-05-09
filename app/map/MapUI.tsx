"use client";

import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { Search as JSSearch } from "js-search";
import { Flag, Focus } from "lucide-react";
import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useContext,
  useCallback,
} from "react";

import { AccountContext } from "@/components/context/account";
import { LocCatDD } from "@/components/dropdown/locCatDD";
import { Search } from "@/components/molecules/search";
import { HoursFilterDD } from "@/components/dropdown/hoursFilterDD";
import { Button } from "@/components/ui/button";
import { LCategory, Location } from "@/type/location";
import { almostZero, distance } from "@/utils/location";

const N_NEARBY = 3;
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

const MyMapComponent = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [zoom, setZoom] = useState<number>(8);
  const account = useContext(AccountContext);
  const svgMarker = {
    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
    scale: 10,
    fillColor: "red",
    fillOpacity: 1,
    rotation: 0,
    strokeColor: "white",
    strokeWeight: 1,
  };
  const circleMarker: google.maps.Symbol = {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: "blue",
    fillOpacity: 1,
    scale: 10,
    strokeColor: "white",
    strokeWeight: 1,
  };

  const setBounds = useCallback(() => {
    if (map && account) {
      const center = account.searchOption.viewCenter || { lat: 0, lon: 0 };
      let filtered = account.locs.filter((loc) =>
        loc.vars?.distance ? loc.vars?.distance < 8 : true
      );
      filtered = filtered?.sort((a, b) => {
        if (a.vars?.distance && b.vars?.distance) {
          return a.vars?.distance - b.vars?.distance;
        }
        return 0;
      });
      //get first 10 items of filtered
      filtered = filtered?.slice(0, N_NEARBY);

      if (center.lat === 0 && center.lon === 0) {
        filtered = account?.locs;
      }
      const bounds = new google.maps.LatLngBounds();

      filtered?.forEach((loc) =>
        bounds.extend(new google.maps.LatLng(loc.lat, loc.lon))
      );
      const b = bounds.toJSON();
      //expand bound that it has proportional distance from center
      if (!(center.lat === 0 && center.lon === 0)) {
        bounds.extend(
          new google.maps.LatLng(
            center.lat + (center.lat - b.south),
            center.lon + (center.lon - b.west)
          )
        );
        bounds.extend(
          new google.maps.LatLng(
            center.lat + (center.lat - b.north),
            center.lon + (center.lon - b.east)
          )
        );
      }
      // // consider search bar consume 64px of 360px height
      map.fitBounds(bounds, { top: 64, bottom: 0, left: 0, right: 0 });
    }
  }, [account?.locs, account?.searchOption.viewCenter, map]);

  useEffect(() => {
    if (account?.locs && map) {
      const infoWindow = new google.maps.InfoWindow();

      //add or remove changed markers
      // don't change marker if it not changed
      console.log(account?.locs.map((loc) => loc.vars?.distance));
      setMarkers(
        account.locs.map((loc, i) => {
          //if marker include loc
          const exist = markers.find((marker) => {
            if (marker.getTitle() === loc.name) {
              return true;
            }
            return false;
          });
          if (exist) {
            if (
              account.searchOption.viewCenter &&
              almostZero(distance(account.searchOption.viewCenter, loc))
            ) {
              exist.setOpacity(1);
            } else {
              exist.setOpacity(0.3);
            }
            exist.setIcon(
              almostZero(loc.vars?.distance) ? svgMarker : circleMarker
            );

            return exist;
          } else {
            //create marker
            const marker = new google.maps.Marker({
              position: { lat: loc.lat, lng: loc.lon },
              map: map,
              title: loc.name,
              opacity: almostZero(loc.vars?.distance) ? 1 : 0.3,
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
    setBounds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, account?.locs, account?.searchOption.viewCenter]); //

  useEffect(() => {
    if (ref.current && !map) {
      // Ensure the div ref exists and map is not initialized
      const center = account?.searchOption.viewCenter || { lat: 0, lon: 0 };
      const newMap = new google.maps.Map(ref.current, {
        center: { lat: center.lat, lng: center.lon },
        scaleControl: true,
        disableDefaultUI: true,
        zoom,
        renderingType: google.maps.RenderingType.VECTOR,
      });
      setMap(newMap);
    } else if (map) {
      //map.setZoom(zoom);
    }
  }, [map, account?.searchOption.viewCenter, zoom]);

  return (
    <>
      <div ref={ref} className="h-[360px] w-full" />
      <div className="pointer-events-none absolute top-0 flex h-[360px] w-full items-end justify-end p-2">
        <Button
          variant="outline"
          size="icon"
          className="pointer-events-auto shadow"
          onClick={() => {
            setBounds();
          }}
        >
          <Focus className="size-4" />
        </Button>
      </div>
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
    [account?.locs, jss]
  );

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 flex h-[360px] flex-col justify-between p-2">
      <Search
        search={search}
        finish={(loc) =>
          account?.setSearchOption((prev) => ({
            ...prev,
            center: jss.search(loc)[0] as Location,
            viewCenter: jss.search(loc)[0] as Location,
          }))
        }
      />
      <div className="self-start pointer-events-auto flex gap-4">
        <HoursFilterDD />
        <LocCatDD lcat={lcat} setLcat={setLcat} allowAll />
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
        <MyMapComponent />
        <MapOverlay />
      </Wrapper>
    </div>
  );
};

export default MapUI;

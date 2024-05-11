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

import { useGeolocated } from "react-geolocated";
import { AccountContext } from "@/components/context/account";
import { LocCatDD } from "@/components/dropdown/locCatDD";
import { Search } from "@/components/molecules/search";
import { HoursFilterDD } from "@/components/dropdown/hoursFilterDD";
import { Button } from "@/components/ui/button";
import { LCategory, Location } from "@/type/location";
import { almostZero, distance } from "@/utils/location";
import { useRouter } from "next/navigation";

const N_NEARBY = 5;
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

var monoStyle = [
  {
    featureType: "all",
    elementType: "all",
    stylers: [
      { saturation: -100 }, // <-- THIS
    ],
  },
];

const MyMapComponent = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [zoom, setZoom] = useState<number>(8);
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

  const arrowMarker = {
    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
    scale: 8,
    fillColor: "red",
    fillOpacity: 1,
    rotation: 0,
    strokeColor: "#0f172a",
    strokeWeight: 5,
  };
  const circleMarker: google.maps.Symbol = {
    //circle path
    path: "M 0,0 m -1,0 a 1,1 0 1,0 2,0 a 1,1 0 1,0 -2,0",
    fillColor: "white",
    fillOpacity: 1,
    scale: 10,
    strokeColor: "#0f172a",
    strokeWeight: 5,
  };
  const squareMarker: google.maps.Symbol = {
    path: "M 0,0 0,2 2,2 2,0 z",
    fillColor: "white",
    fillOpacity: 1,
    scale: 10,
    strokeColor: "#0f172a",
    strokeWeight: 5,
  };

  const setBounds = useCallback(() => {
    if (map && account?.locs) {
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
  // jump to current position
  const jumpToCurrent = useCallback(() => {
    if (isGeolocationAvailable && isGeolocationEnabled && coords && map) {
      map.panTo({ lat: coords.latitude, lng: coords.longitude });
      //set zoom
      map.setZoom(10);
    }
  }, [coords, isGeolocationAvailable, isGeolocationEnabled, map]);

  useEffect(() => {
    if (account?.locs && map) {
      const infoWindow = new google.maps.InfoWindow();

      //add or remove changed markers
      // don't change marker if it not changed
      //copy account.locs
      const locs = [...account.locs];
      //add current position
      if (isGeolocationAvailable && isGeolocationEnabled && coords) {
        locs.push({
          name: "Current Position",
          lat: coords.latitude,
          lon: coords.longitude,
          vars: {
            distance: distance(
              { lat: coords.latitude, lon: coords.longitude } as Location,
              account.searchOption.viewCenter ||
                ({ lat: 0, lon: 0 } as Location)
            ),
          },
        } as Location);
      }
      setMarkers(
        locs.map((loc, i) => {
          //if marker include loc
          const exist = markers.find((marker) => {
            if (marker.getTitle() === loc.name) {
              return true;
            }
            return false;
          });
          if (exist) {
            if (loc.name === "Current Position") {
              exist.setOpacity(1);
              exist.setIcon({
                ...(exist.getIcon() as google.maps.Icon),
                rotation: account.vars?.heading || 0,
              });
              return exist;
            }

            exist.setIcon(
              almostZero(loc.vars?.distance) ? squareMarker : circleMarker
            );
            if (
              account.searchOption.viewCenter &&
              almostZero(distance(account.searchOption.viewCenter, loc))
            ) {
              //exist.setOpacity(1);
              exist.setIcon({
                ...(exist.getIcon() as google.maps.Icon),
                scale: 20,
                fillColor: "#22c55e",
              });
            } else {
              exist.setIcon({
                ...(exist.getIcon() as google.maps.Icon),
                scale: almostZero(loc.vars?.distance) ? 15 : 5 * loc.importance,
                fillColor: "white",
              });
            }
            exist.setOpacity(1);

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
              // infoWindow.close();
              // infoWindow.setContent(marker.getTitle());
              // infoWindow.open(marker.getMap(), marker);
              account.setSearchOption((prev) => ({
                ...prev,
                viewCenter: loc,
              }));
              //open detail page
              router.push(`/map/details/${loc.name}`);
            });
            return marker;
          }
        })
      );
    }
    setBounds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, account?.locs, account?.searchOption.viewCenter]); //

  //update current Position marker every update
  useEffect(() => {
    if (markers.length > 0 && isGeolocationAvailable && isGeolocationEnabled) {
      const currentPos = markers.find(
        (marker) => marker.getTitle() === "Current Position"
      );
      if (currentPos) {
        currentPos.setPosition({
          lat: coords?.latitude || 0,
          lng: coords?.longitude || 0,
        });
      } else {
        const marker = new google.maps.Marker({
          position: { lat: coords?.latitude || 0, lng: coords?.longitude || 0 },
          map: map,
          title: "Current Position",
          opacity: 1,
          clickable: true,
          icon: arrowMarker,
        });
        // marker.addListener("click", () => {
        //   account.setSearchOption((prev) => ({
        //     ...prev,
        //     viewCenter: {
        //       lat: coords?.latitude || 0,
        //       lon: coords?.longitude || 0,
        //     },
        //   }));
        //   //open detail page
        //   router.push(`/map/details/Current%20Position`);
        // });
        setMarkers([...markers, marker]);
      }
    }
  }, [
    arrowMarker,
    coords,
    isGeolocationAvailable,
    isGeolocationEnabled,
    map,
    markers,
  ]);

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
        gestureHandling: "greedy",
      });
      var mapType = new google.maps.StyledMapType(monoStyle, {
        name: "Grayscale",
      });
      newMap.mapTypes.set("tehgrayz", mapType);
      newMap.setMapTypeId("tehgrayz");
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
            jumpToCurrent();
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
    <div className="pointer-events-none absolute inset-x-0 top-0 flex h-[360px] flex-col justify-between p-2">
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
          }
        }}
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

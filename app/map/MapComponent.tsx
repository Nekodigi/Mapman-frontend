"use client";

import { Focus } from "lucide-react";
import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
} from "react";

import { useGeolocated } from "react-geolocated";
import { AccountContext } from "@/components/context/account";
import { Button } from "@/components/ui/button";
import { Location } from "@/type/location";
import { almostZero, distance, filter } from "@/utils/location";
import { useRouter } from "next/navigation";

const N_NEARBY = 5;
const DIST_LIMIT = 12;
const initCenter = {
  lat: 35.6764,
  lon: 139.65,
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

export const MapComponent = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [zoom, setZoom] = useState<number>(10);
  const account = useContext(AccountContext);
  const router = useRouter();
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();

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
    fillColor: "#f43f5e",
    fillOpacity: 1,
    rotation: 0,
    strokeColor: "#0f172a",
    strokeWeight: 3,
    //origin center
    anchor: new google.maps.Point(0, 2),
  };
  const circleMarker: google.maps.Symbol = {
    //circle path
    path: "M 0,0 m -1,0 a 1,1 0 1,0 2,0 a 1,1 0 1,0 -2,0",
    fillColor: "#0ea5e9",
    fillOpacity: 1,
    scale: 10,
    strokeColor: "#0f172a",
    strokeWeight: 3,
  };

  const squareMarker: google.maps.Symbol = {
    path: "M 0,0 0,2 2,2 2,0 z",
    fillColor: "#0ea5e9",
    fillOpacity: 1,
    scale: 10,
    strokeColor: "#0f172a",
    strokeWeight: 3,
  };

  const setBounds = useCallback(() => {
    if (map && account?.locs) {
      const center = account.searchOption.viewCenter || initCenter;
      let filtered = account.locs.filter((loc) =>
        loc.vars?.distance ? loc.vars?.distance < DIST_LIMIT : true
      );
      filtered = filtered?.sort((a, b) => {
        if (a.vars?.distance && b.vars?.distance) {
          return a.vars?.distance - b.vars?.distance;
        }
        return 0;
      });
      //get first 10 items of filtered
      filtered = filtered?.slice(0, N_NEARBY);

      if (center.lat === initCenter.lat && center.lon === initCenter.lon) {
        filtered = account?.locs;
      }
      const bounds = new google.maps.LatLngBounds();

      filtered?.forEach((loc) =>
        bounds.extend(new google.maps.LatLng(loc.lat, loc.lon))
      );
      const b = bounds.toJSON();
      //expand bound that it has proportional distance from center
      if (!(center.lat === initCenter.lat && center.lon === initCenter.lon)) {
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
      map.fitBounds(bounds, { top: 64, bottom: 64, left: 0, right: 0 });
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

  const dragend = useCallback(
    (marker: google.maps.Marker, loc: Location, e: any) => {
      if (!account?.locs) return;
      const p = e.latLng.toJSON() as google.maps.LatLngLiteral;
      const pos = { lat: p.lat, lon: p.lng } as Location;
      const closest = account.locs.reduce((prev, curr) =>
        distance(curr, pos) < distance(prev, pos) ? curr : prev
      );
      router.push(`/map/route?start=${loc.name}&end=${closest.name}`);
      marker.setPosition({ lat: loc.lat, lng: loc.lon });
      const option: google.maps.DirectionsRendererOptions = {
        suppressInfoWindows: true,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: "#3b82f6",
          strokeOpacity: 1,
          strokeWeight: 5,
        },
      };

      directionsRenderer.setOptions(option);
      directionsService.route(
        {
          origin: { lat: loc.lat, lng: loc.lon },
          destination: { lat: closest.lat, lng: closest.lon },
          travelMode: google.maps.TravelMode.TRANSIT,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            if (!result) return;
            //remove transit info
            result.routes[0].legs[0].steps = result.routes[0].legs[0].steps.map(
              (step) => {
                let res = {
                  ...step,
                  travel_mode: google.maps.TravelMode.TRANSIT,
                };
                //remove transit from define
                if (res.transit) {
                  delete res.transit;
                }
                return res;
              }
            );
            // account.setSearchOption((prev) => ({
            //   ...prev,
            //   route: {
            //     duration: parseFloat(
            //       result.routes[0].legs[0].duration?.text.split(" ")[0] || "0"
            //     ),
            //     distance: parseFloat(
            //       result.routes[0].legs[0].distance?.text.split(" ")[0] || "0"
            //     ),
            //     arrive: result.routes[0].legs[0].departure_time?.text,
            //     depart: result.routes[0].legs[0].arrival_time?.text,
            //   },
            // }));
            directionsRenderer.unbindAll();
            directionsRenderer.setOptions({
              map: map,
              preserveViewport: true,
            });
            directionsRenderer.setDirections(result);
          }
        }
      );
    },
    [account?.locs, directionsRenderer, directionsService, map]
  );

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
              account.searchOption.viewCenter || (initCenter as Location)
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
          let marker = exist as google.maps.Marker;
          if (!exist) {
            marker = new google.maps.Marker({
              position: { lat: loc.lat, lng: loc.lon },
              map: map,
              title: loc.name,
              opacity: 1,
              clickable: true,
              draggable: true,
              icon:
                loc.name === "Current Position" ? arrowMarker : circleMarker,
            });
            marker.addListener("click", () => {
              account.setSearchOption((prev) => ({
                ...prev,
                viewCenter: loc,
              }));
              router.push(`/map/details/${loc.name}`);
            });
            marker.addListener("dragend", (e: any) => {
              dragend(marker, loc, e);
            });
          }
          marker.setOpacity(filter(loc, account.searchOption) ? 1 : 0.3);
          if (loc.name === "Current Position") {
            return marker;
          }
          marker.setIcon(
            almostZero(loc.vars?.distance) ? squareMarker : circleMarker
          );
          if (
            account.searchOption.viewCenter &&
            almostZero(distance(account.searchOption.viewCenter, loc))
          ) {
            marker.setIcon({
              ...(marker.getIcon() as google.maps.Icon),
              scale: 15,
              fillColor: "#22c55e",
            });
          } else {
            marker.setIcon({
              ...(marker.getIcon() as google.maps.Icon),
              scale: almostZero(loc.vars?.distance)
                ? 15
                : 2 + 4 * loc.importance,
              fillColor: "#f8fafc",
            });
          }
          return marker;
        })
      );
    }
    setBounds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, account?.locs, account?.searchOption.viewCenter]); //

  // change opacity when filter
  useEffect(() => {
    if (!account?.searchOption) return;
    setMarkers((prev) => {
      return prev.map((marker) => {
        const loc = account.locs.find((loc) => loc.name === marker.getTitle());
        if (!loc) return marker;
        const visible = filter(loc, account.searchOption);
        marker.setOpacity(visible ? 1 : 0.3);
        return marker;
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account?.locs, account?.searchOption.hours, account?.searchOption.lcat]);

  //rotate and move current
  useEffect(() => {
    if (
      coords &&
      map &&
      (account?.locs === undefined || account?.locs.length === 0)
    ) {
      map.setCenter({ lat: coords.latitude, lng: coords.longitude });
      map.setZoom(10);
    }
    const current = markers.find(
      (marker) => marker.getTitle() === "Current Position"
    );
    if (current) {
      current.setIcon({
        ...(current.getIcon() as google.maps.Icon),
        rotation: -(account?.vars?.heading || 0),
      });
      current.setPosition({
        lat: coords?.latitude || 0,
        lng: coords?.longitude || 0,
      });
    }
  }, [account?.vars, markers, map, coords]);

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
      const center = account?.searchOption.viewCenter || initCenter;
      const newMap = new google.maps.Map(ref.current, {
        center: { lat: center.lat, lng: center.lon },
        scaleControl: true,
        clickableIcons: false,
        disableDefaultUI: true,
        zoom: 10,
        renderingType: google.maps.RenderingType.VECTOR,
        gestureHandling: "greedy",
      });
      directionsRenderer.setMap(newMap);
      var mapType = new google.maps.StyledMapType(monoStyle, {
        name: "Grayscale",
      });
      newMap.mapTypes.set("tehgrayz", mapType);
      newMap.setMapTypeId("tehgrayz");
      setMap(newMap);
    } else if (map) {
    }
  }, [map, account?.searchOption.viewCenter, zoom]);

  useEffect(() => {
    if (map) {
      directionsRenderer.setMap(map);
    }
  }, [directionsRenderer, map]);

  return (
    <>
      <div ref={ref} className="size-full" />
      <div className="pointer-events-none absolute top-0 flex size-full items-end justify-end p-2">
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
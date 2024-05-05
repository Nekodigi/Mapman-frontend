"use client";

import React, { useState, useRef, useEffect } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Circle,
  Clock,
  Flag,
  Landmark,
  ShoppingBag,
  TreePine,
  Utensils,
} from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Search } from "@/components/molecules/search";
import { LocCatDD } from "@/components/molecules/locCatDD";
import { LCategory } from "@/type/location";
import { WeekToggle } from "@/components/molecules/weekToggle";
import { Week } from "@/type/date";
import { WeekHourDD } from "@/components/organisms/weekHourDD";
import { HoursDD } from "@/components/organisms/hoursDD";

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
  const [center, setCenter] =
    useState<google.maps.LatLngLiteral>(initialCenter);
  const [zoom, setZoom] = useState<number>(initialZoom);

  // Initialize and update the map when center or zoom changes
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
      <div ref={ref} className="w-full h-[360px]" />
      {/* <button
        onClick={() =>
          updateCenter({ lat: center.lat + 0.0001, lng: center.lng + 0.0001 })
        }
      >
        Move Center
      </button>
      <button onClick={getCurrentCenter}>Get Current Center</button> */}
    </>
  );
};

// TODO * as CONTEXT!
const MapOverlay: React.FC = () => {
  const [week, setWeek] = useState<Week | undefined>(); // ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
  const [hour, setHour] = useState<number[]>([24]);
  const [lcat, setLcat] = useState<LCategory>("museum");
  const [hours, setHours] = useState<number[][]>([
    [20, 38],
    [20, 38],
    [20, 38],
    [20, 38],
    [20, 38],
    [20, 38],
    [20, 38],
  ]);

  return (
    <div className="flex flex-col justify-between h-[360px] absolute top-0 left-0 right-0 p-4 pointer-events-none">
      <Search />
      <div className="flex gap-4 pointer-events-auto">
        {/* <WeekHourDD
          week={week}
          setWeek={setWeek}
          hour={hour}
          setHour={setHour}
        /> */}
        <HoursDD hours={hours} setHours={setHours} />

        <LocCatDD lcat={lcat} setLcat={setLcat} allowAll />
        <Button variant="outline" size="icon">
          <Flag className="h-4 w-4" />
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

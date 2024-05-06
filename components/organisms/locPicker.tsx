import { Status } from "@googlemaps/react-wrapper";
import React, { useState, useRef, useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Location } from "@/type/location";

interface MapProps {
  initialCenter: google.maps.LatLngLiteral;
  initialZoom: number;
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

type LocPickerProps = {
  loc: Location;
  setLoc: (loc: Location) => void;
};
type MapPreviewProps = {
  loc: Location;
};
const MapPreview = ({ loc }: MapPreviewProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const [marker, setMarker] = useState<google.maps.Marker>();

  useEffect(() => {
    const center = { lat: loc.lat, lng: loc.lon };
    const zoom = loc.zoom;
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
    marker?.setMap(null);
    setMarker(
      new google.maps.Marker({
        position: center,
        map: map,
      })
    );
  }, [map, loc.lat, loc.zoom, loc.lon]);

  return <div ref={ref} className="h-[128px] w-full" />;
};
export const LocPicker = ({ loc, setLoc }: LocPickerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  // //const [zoom, setZoom] = useState<number>(15);

  // Initialize and update the map when center or zoom changes
  useEffect(() => {
    const center = { lat: loc.lat, lng: loc.lon };
    const zoom = loc.zoom;
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
  }, [map, loc]);

  return (
    <Dialog>
      <DialogTrigger>
        <MapPreview loc={loc} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Spot</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-4">
          <Label className="min-w-20 text-right">Lon,Lat</Label>
          <Input
            value={loc.lon}
            type="number"
            onChange={(e) =>
              setLoc({
                ...loc,
                lon: Number(e.target.value),
              })
            }
          />
          <Input
            value={loc.lat}
            type="number"
            onChange={(e) =>
              setLoc({
                ...loc,
                lat: Number(e.target.value),
              })
            }
          />
        </div>
        <div className="flex items-center gap-4">
          <Label className="min-w-20 text-right">Zoom</Label>
          <Input
            value={loc.zoom}
            type="number"
            onChange={(e) =>
              setLoc({
                ...loc,
                zoom: Number(e.target.value),
              })
            }
          />
        </div>
        <MapPreview loc={loc} />
        {/* <div ref={ref} className="w-full h-[128px]" /> */}
      </DialogContent>
    </Dialog>
  );
};

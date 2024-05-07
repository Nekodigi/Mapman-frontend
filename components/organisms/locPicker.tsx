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

const ZOOM = 12;
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
  setLoc: (loc: Location) => void;
};
const MapPreview = ({ loc, setLoc }: MapPreviewProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const [marker, setMarker] = useState<google.maps.Marker>();

  useEffect(() => {
    const center = { lat: loc.lat, lng: loc.lon };
    if (ref.current && !map) {
      // Ensure the div ref exists and map is not initialized

      const newMap = new google.maps.Map(ref.current, {
        center,
        scaleControl: true,
        disableDefaultUI: true,
        zoom: ZOOM,
      });
      setMap(newMap);
    } else if (map) {
      map.setCenter(center);
      //map.setZoom(zoom);
    }
    marker?.setMap(null);
    const m = new google.maps.Marker({
      position: center,
      map: map,
      draggable: true,
    });
    m.addListener("dragend", (e: any) => {
      const pos = marker?.getPosition();
      pos &&
        setLoc({
          ...loc,
          lat: e.latLng.lat(),
          lon: e.latLng.lng(),
        });
    });
    setMarker(m);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, loc.lat, loc.lon]);

  return <div ref={ref} className="h-[128px] w-full" />;
};
export const LocPicker = ({ loc, setLoc }: LocPickerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  // //const [zoom, setZoom] = useState<number>(15);

  // Initialize and update the map when center or zoom changes
  useEffect(() => {
    const center = { lat: loc.lat, lng: loc.lon };
    if (ref.current && !map) {
      // Ensure the div ref exists and map is not initialized

      const newMap = new google.maps.Map(ref.current, {
        center,
        scaleControl: true,
        disableDefaultUI: true,
        zoom: ZOOM,
      });
      setMap(newMap);
    } else if (map) {
      map.setCenter(center);
      map.setZoom(ZOOM);
    }
  }, [map, loc]);

  return (
    <Dialog>
      <DialogTrigger>
        <MapPreview loc={loc} setLoc={setLoc} />
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
        <MapPreview loc={loc} setLoc={setLoc} />
        {/* <div ref={ref} className="w-full h-[128px]" /> */}
      </DialogContent>
    </Dialog>
  );
};

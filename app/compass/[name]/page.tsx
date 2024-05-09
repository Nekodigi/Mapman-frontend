"use client";
import React, { useContext, useMemo } from "react";
import { useGeolocated } from "react-geolocated";
import { useEffect, useState } from "react";
import { AccountContext } from "@/components/context/account";
import { distance } from "@/utils/location";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Demo = ({ params }: { params: { name: string } }) => {
  const account = useContext(AccountContext);
  const loc = useMemo(() => {
    if (!account?.locs) return undefined;
    const name = decodeURIComponent(params.name);
    return account.locs.find((l) => l.name === name);
  }, [account?.locs, params.name]);
  const [heading, setHeading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      watchPosition: true,
      userDecisionTimeout: 5000,
    });
  const dist = useMemo(() => {
    if (!loc || !coords) return undefined;
    return distance(loc, {
      lat: coords.latitude,
      lon: coords.longitude,
    } as any);
  }, [loc, coords]);
  const dir = useMemo(() => {
    if (!loc || !coords) return undefined;
    // in degrees
    return (
      Math.atan2(loc.lon - coords.longitude, loc.lat - coords.latitude) *
      (180 / Math.PI)
    );
  }, [loc, coords]);

  const handleOrientation = (event: DeviceOrientationEvent) => {
    if (event.alpha !== null) {
      setHeading(event.alpha);
    }
  };

  useEffect(() => {
    window.addEventListener("deviceorientation", handleOrientation);
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  return (
    loc &&
    coords && (
      <div className="flex justify-center h-full p-4">
        <Card className="w-full max-w-[480px]">
          <CardHeader className="flex gap-4">
            <CardTitle>{loc.name}</CardTitle>
            <CardTitle>
              {distance(loc, {
                lat: coords.latitude,
                lon: coords.longitude,
              } as any).toFixed(2)}{" "}
              km
            </CardTitle>
          </CardHeader>
          <CardFooter>
            <div className="w-full aspect-square p-8">
              <div className="w-full h-full bg-gray-200 rounded-full relative">
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  w-0 h-0 "
                  style={{
                    transform: `translate(-50%, -50%) rotate(${(heading || 0) + (dir || 0) + 90}deg)`,
                  }}
                >
                  <div
                    className="absolute top-1/2 left-1/2 w-0 h-0 border-4 border-solid "
                    style={{
                      borderLeft: "50px solid transparent",
                      borderRight: "50px solid transparent",
                      borderBottom: "250px solid #ef4444",
                      borderTop: "0",
                      transform: `translate(-50%, -50%)`,
                    }}
                  />
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    )
    // <div>
    //   {!isGeolocationAvailable ? (
    //     <div>Your browser does not support Geolocation</div>
    //   ) : !isGeolocationEnabled ? (
    //     <div>Geolocation is not enabled</div>
    //   ) : coords ? (
    //     <table>
    //       <tbody>
    //         <tr>
    //           <td>latitude</td>
    //           <td>{coords.latitude}</td>
    //         </tr>
    //         <tr>
    //           <td>longitude</td>
    //           <td>{coords.longitude}</td>
    //         </tr>
    //         <tr>
    //           <td>altitude</td>
    //           <td>{coords.altitude}</td>
    //         </tr>
    //         <tr>
    //           <td>heading</td>
    //           <td>{coords.heading}</td>
    //         </tr>
    //         <tr>
    //           <td>speed</td>
    //           <td>{coords.speed}</td>
    //         </tr>
    //       </tbody>
    //     </table>
    //   ) : (
    //     <div>Getting the location data&hellip; </div>
    //   )}
    //   <div style={{ textAlign: "center" }}>
    //     <h1>
    //       Compass Heading:{" "}
    //       {heading !== null ? `${Math.round(heading)}°` : "Unavailable"}
    //       {heading && dir && ((dir - heading) % 360) - 180}
    //     </h1>
    //     <h1>Distance: {dist ? `${dist.toFixed(2)} km` : "Unavailable"}</h1>
    //     <div
    //       style={{
    //         width: "10px",
    //         height: "200px",
    //         backgroundColor: "white",
    //         transform: `rotate(${(heading || 0) + 90}deg)`,
    //       }}
    //       className="absolute top-32 left-32"
    //     />
    //     {error && <p>Error: {error}</p>}
    //   </div>
    // </div>
  );
};

export default Demo;

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

  const dist = useMemo(() => {
    if (!loc || !account?.vars?.coords) return undefined;
    return distance(loc, {
      lat: account.vars.coords.latitude,
      lon: account.vars.coords.longitude,
    } as any);
  }, [loc, account?.vars?.coords]);
  const dir = useMemo(() => {
    if (!loc || !account?.vars?.coords) return undefined;
    // in degrees
    return (
      Math.atan2(
        loc.lon - account.vars.coords.longitude,
        loc.lat - account.vars.coords.latitude
      ) *
      (180 / Math.PI)
    );
  }, [loc, account?.vars?.coords]);

  return (
    loc && (
      <div className="flex justify-center h-full p-4">
        <Card className="w-full max-w-[480px]">
          <CardHeader className="flex gap-4">
            <CardTitle>{loc.name}</CardTitle>
            <CardTitle>{dist?.toFixed(2)} km</CardTitle>
          </CardHeader>
          <CardFooter>
            <div className="w-full aspect-square p-8">
              <div className="w-full h-full bg-gray-200 rounded-full relative">
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  w-0 h-0 "
                  style={{
                    transform: `translate(-50%, -50%) rotate(${(account?.vars?.heading || 0) + (dir || 0) + 90}deg)`,
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
  );
};

export default Demo;

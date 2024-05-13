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
import dynamic from "next/dynamic";
import {
  GyroscopePlugin,
  GyroscopePluginConfig,
} from "@photo-sphere-viewer/gyroscope-plugin";
import { CompassPlugin } from "@photo-sphere-viewer/compass-plugin";
import { LensflarePlugin } from "react-photo-sphere-viewer";
import {
  MarkersPlugin,
  MarkersPluginConfig,
} from "@photo-sphere-viewer/markers-plugin";
import { Viewer } from "@photo-sphere-viewer/core";

const ReactPhotoSphereViewer = dynamic(
  () =>
    import("react-photo-sphere-viewer").then(
      (mod) => mod.ReactPhotoSphereViewer
    ),
  {
    ssr: false,
  }
);

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

  const gyroCfg: GyroscopePluginConfig = {
    touchmove: true,
    roll: true,
    absolutePosition: false,
    moveMode: "smooth",
  };
  const markerCfg: MarkersPluginConfig = {
    markers: [
      {
        // image marker that opens the panel when clicked
        id: "image",
        position: { yaw: 0.5, pitch: 0.2 },
        image: "/icons/icon-192x192.png",
        size: { width: 32, height: 32 },
        anchor: "bottom center",
        zoomLvl: 100,
        tooltip: "A image marker. <b>Click me!</b>",
      },
    ],
  };
  //[GyroscopePlugin, cfg]
  const plugins = [
    [GyroscopePlugin, gyroCfg],
    [MarkersPlugin, markerCfg],
  ];

  const handleReady = (instance: Viewer) => {
    setH(account?.vars?.heading || 0);
    const gyroPlugs = instance.getPlugin(GyroscopePlugin);
    if (!gyroPlugs) return;
    gyroPlugs.start("fast");

    const markersPlugs = instance.getPlugin(MarkersPlugin);
    if (!markersPlugs) return;
    markersPlugs.addMarker({
      id: "imageLayer2",
      image: "/icons/icon-192x192.png",
      size: { width: 220, height: 220 },
      position: { yaw: "130.5deg", pitch: "-0.1deg" },
      tooltip: "Image embedded in the scene",
    });
    markersPlugs.addEventListener("select-marker", () => {
      console.log("asd");
    });
  };
  const [h, setH] = useState(0);

  return (
    loc && (
      <div className="flex flex-col justify-center h-full p-4">
        {/* {account?.vars?.orient?.alpha && (
          
        )} */}
        <ReactPhotoSphereViewer
          src="/images/focus.png"
          moveInertia={false}
          height={"100vh"}
          width={"100%"}
          // defaultYaw={-(account.vars.orient.alpha / 180) * Math.PI}
          moveSpeed={1}
          plugins={plugins as any}
          onReady={handleReady}
          // mousemove={false}
        ></ReactPhotoSphereViewer>
        <p>{-((h || 0) / 180) * Math.PI}</p>
        <p>{-((account?.vars?.orient?.alpha || 0) / 180) * Math.PI}</p>
        <p>{account?.vars?.orient?.alpha}</p>
        <p>{account?.vars?.orient?.beta}</p>
        <p>{account?.vars?.orient?.gamma}</p>

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
                    transform: `translate(-50%, -50%) rotate(${(account?.vars?.heading || 0) + (dir || 0)}deg)`,
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

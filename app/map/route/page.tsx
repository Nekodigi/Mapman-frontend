"use client";

import { AccountContext } from "@/components/context/account";
import { useContext, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function Page() {
  const account = useContext(AccountContext);
  const params = useSearchParams();
  const router = useRouter();
  const directionsService = new google.maps.DirectionsService();
  const [route, setRoute] = useState<{
    distance: string;
    duration: string;
    depart: string;
    arrive: string;
  }>();

  const start = useMemo(() => {
    const name = decodeURIComponent(params.get("start")!);
    return account?.locs.find((l) => l.name === name);
  }, [params]);

  const end = useMemo(() => {
    const name = decodeURIComponent(params.get("end")!);
    return account?.locs.find((l) => l.name === name);
  }, [params]);

  useEffect(() => {
    if (!start || !end) return;
    directionsService.route(
      {
        origin: { lat: start.lat, lng: start.lon },
        destination: { lat: end.lat, lng: end.lon },
        travelMode: google.maps.TravelMode.TRANSIT,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          if (!result) return;
          const distance = result.routes[0].legs[0].distance?.text;
          const duration = result.routes[0].legs[0].duration?.text;
          const depart = result.routes[0].legs[0].departure_time?.text;
          const arrive = result.routes[0].legs[0].arrival_time?.text;
          console.log(distance, duration, depart, arrive);
          setRoute({
            distance: distance ? distance : "",
            duration: duration ? duration : "",
            depart: depart ? depart : "",
            arrive: arrive ? arrive : "",
          });
        }
      }
    );
  }, [start, end]);

  return (
    <div className="flex w-full min-w-0 flex-col gap-1">
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          router.push("/map");
        }}
        className="absolute z-10 m-4"
      >
        <ArrowLeft />
      </Button>
      <div className="flex min-w-0 justify-center pt-16">
        <div className="flex min-w-0 flex-col justify-start ">
          {start && (
            <div className="flex h-[72px] min-w-0 gap-2 px-2 py-1">
              <Image
                src={start.imgs[0]}
                width={128}
                height={128}
                className="w-16 min-w-16 rounded object-cover"
                alt="thumbnail"
              />
              <div className="flex min-w-0 flex-col gap-1">
                <h3 className="truncate font-medium">{start.name}</h3>
                <h3 className="truncate ">Depart {route?.depart}</h3>
              </div>
              {/* <LocationInfos loc={start} /> */}
            </div>
          )}
          <div className="flex flex-col items-center gap-2 p-8">
            <ArrowDown opacity={0.5} strokeWidth={1} />
            <h3 className="truncate text-xl font-medium">{route?.duration}</h3>
            <h3 className="truncate text-xl font-medium">{route?.distance}</h3>
            <ArrowDown opacity={0.5} strokeWidth={1} />
          </div>
          {end && (
            <div className="flex h-[72px] min-w-0 gap-2 px-2 py-1">
              <Image
                src={end.imgs[0]}
                width={128}
                height={128}
                className="w-16 min-w-16 rounded object-cover"
                alt="thumbnail"
              />
              <div className="flex min-w-0 flex-col gap-1">
                <h3 className="truncate font-medium">{end.name}</h3>
                <h3 className="truncate">Arrive {route?.arrive}</h3>
              </div>
              {/* <LocationInfos loc={start} /> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

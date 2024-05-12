"use client";

import { useContext, useMemo } from "react";

import { AccountContext } from "../context/account";
import { LocCatDD } from "../dropdown/locCatDD";
import { StarsToggle } from "../molecules/starsToggle";
import { HoursDD } from "../dropdown/hoursDD";
import { LocPicker } from "../organisms/locPicker";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LCategory, MapType } from "@/type/location";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Uploader } from "uploader"; // Installed by "react-uploader".

const uploader = Uploader({
  apiKey: process.env.NEXT_PUBLIC_BYTE_SCALE_KEY!,
});

export const EditLocation = () => {
  const { toast } = useToast();

  const params = useSearchParams();
  const hours: number[][] = [
    [0, 0],
    [20, 34],
    [20, 34],
    [20, 34],
    [20, 34],
    [20, 34],
    [0, 0],
  ];
  const account = useContext(AccountContext);
  const router = useRouter();
  const locEditor = useMemo(() => account?.locEditor, [account]);
  const loc = useMemo(() => locEditor?.loc, [locEditor]);
  const setLoc = useMemo(() => locEditor?.setLoc, [locEditor]);
  //const open = useMemo(() => locEditor?.open, [locEditor]);
  const open = useMemo(() => {
    return params.get("open") === "true";
  }, [params]);
  //const setOpen = useMemo(() => locEditor?.setOpen, [locEditor]);
  const setOpen = useMemo(() => {
    return (open: boolean) => {
      if (open) {
        //router.push({ search: "open=true" });
        window.history.pushState(null, "", "?open=true");
      } else {
        router.back();
      }
      locEditor?.setOpen(open);
    };
  }, [locEditor]);

  if (!loc || !setLoc || !open || !setOpen) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* <DialogTrigger>Edit</DialogTrigger> */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Spot</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-4">
          <Label className="min-w-20 text-right">Name</Label>
          <Input
            value={loc.name}
            onChange={(e) => {
              setLoc({
                ...loc,
                name: e.target.value,
              });
            }}
            //trigger when finish hit enter
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                const location = await fetch(`/api/location?name=${loc.name}`, {
                  method: "POST",
                }).then((res) => res.json());
                if (location) {
                  setLoc(location);
                }
              }
            }}
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="min-w-20 text-right">
            <LocCatDD
              lcat={loc.category}
              setLcat={(lc: LCategory) =>
                setLoc({
                  ...loc,
                  category: lc,
                })
              }
            />
          </div>
          <StarsToggle
            stars={loc.importance}
            setStars={(star: number) =>
              setLoc({
                ...loc,
                importance: star,
              })
            }
          />
        </div>
        <div className="flex items-center gap-4">
          <Label className="min-w-20 text-right">Hours</Label>
          <HoursDD
            hours={loc.hours!}
            setHours={(h: number[][]) =>
              setLoc({
                ...loc,
                hours: h,
              })
            }
          />
        </div>
        <LocPicker loc={loc} setLoc={setLoc} />
        <div className="flex items-center gap-4">
          <Label className="min-w-20 text-right">Map</Label>
          <ToggleGroup
            value={loc.map}
            onValueChange={(newMap: string) => {
              newMap !== "" &&
                setLoc({
                  ...loc,
                  map: newMap as MapType,
                });
            }}
            type="single"
          >
            <ToggleGroupItem value="google">Google</ToggleGroupItem>
            <ToggleGroupItem value="gaode">Gaode</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="flex  justify-center gap-2  sm:p-2 sm:pb-0  w-full self-center">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full "
          >
            {" "}
            <CarouselContent>
              {loc.imgs.map((_, index) => (
                <CarouselItem
                  key={index}
                  className="basis-1/3 sm:basis-1/3 md:basis-1/5 lg:basis-1/7"
                >
                  <Card>
                    <Image
                      src={loc.imgs[index]}
                      width={512}
                      height={0}
                      className="w-full h-[80px] object-cover sm:rounded-lg"
                      alt="thumbnail"
                      onClick={() => {
                        window.history.pushState(
                          null,
                          "",
                          `?openImage=true&loc=${loc.name}&imgId=${index}`
                        );
                      }}
                    />
                  </Card>
                </CarouselItem>
              ))}

              <CarouselItem className="basis-1/3 sm:basis-1/3 md:basis-1/5 lg:basis-1/7">
                <Card className="">
                  <Input
                    type="file"
                    title="Upload File"
                    onChange={async (e) => {
                      if (e.target.files) {
                        toast({
                          title: "Uploading image...",
                          description: "It may take a few seconds.",
                        });
                        const res = await uploader.uploadFile(
                          e.target.files[0]
                        );
                        loc.imgs.push(res.fileUrl);
                        setLoc(loc);
                      }
                    }}
                    className="h-[80px] text-transparent"
                  />
                </Card>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>
        <Button
          onClick={() => {
            setOpen(false);
            locEditor?.finish();
          }}
        >
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
};

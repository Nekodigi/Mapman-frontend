"use client";

import { useContext, useMemo, useRef, useState } from "react";

import { AccountContext } from "../context/account";
import { LocCatDD } from "../dropdown/locCatDD";
import { StarsToggle } from "../molecules/starsToggle";
import { HoursDD } from "../dropdown/hoursDD";
import { LocPicker } from "../organisms/locPicker";
import {
  createPlugins,
  Plate,
  PlateContent,
  PlatePlugin,
} from "@udecode/plate-common";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { ImageIcon, Search, Trash2, Upload } from "lucide-react";
import { DeleteAlert } from "../molecules/deleteAlert";
import { createAutoformatPlugin } from "@udecode/plate-autoformat";
import { PlateEditor } from "../molecules/plateEditor";
import { ScrollArea } from "../ui/scroll-area";

const uploader = Uploader({
  apiKey: process.env.NEXT_PUBLIC_BYTE_SCALE_KEY!,
});

export const EditLocation = () => {
  const { toast } = useToast();
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [lastFetchName, setLastFetchName] = useState<string>("");
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

  const fetchLocation = async () => {
    if (lastFetchName === loc.name) return;
    const location = await fetch(`/api/location?name=${loc.name}`, {
      method: "POST",
    }).then((res) => res.json());
    if (location) {
      setLoc(location);
      setLastFetchName(loc.name);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* <DialogTrigger>Edit</DialogTrigger> */}

      <DialogContent className="flex flex-col max-h-screen">
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
                fetchLocation();
              }
            }}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              fetchLocation();
            }}
          >
            <Search />
          </Button>
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
        <div className="flex  justify-center gap-2   w-full self-center">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full "
          >
            {" "}
            <CarouselContent>
              <CarouselItem className="basis-1/3 ">
                <Card
                  onClick={() => {
                    hiddenFileInput.current && hiddenFileInput.current.click();
                  }}
                  className=" flex flex-col gap-2 h-[80px] items-center justify-center"
                >
                  <Input
                    type="file"
                    title="Upload File"
                    ref={hiddenFileInput}
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
                    className="h-[80px] text-transparent hidden"
                  />
                  <ImageIcon className="size-8" />
                  <p className="text-[10px] ">Upload image</p>
                </Card>
              </CarouselItem>
              {loc.imgs.map((_, index) => (
                <CarouselItem key={index} className="relative basis-1/3 ">
                  <DeleteAlert
                    title="Delete Image"
                    description="Are you sure you want to delete this image?"
                    onConfirm={() => {
                      setLoc({
                        ...loc,
                        imgs: loc.imgs.filter((_, i) => i !== index),
                      });
                    }}
                  >
                    <Card>
                      <Image
                        src={loc.imgs[index]}
                        width={512}
                        height={0}
                        className="w-full h-[80px] object-cover rounded-lg"
                        alt="thumbnail"
                      />
                    </Card>
                  </DeleteAlert>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
        <LocPicker loc={loc} setLoc={setLoc} />
        <ScrollArea className="flex flex-col max-h-full min-h-0">
          <PlateEditor
            text={loc.note}
            setText={(text: string) => {
              setLoc({
                ...loc,
                note: text,
              });
            }}
          />
        </ScrollArea>
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

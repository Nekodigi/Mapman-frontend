"use client";

import { LCategoryIcon } from "@/components/atoms/lcategory";
import { Stars } from "@/components/atoms/stars";
import { AccountContext } from "@/components/context/account";
import { LocCtrlDD } from "@/components/dropdown/locCtrlDD";
import { LocationInfos } from "@/components/organisms/locationInfo";
import { Button } from "@/components/ui/button";
import { almostZero } from "@/utils/location";
import { ArrowLeft, Compass, ExternalLink, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UploadButton, UploadDropzone } from "react-uploader";

import { Uploader } from "uploader"; // Installed by "react-uploader".
import { useToast } from "@/components/ui/use-toast";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Location } from "@/type/location";

const uploader = Uploader({
  apiKey: process.env.NEXT_PUBLIC_BYTE_SCALE_KEY!,
});

export default function Page({ params }: { params: { name: string } }) {
  const account = useContext(AccountContext);
  const router = useRouter();
  const { toast } = useToast();

  const loc = useMemo(() => {
    const name = decodeURIComponent(params.name);
    let l = account?.locs.find((l) => l.name === name);
    l?.imgs.forEach((img, i) => {
      l.imgs[i] = img.replace("maxwidth=128", "maxwidth=512");
    });
    return l;
  }, [account?.locs, params.name]);
  const setLoc = useCallback(
    (loc: Location) => {
      account?.locsDispatch({
        type: "edit",
        index: account.locs.findIndex((l) => l.name === loc.name),
        location: loc,
      });
    },
    [account]
  );

  return (
    loc && (
      <div className="flex min-h-0 grow flex-col overflow-auto">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/map")}
          className="absolute m-4 z-10"
        >
          <ArrowLeft />
        </Button>

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
                  className="sm:basis-1/2 md:basis-1/3 lg:basis-1/5"
                >
                  <Card>
                    <Image
                      src={loc.imgs[index]}
                      width={512}
                      height={0}
                      className="w-full h-[160px] object-cover sm:rounded-lg"
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

              <CarouselItem className="sm:basis-1/2 md:basis-1/3 lg:basis-1/5">
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
                    className="h-[160px] text-transparent"
                  />
                </Card>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>
        <div className="p-4">
          <LocationInfos loc={loc} />
          <div className="flex justify-between items-center h-16">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/compass/${encodeURIComponent(loc.name)}`} passHref>
                <Compass />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link
                href={`https://www.google.com/search?q=${loc.name}`}
                target="_blank"
              >
                <Search />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link
                href={`https://www.google.com/maps/search/?api=1&query=${loc.name}&query_place_id=${loc.id}`}
                target="_blank"
              >
                <ExternalLink />
              </Link>
            </Button>
            <LocCtrlDD locName={loc.name} />
          </div>
          <p>{loc.note}</p>
        </div>
      </div>
    )
  );
}

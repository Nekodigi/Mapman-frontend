"use client";

import { LCategoryIcon } from "@/components/atoms/lcategory";
import { Stars } from "@/components/atoms/stars";
import { AccountContext } from "@/components/context/account";
import { LocCtrlDD } from "@/components/dropdown/locCtrlDD";
import { LocationInfos } from "@/components/organisms/locationInfo";
import { Button } from "@/components/ui/button";
import { almostZero } from "@/utils/location";
import { ArrowLeft, Compass } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
export default function Page({ params }: { params: { name: string } }) {
  const account = useContext(AccountContext);
  const router = useRouter();

  const loc = useMemo(() => {
    const name = decodeURIComponent(params.name);
    let l = account?.locs.find((l) => l.name === name);
    //console.log(l, name);
    //change maxwidth of image
    l?.imgs.forEach((img, i) => {
      l.imgs[i] = img.replace("maxwidth=128", "maxwidth=512");
    });
    console.log(l?.imgs[0]);
    return l;
  }, [account?.locs, params.name]);

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
                      height={160}
                      className="w-full h-[160px] object-cover sm:rounded-lg"
                      alt="thumbnail"
                    />
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          {/* <Image
            src={loc.imgs[0]}
            width={512}
            height={160}
            className="w-full h-[160px] object-cover sm:rounded-lg"
            alt="thumbnail"
          />
          <Image
            src={loc.imgs[1]}
            width={512}
            height={160}
            className="w-full h-[160px] object-cover hidden  sm:block sm:rounded-lg"
            alt="thumbnail"
          />
          <Image
            src={loc.imgs[2]}
            width={512}
            height={160}
            className="w-full h-[160px] object-cover hidden sm:block sm:rounded-lg"
            alt="thumbnail"
          /> */}
        </div>
        <div className="p-4">
          <LocationInfos loc={loc} />
          <div className="flex justify-between items-center h-16">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/compass/${encodeURIComponent(loc.name)}`} passHref>
                <Compass />
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

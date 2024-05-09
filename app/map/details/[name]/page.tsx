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
import { useRouter } from "next/navigation";
import { useContext, useMemo } from "react";

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
          onClick={() => router.back()}
          className="absolute m-4"
        >
          <ArrowLeft />
        </Button>
        <div className="flex justify-center">
          <Image
            src={loc.imgs[0]}
            width={512}
            height={160}
            className="w-full max-w-[512px] h-[160px] object-cover"
            alt="thumbnail"
          />
        </div>
        <div className="p-4">
          <LocationInfos loc={loc} />
          <div className="flex justify-between items-center h-16">
            <Button variant="ghost" size="icon">
              <Compass />
            </Button>
            <LocCtrlDD locName={loc.name} />
          </div>
          <p>{loc.note}</p>
        </div>
      </div>
    )
  );
}

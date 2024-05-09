import { EllipsisVertical, ExternalLink } from "lucide-react";
import Image from "next/image";
import { useContext } from "react";

import { AccountContext } from "../context/account";

import { LCategoryIcon } from "@/components/atoms/lcategory";
import { Stars } from "@/components/atoms/stars";
import { Button } from "@/components/ui/button";

import { Location } from "@/type/location";
import Link from "next/link";
import { almostZero } from "@/utils/location";
import { LocationInfos } from "../organisms/locationInfo";
import { LocCtrlDD } from "../dropdown/locCtrlDD";
import { useRouter } from "next/navigation";

type SpotProps = {
  loc: Location;
};
export const Spot = ({ loc }: SpotProps) => {
  const account = useContext(AccountContext);
  const router = useRouter();

  return (
    <div
      className="flex w-full items-center justify-between pr-4"
      onClick={() => {
        account?.setSearchOption((prev) => ({
          ...prev,
          viewCenter: loc,
        }));
        router.push(`/map/details/${encodeURIComponent(loc.name)}`);
      }}
    >
      <div className="flex h-[72px] gap-2 px-2 py-1">
        <Image
          src={loc.imgs[0]}
          width={128}
          height={128}
          className="w-16 rounded object-cover"
          alt="thumbnail"
        />
        <LocationInfos loc={loc} />
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link
            href={`https://www.google.com/maps/search/?api=1&query=${loc.name}&query_place_id=${loc.id}`}
            target="_blank"
          >
            <ExternalLink className="size-4" />
          </Link>
        </Button>

        <LocCtrlDD locName={loc.name} />
      </div>
    </div>
  );
};

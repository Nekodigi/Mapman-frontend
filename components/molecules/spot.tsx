import { Compass, ExternalLink } from "lucide-react";
import Image from "next/image";
import { useContext, useMemo } from "react";

import { AccountContext } from "../context/account";

import { Button } from "@/components/ui/button";

import { Location } from "@/type/location";
import Link from "next/link";
import { filter } from "@/utils/location";
import { LocationInfos } from "../organisms/locationInfo";
import { LocCtrlDD } from "../dropdown/locCtrlDD";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type SpotProps = {
  loc: Location;
  passive?: boolean;
  className?: string;
};
export const Spot = ({ loc, passive, className }: SpotProps) => {
  const account = useContext(AccountContext);
  const router = useRouter();

  const visible = useMemo(() => {
    if (passive) return true;
    if (!account?.searchOption) return true;
    return filter(loc, account.searchOption);
  }, [account?.searchOption, loc.hours]);

  return (
    visible && (
      <div className={cn("flex  items-center justify-between pr-4", className)}>
        <div
          className="flex h-[72px] w-full  gap-2 px-2 py-1 "
          onClick={() => {
            account?.setSearchOption((prev) => ({
              ...prev,
              viewCenter: loc,
            }));
            router.push(`/map/details/${encodeURIComponent(loc.name)}`);
          }}
        >
          <Image
            src={loc.imgs[0]}
            width={128}
            height={128}
            className="w-16 min-w-16 rounded object-cover"
            alt="thumbnail"
          />
          <LocationInfos loc={loc} />
        </div>
        {!passive && (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/compass/${encodeURIComponent(loc.name)}`}>
                <Compass className="size-4" />
              </Link>
            </Button>
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
        )}
      </div>
    )
  );
};

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
import { FilePreview } from "./filePreview";

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
      <div
        className={cn(
          "flex w-full items-center justify-between pr-4",
          className
        )}
      >
        <div
          className="flex h-[72px] min-w-0 w-full  gap-2 px-2 py-1 "
          onClick={() => {
            router.push(`/map/details/${encodeURIComponent(loc.name)}`);
            const f = async () => {
              account?.setSearchOption((prev) => ({
                ...prev,
                viewCenter: loc,
              }));
            };
            f();
          }}
        >
          <div className="min-w-16 w-16 h-16">
            <FilePreview url={loc.imgs[0] || "icons/no-image.png"} small />
          </div>
          <LocationInfos loc={loc} />
        </div>
        {!passive && (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/compass/${encodeURIComponent(loc.name)}`}>
                <Compass className="size-4" />
              </Link>
            </Button>

            <LocCtrlDD loc={loc} />
          </div>
        )}
      </div>
    )
  );
};

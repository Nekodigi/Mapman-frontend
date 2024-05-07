import { EllipsisVertical, ExternalLink } from "lucide-react";
import Image from "next/image";
import { useContext } from "react";

import { AccountContext } from "../context/account";

import { LCategoryIcon } from "@/components/atoms/lcategory";
import { Stars } from "@/components/atoms/stars";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Location } from "@/type/location";
import Link from "next/link";

type SpotProps = {
  loc: Location;
};
export const Spot = ({ loc }: SpotProps) => {
  const account = useContext(AccountContext);

  return (
    <div className="flex w-full items-center justify-between pr-4">
      <div className="flex h-[72px] gap-2 px-2 py-1">
        <Image
          src={loc.imgs[0]}
          width={128}
          height={128}
          className="w-16 rounded object-cover"
          alt="thumbnail"
        />
        <div className="flex flex-col gap-1">
          <h3 className="font-medium">{loc.name}</h3>
          <div className="flex items-center gap-2">
            <LCategoryIcon category={loc.category} />
            <Stars stars={loc.importance} />
            {loc.vars?.distance !== undefined && loc.vars.distance !== 0 && <p className="text-xs">{loc.vars.distance.toPrecision(1)}km</p>}
            {/* <p className="text-xs">1.2km</p>
            <p className="text-xs">10min</p> */}
          </div>
          <div className="flex items-center gap-2">
            <p className="text-xs">10:00~23:00</p>
            <p className="text-xs">{loc.price}</p>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`https://www.google.com/maps/search/?api=1&query=${loc.name}&query_place_id=${loc.id}`} target="_blank" >
          <ExternalLink className="size-4" />
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <EllipsisVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="">
            <DropdownMenuItem>Compass</DropdownMenuItem>
            <DropdownMenuItem>Archive</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                const id = account?.locs.findIndex((l) => l.name === loc.name)!;
                account?.locEditor.setOpen(true);
                account?.locEditor.setId(id);
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-500" onClick={
              () => {
                const id = account?.locs.findIndex((l) => l.name === loc.name)!;
                account?.locsDispatch({ type: 'delete', index: id });
              }
            }>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

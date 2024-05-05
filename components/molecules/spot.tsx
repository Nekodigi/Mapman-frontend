import { Button } from "@/components/ui/button";
import {
  Plus,
  Star,
  Landmark,
  TreePine,
  Flag,
  ShoppingBag,
  Utensils,
  Circle,
  EllipsisVertical,
  ExternalLink,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { LCategory, Location } from "@/type/location";
import { useContext } from "react";
import { AccountContext } from "@/components/context/account";
import { LCategoryIcon } from "@/components/atoms/lcategory";
import { Stars } from "@/components/atoms/stars";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SpotProps = {
  loc: Location;
};
export const Spot = ({ loc }: SpotProps) => {
  return (
    <div className="flex items-center justify-between w-full pr-4">
      <div className="flex p-2 h-18 gap-2">
        <Image
          src={loc.imgs[0]}
          width={64}
          height={64}
          className="object-cover rounded"
          alt="thumbnail"
        />
        <div className="flex flex-col gap-1">
          <h3 className="font-medium">{loc.name}</h3>
          <div className="flex gap-2 items-center">
            <LCategoryIcon category={loc.category} />
            <Stars stars={loc.importance} />
            {/* <p className="text-xs">1.2km</p>
            <p className="text-xs">10min</p> */}
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-xs">10:00~23:00</p>
            <p className="text-xs">{loc.price}</p>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="icon">
          <ExternalLink className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <EllipsisVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="">
            <DropdownMenuItem>Compass</DropdownMenuItem>
            <DropdownMenuItem>Archive</DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

import {
  Circle,
  CircleDashed,
  Flag,
  Landmark,
  ShoppingBag,
  TreePine,
  Utensils,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LCategory } from "@/type/location";
import { cn } from "@/lib/utils";

type LocCatDDProps = {
  lcat: LCategory;
  setLcat: (lcat: LCategory) => void;
  allowAll?: boolean;
  shadow?: boolean;
};
export const LocCatDD = ({
  lcat,
  setLcat,
  allowAll,
  shadow,
}: LocCatDDProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            `${shadow && "shadow-lg"}`,
            lcat !== "all" &&
              allowAll &&
              "bg-blue-500 hover:bg-blue-600 text-white hover:text-white"
          )}
        >
          {/* <Landmark className="h-4 w-4" /> */}
          {/* display ptype with icon */}
          <div className="flex gap-2 items-center">
            {lcat === "museum" ? (
              <Landmark className="size-4" />
            ) : lcat === "park" ? (
              <TreePine className="size-4" />
            ) : lcat === "landmark" ? (
              <Flag className="size-4" />
            ) : lcat === "shop" ? (
              <ShoppingBag className="size-4" />
            ) : lcat === "restaurant" ? (
              <Utensils className="size-4" />
            ) : (
              <Circle className="size-4" />
            )}
            {allowAll && lcat.charAt(0).toUpperCase() + lcat.slice(1)}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="">
        <DropdownMenuLabel>Category</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={lcat} onValueChange={setLcat as any}>
          {allowAll && (
            <DropdownMenuRadioItem value="all">
              <Circle className="mr-2 size-4" /> All
            </DropdownMenuRadioItem>
          )}
          <DropdownMenuRadioItem value="museum">
            <Landmark className="mr-2 size-4" /> Museum
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="park">
            <TreePine className="mr-2 size-4" /> Park
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="landmark">
            <Flag className="mr-2 size-4" /> Landmark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="shop">
            <ShoppingBag className="mr-2 size-4" /> Shop
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="restaurant">
            <Utensils className="mr-2 size-4" /> Restaurant
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="other">
            <CircleDashed className="mr-2 size-4" /> Other
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

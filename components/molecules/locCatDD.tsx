import {
  Circle,
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

type LocCatDDProps = {
  lcat: LCategory;
  setLcat: (lcat: LCategory) => void;
  allowAll?: boolean;
};
export const LocCatDD = ({ lcat, setLcat, allowAll }: LocCatDDProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {/* <Landmark className="h-4 w-4" /> */}
          {/* display ptype with icon */}
          {lcat === "museum" ? (
            <Landmark className="h-4 w-4" />
          ) : lcat === "park" ? (
            <TreePine className="h-4 w-4" />
          ) : lcat === "landmark" ? (
            <Flag className="h-4 w-4" />
          ) : lcat === "shop" ? (
            <ShoppingBag className="h-4 w-4" />
          ) : lcat === "restaurant" ? (
            <Utensils className="h-4 w-4" />
          ) : (
            <Circle className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="">
        <DropdownMenuLabel>Category</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={lcat} onValueChange={setLcat as any}>
          {allowAll && (
            <DropdownMenuRadioItem value="">
              <Circle className="mr-2 h-4 w-4" /> All
            </DropdownMenuRadioItem>
          )}
          <DropdownMenuRadioItem value="museum">
            <Landmark className="mr-2 h-4 w-4" /> Museum
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="park">
            <TreePine className="mr-2 h-4 w-4" /> Park
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="landmark">
            <Flag className="mr-2 h-4 w-4" /> Landmark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="shop">
            <ShoppingBag className="mr-2 h-4 w-4" /> Shop
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="restaurant">
            <Utensils className="mr-2 h-4 w-4" /> Restaurant
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

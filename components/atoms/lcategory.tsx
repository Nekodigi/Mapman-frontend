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
import { AccountContext } from "../context/account";

type LCategoryIconProps = {
  category: LCategory;
};
export const LCategoryIcon = ({ category }: LCategoryIconProps) => {
  const cname = "w-3 h-3";
  switch (category) {
    case "museum":
      return <Landmark className={cname} />;
    case "park":
      return <TreePine className={cname} />;
    case "landmark":
      return <Flag className={cname} />;
    case "shop":
      return <ShoppingBag className={cname} />;
    case "restaurant":
      return <Utensils className={cname} />;
    default:
      return <Circle className={cname} />;
  }
};

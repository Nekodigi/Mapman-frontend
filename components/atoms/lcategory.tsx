import {
  Landmark,
  TreePine,
  Flag,
  ShoppingBag,
  Utensils,
  Circle,
} from "lucide-react";


import { LCategory } from "@/type/location";

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

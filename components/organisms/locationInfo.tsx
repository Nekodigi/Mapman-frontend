import { Location } from "@/type/location";
import { LCategoryIcon } from "../atoms/lcategory";
import { Stars } from "@/components/atoms/stars";
import { almostZero } from "@/utils/location";

type LocationInfosProps = {
  loc: Location;
};
export const LocationInfos = ({ loc }: LocationInfosProps) => {
  return (
    <div className="flex flex-col gap-1 min-w-0 w-full">
      <h3 className="font-medium truncate">{loc.name}</h3>
      <div className="flex items-center gap-2">
        <LCategoryIcon category={loc.category} />
        <Stars stars={loc.importance} />
        {loc.vars?.distance !== undefined && (
          <p className="text-xs">
            {almostZero(loc.vars?.distance)
              ? "Origin"
              : `${loc.vars.distance.toFixed(1)}km`}
          </p>
        )}
        {/* <p className="text-xs">1.2km</p>
            <p className="text-xs">10min</p> */}
      </div>
      <div className="flex items-center gap-2">
        <p className="text-xs">10:00~23:00</p>
        <p className="text-xs">{loc.price}</p>
      </div>
    </div>
  );
};

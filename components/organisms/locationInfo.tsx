import { Location } from "@/type/location";
import { LCategoryIcon } from "../atoms/lcategory";
import { Stars } from "@/components/atoms/stars";
import { almostZero } from "@/utils/location";
import { renderHourRange } from "@/utils/date";
import { AccountContext } from "../context/account";
import { useContext, useMemo } from "react";
import { WeekLUT } from "@/type/date";

type LocationInfosProps = {
  loc: Location;
};
export const LocationInfos = ({ loc }: LocationInfosProps) => {
  const account = useContext(AccountContext);
  const week = useMemo(() => {
    const w = account?.searchOption.hours.week;
    if (w === undefined) return new Date().getDay();
    return w;
  }, [account?.searchOption.hours.week]);

  return (
    <div className="flex min-w-0 flex-col gap-1">
      <h3 className="truncate font-medium">{loc.name}</h3>
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
        <p className="text-xs">
          {week !== new Date().getDay() ? `${WeekLUT[week]} ` : ""}
          {loc.hours && renderHourRange(loc.hours[week])}
        </p>
        <p className="text-xs">{loc.price}</p>
      </div>
    </div>
  );
};

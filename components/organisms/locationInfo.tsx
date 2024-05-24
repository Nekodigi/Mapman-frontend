import { Location } from "@/type/location";
import { LCategoryIcon } from "../atoms/lcategory";
import { Stars } from "@/components/atoms/stars";
import { almostZero } from "@/utils/location";
import { renderFilterHourRange, renderHourRange } from "@/utils/date";
import { AccountContext } from "../context/account";
import { useContext, useMemo } from "react";
import { WeekLUT } from "@/type/date";
import { cn } from "@/lib/utils";

type LocationInfosProps = {
  loc: Location;
  allHours?: boolean;
};
export const LocationInfos = ({ loc, allHours }: LocationInfosProps) => {
  const account = useContext(AccountContext);
  const week = useMemo(() => {
    const w = account?.searchOption.hours.week;
    if (w === undefined) return new Date().getDay();
    return w;
  }, [account?.searchOption.hours.week]);

  return (
    <div className="flex min-w-0 flex-col gap-1">
      <h3 className="truncate font-medium min-w-0">{loc.name}</h3>
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
          {account &&
            loc.hours &&
            (allHours ? (
              <div className="flex gap-x-8 gap-y-1 flex-wrap">
                {loc.hours.map((h, i) => {
                  const filter = account.searchOption.hours;
                  let week = new Date().getDay();
                  if (filter.week !== undefined && filter.type === "select")
                    week = filter.week;
                  return (
                    <div
                      key={i}
                      className={cn(
                        "flex gap-1 min-w-[120px]",
                        i === week
                          ? "text-primary font-semibold"
                          : "text-muted-foreground"
                      )}
                    >
                      <p className="w-8">{WeekLUT[i]}</p>
                      {renderHourRange(h)}
                    </div>
                  );
                })}
              </div>
            ) : (
              renderFilterHourRange(account.searchOption.hours, loc.hours)
            ))}
        </p>
        <p className="text-xs">{loc.price}</p>
      </div>
    </div>
  );
};

import { Clock } from "lucide-react";
import { useMemo, useState } from "react";

import { WeekToggle } from "../molecules/weekToggle";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { Week, WeekLUT } from "@/type/date";
import { renderHourRange, renderHours } from "@/utils/date";
import { capFirst } from "@/utils/str";

type HoursDDProps = {
  hours: number[][];
  setHours: (hours: number[][]) => void;
};
export const HoursDD = ({ hours, setHours }: HoursDDProps) => {
  const [week, setWeek] = useState<Week | undefined | "">();
  // const [type, setType] = useState<"now" | "anytime" | "select">("now");

  const wid = useMemo(() => {
    return week ? WeekLUT.indexOf(week) : new Date().getDay();
  }, [week]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Clock className="mr-2 size-4" />
          {renderHours(hours)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px]">
        <div className="flex justify-between">
          <DropdownMenuLabel>Hours</DropdownMenuLabel>
        </div>

        <DropdownMenuSeparator />
        {/* <ToggleGroup value={type} onValueChange={setType as any} type="single">
          <ToggleGroupItem value="now">Now</ToggleGroupItem>
          <ToggleGroupItem value="anytime">Anytime</ToggleGroupItem>
          <ToggleGroupItem value="select">Select</ToggleGroupItem>
        </ToggleGroup> */}
        <WeekToggle week={week as Week} setWeek={setWeek} />
        <Slider
          className=" px-4 pb-4 pt-2"
          value={hours[wid]}
          max={48}
          step={1}
          onValueChange={(value) => {
            const newHours = [...hours];
            if (week === undefined || week === "") {
              newHours.forEach((_, i) => {
                newHours[i] = value;
              });
            } else {
              newHours[wid] = value;
            }
            setHours(newHours);
          }}
        />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex justify-between">
            <DropdownMenuLabel>{capFirst(WeekLUT[i])}</DropdownMenuLabel>
            <DropdownMenuLabel>{renderHourRange(hours[i])}</DropdownMenuLabel>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

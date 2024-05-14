import { Clock } from "lucide-react";
import { useState } from "react";

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
import { WeekLUT } from "@/type/date";
import { renderHourRange, renderHours } from "@/utils/date";

type HoursDDProps = {
  hours: number[][];
  setHours: (hours: number[][]) => void;
};
export const HoursDD = ({ hours, setHours }: HoursDDProps) => {
  const [week, setWeek] = useState<number>(new Date().getDay());
  // const [type, setType] = useState<"now" | "anytime" | "select">("now");

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
        <WeekToggle week={week} setWeek={setWeek} />
        <Slider
          className=" px-4 pb-4 pt-2"
          value={hours[week]}
          max={48}
          step={1}
          onValueChange={(value) => {
            const newHours = [...hours];
            if (week === undefined) {
              newHours.forEach((_, i) => {
                newHours[i] = value;
              });
            } else {
              newHours[week] = value;
            }
            setHours(newHours);
          }}
        />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex justify-between">
            <DropdownMenuLabel>{WeekLUT[i]}</DropdownMenuLabel>
            <DropdownMenuLabel>{renderHourRange(hours[i])}</DropdownMenuLabel>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

import {
  Clock,
} from "lucide-react";

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
import { Week } from "@/type/date";


const capFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

type WeekHourDDProps = {
  week: Week | undefined;
  setWeek: (week: Week | undefined) => void;
  hour: number[];
  setHour: (hour: number[]) => void;
};
export const WeekHourDD = ({
  week,
  setWeek,
  hour,
  setHour,
}: WeekHourDDProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Clock className="mr-2 h-4 w-4" />
          {week ? capFirst(week) : "Today"} {Math.floor(hour[0] / 2)}:
          {hour[0] % 2 === 0 ? "00" : "30"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px]">
        <div className="flex justify-between">
          <DropdownMenuLabel>Open on</DropdownMenuLabel>
          <DropdownMenuLabel>
            {week ? capFirst(week) : "Today"} {Math.floor(hour[0] / 2)}:
            {hour[0] % 2 === 0 ? "00" : "30"}
          </DropdownMenuLabel>
        </div>

        <DropdownMenuSeparator />
        <WeekToggle week={week} setWeek={setWeek} />
        <Slider
          className=" px-4 pb-4 pt-2"
          value={hour}
          max={48}
          step={1}
          onValueChange={setHour}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

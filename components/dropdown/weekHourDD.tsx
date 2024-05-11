import { Clock } from "lucide-react";

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

type WeekHourDDProps = {
  week: number;
  setWeek: (week: number) => void;
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
          <Clock className="mr-2 size-4" />
          {week ? WeekLUT[week] : "Today"} {Math.floor(hour[0] / 2)}:
          {hour[0] % 2 === 0 ? "00" : "30"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px]">
        <div className="flex justify-between">
          <DropdownMenuLabel>Open on</DropdownMenuLabel>
          <DropdownMenuLabel>
            {week ? WeekLUT[week] : "Today"} {Math.floor(hour[0] / 2)}:
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

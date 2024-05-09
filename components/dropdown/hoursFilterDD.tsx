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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Week } from "@/type/date";
import { renderHour } from "@/utils/date";
import { capFirst } from "@/utils/str";

export const HoursFilterDD = () => {
  const [time, setTime] = useState<number>(24);
  const [week, setWeek] = useState<Week>("mon");
  const [type, setType] = useState<"now" | "anytime" | "select">("now");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="shadow-lg">
          <Clock className="mr-2 size-4" />
          {type === "now" && "Now"}
          {type === "anytime" && "Anytime"}
          {type === "select" && `${capFirst(week)} ${renderHour(time)}`}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px]">
        <div className="flex justify-between">
          <DropdownMenuLabel>Hours</DropdownMenuLabel>
        </div>

        <DropdownMenuSeparator />
        <ToggleGroup value={type} onValueChange={setType as any} type="single">
          <ToggleGroupItem value="now">Now</ToggleGroupItem>
          <ToggleGroupItem value="anytime">Anytime</ToggleGroupItem>
          <ToggleGroupItem value="select">Select</ToggleGroupItem>
        </ToggleGroup>
        {type === "select" && (
          <div>
            <WeekToggle
              week={week as Week}
              setWeek={(value) => {
                value !== undefined && setWeek(value);
              }}
            />
            <Slider
              className=" px-4 pb-4 pt-2"
              value={[time]}
              max={48}
              step={1}
              onValueChange={(value) => {
                setTime(value[0]);
              }}
            />
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

import { Clock } from "lucide-react";
import { useContext, useMemo, useState } from "react";

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
import { renderHour } from "@/utils/date";
import { WeekLUT } from "@/type/date";
import { AccountContext } from "../context/account";

export const HoursFilterDD = () => {
  const account = useContext(AccountContext);
  const week = useMemo(() => {
    const w = account?.searchOption.hours.week;
    if (w === undefined) return new Date().getDay();
    return w;
  }, [account?.searchOption.hours.week]);
  const time = useMemo(() => {
    const h = account?.searchOption.hours.time;
    if (h === undefined) return new Date().getHours();
    return h;
  }, [account?.searchOption.hours.time]);
  const type = account?.searchOption.hours.type;
  const setTime = (value: number) => {
    account?.setSearchOption((prev) => ({
      ...prev,
      hours: { ...prev.hours, time: value },
    }));
  };
  const setWeek = (value: number) => {
    account?.setSearchOption((prev) => ({
      ...prev,
      hours: { ...prev.hours, week: value },
    }));
  };
  const setType = (value: "now" | "anytime" | "select") => {
    account?.setSearchOption((prev) => ({
      ...prev,
      hours: { ...prev.hours, type: value },
    }));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="shadow-lg">
          <Clock className="mr-2 size-4" />
          {type === "now" && "Now"}
          {type === "anytime" && "Anytime"}
          {type === "select" && `${WeekLUT[week]} ${renderHour(time)}`}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px]">
        <div className="flex justify-between">
          <DropdownMenuLabel>Hours</DropdownMenuLabel>
        </div>

        <DropdownMenuSeparator />
        {type && (
          <ToggleGroup
            value={type}
            onValueChange={(v) =>
              v && setType(v as "now" | "anytime" | "select")
            }
            type="single"
          >
            <ToggleGroupItem value="now">Now</ToggleGroupItem>
            <ToggleGroupItem value="anytime">Anytime</ToggleGroupItem>
            <ToggleGroupItem value="select">Select</ToggleGroupItem>
          </ToggleGroup>
        )}
        {type === "select" && (
          <div>
            <WeekToggle
              week={week}
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

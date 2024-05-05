import { Week } from "@/type/date";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type WeekToggleProps = {
  week: Week | undefined;
  setWeek: (week: Week | undefined) => void;
};
export const WeekToggle = ({ week, setWeek }: WeekToggleProps) => {
  return (
    <ToggleGroup value={week} onValueChange={setWeek as any} type="single">
      <ToggleGroupItem value="sun">S</ToggleGroupItem>
      <ToggleGroupItem value="mon">M</ToggleGroupItem>
      <ToggleGroupItem value="tue">T</ToggleGroupItem>
      <ToggleGroupItem value="wed">W</ToggleGroupItem>
      <ToggleGroupItem value="thu">T</ToggleGroupItem>
      <ToggleGroupItem value="fri">F</ToggleGroupItem>
      <ToggleGroupItem value="sat">S</ToggleGroupItem>
    </ToggleGroup>
  );
};

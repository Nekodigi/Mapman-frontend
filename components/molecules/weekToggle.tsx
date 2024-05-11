import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type WeekToggleProps = {
  week: number;
  setWeek: (week: number) => void;
};
export const WeekToggle = ({ week, setWeek }: WeekToggleProps) => {
  return (
    <ToggleGroup
      value={week?.toString()}
      onValueChange={(v) => setWeek(parseInt(v))}
      type="single"
    >
      <ToggleGroupItem value="0">S</ToggleGroupItem>
      <ToggleGroupItem value="1">M</ToggleGroupItem>
      <ToggleGroupItem value="2">T</ToggleGroupItem>
      <ToggleGroupItem value="3">W</ToggleGroupItem>
      <ToggleGroupItem value="4">T</ToggleGroupItem>
      <ToggleGroupItem value="5">F</ToggleGroupItem>
      <ToggleGroupItem value="6">S</ToggleGroupItem>
    </ToggleGroup>
  );
};

import { Stars } from "@/components/atoms/stars";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type StarsToggleProps = {
  stars: number;
  setStars: (stars: number) => void;
};
export const StarsToggle = ({ stars, setStars }: StarsToggleProps) => {
  return (
    <ToggleGroup
      value={stars.toString()}
      onValueChange={(value) => {
        value !== "" && setStars(parseInt(value, 10));
      }}
      type="single"
    >
      {/* <ToggleGroupItem value="0">
        <Stars stars={0} />
      </ToggleGroupItem> */}
      <ToggleGroupItem value="1">
        <Stars stars={1} />
      </ToggleGroupItem>
      <ToggleGroupItem value="2">
        <Stars stars={2} />
      </ToggleGroupItem>
      <ToggleGroupItem value="3">
        <Stars stars={3} />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

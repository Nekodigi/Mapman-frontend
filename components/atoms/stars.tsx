import { Star } from "lucide-react";

type StarsProps = {
  stars: number;
};
export const Stars = ({ stars }: StarsProps) => {
  return (
    <div className="flex">
      {[...Array(stars)].map((_, i) => (
        <Star key={i} fill="#eab308" strokeWidth={0} className="w-3 h-3" />
      ))}
    </div>
  );
};

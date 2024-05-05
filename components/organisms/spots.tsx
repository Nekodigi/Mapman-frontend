import {
  Plus,
} from "lucide-react";
import { useContext } from "react";

import { AccountContext } from "../context/account";

import { Spot } from "@/components/molecules/spot";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const Spots = () => {
  const account = useContext(AccountContext);

  return (
    <div className="flex flex-col grow min-h-0">
      <div className="flex pl-3 items-center justify-between min-h-12">
        <h2 className="font-medium text-base">Nearby Spots</h2>
        <Button variant="ghost" size="icon">
          <Plus />
        </Button>
      </div>
      <Separator />
      <div className="flex flex-col min-h-0 overflow-scroll">
        {account?.locs.map((loc) => (
          <Spot key={loc.name} loc={loc} />
        ))}
      </div>
    </div>
  );
};

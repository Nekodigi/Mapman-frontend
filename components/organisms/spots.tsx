import { Plus } from "lucide-react";
import { useContext, useMemo } from "react";

import { AccountContext } from "../context/account";

import { Spot } from "@/components/molecules/spot";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "next/navigation";
import { ScrollArea } from "../ui/scroll-area";

export const Spots = () => {
  const account = useContext(AccountContext);
  const params = useSearchParams();

  //sort by distance when center location is available
  const locs = useMemo(() => {
    const center = account?.searchOption.center;
    if (center === undefined) {
      return account?.locs;
    } else {
      //sort by distance
      return account?.locs.sort((a, b) => {
        if (a.vars?.distance === undefined || b.vars?.distance === undefined) {
          return 0;
        }
        return a.vars?.distance - b.vars?.distance;
      });
    }
  }, [account?.locs]);

  return (
    <div className="flex h-full min-h-0 grow flex-col">
      <div className="flex min-h-12 items-center justify-between pl-3">
        <h2 className="text-base font-medium">Nearby Spots</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            //change url without refresh just add query
            window.history.pushState(null, "", "?open=true");

            account?.locEditor.setOpen(true);
            account?.locEditor.setId(-1);
          }}
        >
          <Plus />
        </Button>
      </div>
      <Separator />
      <ScrollArea>
        {locs?.map((loc) => <Spot key={loc.name} loc={loc} />)}
      </ScrollArea>
    </div>
  );
};

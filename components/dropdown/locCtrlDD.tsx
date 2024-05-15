import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import { useContext } from "react";
import { AccountContext } from "../context/account";
import { useRouter } from "next/navigation";

type LocCtrlDDProps = {
  locName: string;
};
export const LocCtrlDD = ({ locName }: LocCtrlDDProps) => {
  const account = useContext(AccountContext);
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <EllipsisVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="">
        <DropdownMenuItem
          onClick={() => {
            const id = account?.locs.findIndex((l) => l.name === locName)!;
            account?.locEditor.setOpen(true);
            account?.locEditor.setId(id);
          }}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem>Archive</DropdownMenuItem>

        <DropdownMenuItem
          className="text-red-500"
          onClick={() => {
            const id = account?.locs.findIndex((l) => l.name === locName)!;
            account?.locsDispatch({ type: "delete", index: id });
            router.push("/map");
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

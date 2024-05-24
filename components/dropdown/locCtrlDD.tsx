import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import { useContext, useState } from "react";
import { AccountContext } from "../context/account";
import { useRouter } from "next/navigation";
import { DeleteAlert } from "../molecules/deleteAlert";

type LocCtrlDDProps = {
  locName: string;
};
export const LocCtrlDD = ({ locName }: LocCtrlDDProps) => {
  const account = useContext(AccountContext);
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <div>
      <DeleteAlert
        open={open}
        setOpen={setOpen}
        title="Delete location"
        description="Are you sure?"
        onConfirm={() => {
          account?.locsDispatch({
            type: "delete",
            location: { name: locName } as any as Location,
          });
          router.push("/map");
        }}
      />
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
              account?.locEditor.invoke(id, "");
            }}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem>Archive</DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-500"
            onClick={() => {
              setOpen(true);
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DeleteIcon,
  Download,
  Plus,
  Settings,
  Trash2,
  Upload,
} from "lucide-react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useContext, useMemo, useRef, useState } from "react";
import { AccountContext } from "../context/account";
import { Profile } from "@/type/profile";
import { Account } from "@/type/account";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteAlert } from "../molecules/deleteAlert";

export const ProfileMenu = () => {
  const account = useContext(AccountContext);
  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const profiles = useMemo(
    () => account?.account.profiles.map((profile) => profile.name),
    [account]
  );

  const download = () => {
    if (!account) return;
    const profile = account.account.profiles.find(
      (p) => p.name === account.account.currentProfile
    );
    const data = JSON.stringify(profile, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mapman.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    //read file as json
    const reader = new FileReader();
    const raw = reader.readAsText(file);
    reader.onload = (e) => {
      if (!e.target?.result) return;
      const res = JSON.parse(e.target.result as string) as Profile;
      account?.setAccount((prev) => {
        const newAccount = { ...prev };
        if (prev.profiles.find((p) => p.name === res.name)) return newAccount;
        newAccount.profiles.push(res);
        newAccount.currentProfile = res.name;
        return newAccount;
      });
    };
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Input
          type="file"
          title="Upload File"
          ref={hiddenFileInput}
          onChange={upload}
          className="hidden"
        />
        <Label className="min-w-20 text-right">Profile</Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {account?.account.currentProfile || "select profile"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Profile</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={account?.account.currentProfile}
              onValueChange={(v) => {
                router.push("/map");
                account?.setAccount((prev) => {
                  const newAccount = { ...prev };
                  newAccount.currentProfile = v;
                  return newAccount;
                });
              }}
            >
              {profiles?.map((profile) => (
                <DropdownMenuRadioItem value={profile} key={profile}>
                  {profile}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex gap-2">
        <CreateDD open={openCreate} setOpen={setOpenCreate} />
        <DeleteAlert
          open={openDelete}
          setOpen={setOpenDelete}
          title={`Delete "${account?.account.currentProfile}" Profile`}
          description="This action cannot be undone. Are you sure?"
          onConfirm={() => {
            account?.setAccount((prev) => {
              const newAccount = { ...prev };
              const index = newAccount.profiles.findIndex(
                (p) => p.name === account?.account.currentProfile
              );
              if (index === -1) return newAccount;
              newAccount.profiles.splice(index, 1);
              newAccount.currentProfile = newAccount.profiles[0]?.name;
              return newAccount;
            });
          }}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex gap-2" onClick={download}>
              <Download className="size-4" />
              Export
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex gap-2"
              onClick={() => {
                hiddenFileInput.current && hiddenFileInput.current.click();
              }}
            >
              <Upload className="size-4" />
              Import
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex gap-2"
              onClick={() => {
                setOpenCreate(true);
              }}
            >
              <Plus className="size-4" />
              Add
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex gap-2"
              onClick={() => {
                setOpenDelete(true);
              }}
            >
              <Trash2 className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

type CreateDDProps = {
  open: boolean;
  setOpen: (v: boolean) => void;
};
const CreateDD = ({ open, setOpen }: CreateDDProps) => {
  const account = useContext(AccountContext);
  const [name, setName] = useState("");
  const router = useRouter();
  const onCreate = () => {
    //check dupe and empty
    if (name === "") return;
    if (account?.account.profiles.find((p) => p.name === name)) return;

    setOpen(false);
    const profile: Profile = {
      name: name,
      locations: [],
      documents: [],
      cover: "",
      status: {
        checkSum: "0",
        isArchived: false,
        isDeleted: false,
        createdAt: new Date(),
      },
      map: "google",
    };
    // if exist
    if (account?.account.profiles.find((p) => p.name === name)) return;
    account?.setAccount((prev) => {
      const newAccount: Account = {
        ...prev,
        currentProfile: profile.name,
        profiles: [...prev.profiles, profile],
      };
      return newAccount;
    });
    router.push("/map");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Plus className="size-4" />
        </Button>
      </DialogTrigger> */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Profile</DialogTitle>
        </DialogHeader>
        <Label>Name</Label>
        <Input value={name} onChange={(v) => setName(v.target.value)} />
        <Button
          onClick={() => {
            onCreate();
          }}
        >
          Create
        </Button>
      </DialogContent>
    </Dialog>
  );
};

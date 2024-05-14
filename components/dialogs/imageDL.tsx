import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useContext, useMemo } from "react";

import { AccountContext } from "../context/account";
import { Button } from "../ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter, useSearchParams } from "next/navigation";

export const ImageDL = () => {
  const account = useContext(AccountContext);
  const { data: session, status } = useSession();
  const params = useSearchParams();
  const router = useRouter();
  const profiles = useMemo(
    () => account?.account.profiles.map((profile) => profile.name),
    [account]
  );

  const imgInfo = useMemo(() => {
    if (!account?.locs) return { locId: -1, imgId: -1 };
    //find index of loc
    const locId = account.locs.findIndex(
      (loc) => loc.name === decodeURIComponent(params.get("loc") || "")
    );
    const imgId = parseInt(params.get("imgId") || "-1", 10);
    //to int
    return { locId, imgId };
  }, [account?.locs, params]);

  const open = useMemo(() => {
    return (
      params.get("openImage") === "true" &&
      imgInfo.locId !== undefined &&
      imgInfo.imgId !== -1 &&
      account?.locs !== undefined
    );
  }, [account?.locs, imgInfo.imgId, imgInfo.locId, params]);

  const img = useMemo(() => {
    if (imgInfo.locId === -1 || imgInfo.imgId === -1) return null;
    return account?.locs[imgInfo.locId].imgs[imgInfo.imgId];
  }, [account?.locs, imgInfo.imgId, imgInfo.locId]);

  const setOpen = useMemo(() => {
    return (open: boolean) => {
      if (!open) {
        router.back();
      }
    };
  }, [router]);

  //TODO theme, profile, account
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-screen min-h-0 ">
        <DialogHeader>
          <DialogTitle>Image</DialogTitle>
        </DialogHeader>
        {open && img && (
          <Image
            src={img}
            width={1920}
            height={1920}
            alt="Image"
            className="aspect-auto h-full min-h-0 object-contain"
          />
        )}
        <div className="flex justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="icon" onClick={() => {}} className="bg-red-500">
                <Trash2 />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Image</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogDescription>
                Are you sure you want to delete this image?
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    const imgs = account?.locs[imgInfo.locId].imgs.filter(
                      (_, i) => i !== imgInfo.imgId
                    );
                    const loc = { ...account?.locs[imgInfo.locId], imgs };
                    account?.locsDispatch({
                      type: "edit",
                      index: imgInfo.locId,
                      location: loc,
                    });
                    router.back();
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DialogContent>
    </Dialog>
  );
};

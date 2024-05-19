import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useMemo } from "react";

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
import Zoom from "react-medium-image-zoom";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export const ImageDL = () => {
  const params = useSearchParams();
  const router = useRouter();

  const setOpen = useMemo(() => {
    return (open: boolean) => {
      if (!open) {
        router.back();
      }
    };
  }, [router]);

  const url = params.get("url");
  const open = params.get("openImage") === "true";

  //TODO theme, profile, account
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-screen min-h-0 w-screen p-0">
        <TransformWrapper>
          <TransformComponent>
            {open && url && (
              <Image
                src={decodeURIComponent(url)}
                width={1920}
                height={1920}
                alt="Image"
                className="aspect-auto h-full min-h-0 min-w-0 w-full object-contain"
              />
            )}
          </TransformComponent>
        </TransformWrapper>
      </DialogContent>
    </Dialog>
  );
};

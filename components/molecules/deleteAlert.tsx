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
import { useState } from "react";

type DeleteAlertProps = {
  title: string;
  description: string;
  confirmText?: string;
  onConfirm: () => void;
  children?: React.ReactNode;
  open?: boolean;
  setOpen?: (v: boolean) => void;
};
export const DeleteAlert = ({
  title,
  description,
  confirmText,
  onConfirm,
  children,
  open,
  setOpen,
}: DeleteAlertProps) => {
  const [_open, _setOpen] = useState(false);

  return (
    <AlertDialog open={open || _open} onOpenChange={setOpen || _setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>{description}</AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onConfirm();
            }}
          >
            {confirmText || "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

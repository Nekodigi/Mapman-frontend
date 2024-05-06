import { useCallback, useContext, useEffect, useMemo, useState } from "react";


import { LocCatDD } from "../molecules/locCatDD";
import { StarsToggle } from "../molecules/starsToggle";
import { HoursDD } from "../organisms/hoursDD";
import { LocPicker } from "../organisms/locPicker";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LCategory, Location, MapType } from "@/type/location";
import { AccountContext } from "../context/account";

export const EditLocation = () => {
  const hours: number[][] = [[0, 0], [20, 34], [20, 34], [20, 34], [20, 34], [20, 34], [0, 0]]
  const account = useContext(AccountContext);
  const locEditor = useMemo(() => account?.locEditor, [account]);
  const loc = useMemo(() => locEditor?.loc, [locEditor]);
  const setLoc = useMemo(() => locEditor?.setLoc, [locEditor]);
  const open = useMemo(() => locEditor?.open, [locEditor]);
  const setOpen = useMemo(() => locEditor?.setOpen, [locEditor]);

  // const handleSubmit = () => {
  //   setOpen(false);
  //   //separate below part to useEffect
  //   // console.log(loc)
  //   // if (locEditor?.id === -1){
  //   //   account?.locsDispatch({type: "add", loc: loc})
  //   // }else{
  //   //   account?.locsDispatch({type: "edit", loc: loc})
  //   // }


  //     }


  // useEffect(() => {
  //   console.log("writing")
  //     console.log(loc)
  //       if (locEditor?.id === -1){
  //         account?.locsDispatch({type: "add", loc: loc})
  //       }else{
  //         account?.locsDispatch({type: "edit", loc: loc})
  //       }
  // }, [open])
  
  if (!loc || !setLoc || !open || !setOpen) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      {/* <DialogTrigger>Edit</DialogTrigger> */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Spot</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-4">
          <Label className="min-w-20 text-right">Name</Label>
          <Input value={loc.name} onChange={(e) => {
            setLoc(
              {
                ...loc,
                name: e.target.value
              }
            )
          }}
            //trigger when finish hit enter
            onKeyDown={
              async (e) => {
                if (e.key === "Enter") {
                  const location = await fetch(`/api/location?name=${loc.name}`, { method: "POST" }).then((res) => res.json());
                  if (location) {
                    setLoc(location);
                }
              }}}

          />
        </div>
        <div className="flex items-center gap-4">
          <div className="min-w-20 text-right">
          <LocCatDD lcat={loc.category} setLcat={
            (lc: LCategory) => setLoc({
              ...loc,
              category: lc
            })
          } />
          </div>
          <StarsToggle stars={loc.importance} setStars={
            (star: number) => setLoc({
              ...loc,
              importance: star
            })
          } />
        </div>
        <div className="flex items-center gap-4">
          <Label className="min-w-20 text-right">Hours</Label>
          <HoursDD hours={loc.hours!} setHours={
            (h: number[][]) => setLoc({
              ...loc,
              hours: h
            })
          } />
        </div>
        <LocPicker loc={loc} setLoc={setLoc} />
        <div className="flex items-center gap-4">
          <Label className="min-w-20 text-right">Map</Label>
        <ToggleGroup
        value={loc.map}
        onValueChange={(newMap: string) => {
          newMap !== "" && setLoc({
            ...loc,
            map: newMap as MapType
          });
        }}
        type="single"
      >
        <ToggleGroupItem value="google">Google</ToggleGroupItem>
        <ToggleGroupItem value="gaode">Gaode</ToggleGroupItem>
      </ToggleGroup>
      </div>
        <Button onClick={locEditor?.finish}>Submit</Button>
      </DialogContent>
    </Dialog>
  );
}

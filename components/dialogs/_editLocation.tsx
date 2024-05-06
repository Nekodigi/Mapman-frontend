import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { LocCatDD } from "../molecules/locCatDD";
import { StarsToggle } from "../molecules/starsToggle";
import { HoursDD } from "../organisms/hoursDD";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LCategory } from "@/type/location";

const LCategoryLUT = [
  "museum",
  "park",
  "landmark",
  "shop",
  "restaurant",
  "other",
] as const;
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  category: z.enum(LCategoryLUT),
  importance: z.number().int().min(1).max(3),
  hours: z.array(z.array(z.number().int().min(0).max(48))),
});

export function ProfileForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "museum",
      importance: 1,
      hours: [
        [0, 0],
        [20, 34],
        [20, 34],
        [20, 34],
        [20, 34],
        [20, 34],
        [0, 0],
      ],
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  const [lcat, setLcat] = useState<LCategory>("museum");
  const [importance, setImportance] = useState(1);
  const [map, setMap] = useState("google");
  const [hours, setHours] = useState<number[][]>([
    [0, 0],
    [20, 34],
    [20, 34],
    [20, 34],
    [20, 34],
    [20, 34],
    [0, 0],
  ]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-4">
                <FormLabel className="min-w-20 text-right">Name*</FormLabel>
                <FormControl>
                  <Input placeholder="San Francisco" {...field} required />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-4">
          <FormLabel className="w-20 min-w-20 text-right">
            Category & Importance*
          </FormLabel>
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <LocCatDD
                    lcat={field.value}
                    setLcat={(lc) => {
                      field.onChange({
                        target: {
                          value: lc,
                        },
                      });
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="importance"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <StarsToggle
                    stars={field.value}
                    setStars={(star) => {
                      field.onChange({
                        target: {
                          value: star,
                        },
                      });
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="hours"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-4">
                <FormLabel className="min-w-20 text-right">Hours</FormLabel>
                <FormControl>
                  <HoursDD
                    hours={field.value}
                    setHours={(h) => {
                      field.onChange({
                        target: {
                          value: h,
                        },
                      });
                    }}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormItem>
          <div className="flex items-center gap-4">
            <FormLabel className="min-w-20 text-right">Price</FormLabel>
            <FormControl>
              <Input placeholder="Free" {...field} required />
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>

        <FormItem>
          <div className="flex items-center gap-4">
            <FormLabel className="min-w-20 text-right">Lon,Lat*</FormLabel>
            <FormControl>
              <Input placeholder="10.00,10.00" {...field} required />
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
        <FormItem>
          <div className="flex items-center gap-4">
            <FormLabel className="w-20 text-right">Map</FormLabel>

            <ToggleGroup
              value={map}
              onValueChange={(newMap: string) => {
                newMap !== "" && setMap(newMap);
              }}
              type="single"
            >
              <ToggleGroupItem value="google">Google</ToggleGroupItem>
              <ToggleGroupItem value="gaode">Gaode</ToggleGroupItem>
            </ToggleGroup>
            <FormMessage />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex items-center gap-4">
            <FormLabel className="min-w-20 text-right">Website</FormLabel>
            <FormControl>
              <Input placeholder="https://..." {...field} required />
            </FormControl>
          </div>
          <FormMessage />
        </FormItem> */}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

type EditLocationProps = {
  loc: Location;
  onClose: () => void;
  onSave: (loc: Location) => void;
};
export const EditLocation = () => {
  return (
    <div>
      <Dialog>
        <DialogTrigger>Edit</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Spot</DialogTitle>
          </DialogHeader>
          <ProfileForm />
        </DialogContent>
      </Dialog>
      <ProfileForm />
    </div>
  );
};

import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    // full height but there will be header and footer
    <main className="flex flex-grow">
      <Button>Click me</Button>
    </main>
  );
}

"use client";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { AccountContext } from "../context/account";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

type SearchProps = {
  finish: (name: string) => void;
  search: (query: string) => string[] | undefined;
};
export const Search = ({ finish, search }: SearchProps) => {
  const [inputText, setInputText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null); //focus related control
  const commandRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string>();
  const router = useRouter();
  const account = useContext(AccountContext);
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    []
  );

  const handleClickOutside = (event: MouseEvent) => {
    if (
      commandRef.current &&
      !commandRef.current.contains(event.target as any)
    ) {
      setOpen(false);
    }
  };

  const createNew = () => {
    if (inputText) {
      account?.locEditor.invoke(-1, inputText);
      setInputText("");
      inputRef.current?.blur();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const searchResults = useMemo(
    () => search(inputText) || [],
    [inputText, search]
  );
  return (
    <div className="pointer-events-auto shadow-lg">
      <Command
        ref={commandRef}
        shouldFilter={false}
        onKeyDown={handleKeyDown}
        value={selected}
        className="h-12 w-full overflow-visible"
      >
        <CommandInput
          value={inputText}
          ref={inputRef}
          placeholder="Search place..."
          onValueChange={(text) => {
            setInputText(text);
            // clear selected when reedit
            if (selected) {
              setSelected(undefined);
            }
          }}
          onClick={() => {
            router.push("/map");
          }}
          onFocus={() => {
            setOpen(true);
            if (selected) {
              setInputText("");
              setSelected(undefined);
              //inputRef.current?.select(); // select all if selected when focus
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && searchResults?.length === 0) {
              createNew();
            }
          }}
        />
        <div className="relative">
          {!selected && open && (
            <CommandList className="bg-background absolute left-0 top-0 w-full rounded shadow-md">
              <CommandEmpty className="text-muted-foreground ">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    createNew();
                  }}
                >{`Create "${inputText}"...`}</Button>
              </CommandEmpty>
              {searchResults?.map((v) => (
                <CommandItem
                  className="flex items-center gap-2"
                  onSelect={() => {
                    if (!v) return;
                    inputRef.current?.blur();
                    finish(v);
                    setSelected(v);
                    setOpen(false);
                    //setInputText("");
                    //setInputText(v);
                  }}
                  value={v}
                  key={v}
                >
                  {v}
                </CommandItem>
              ))}
            </CommandList>
          )}
        </div>
      </Command>
    </div>
  );
};

"use client";
import {
  useCallback,
  useContext,
  useEffect,
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

type SearchProps = {
  finish: (name: string) => void;
  search: (query: string) => string[] | undefined;
};
export const Search = ({ finish, search }: SearchProps) => {
  const [inputText, setInputText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null); //focus related control
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string>();
  const [searchResults, setSearchResults] = useState<string[]>([]);
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

  useEffect(() => {
    setSearchResults(search(inputText) || []);
  }, [inputText]);
  return (
    <div className="pointer-events-auto">
      <Command
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
          onBlur={() => setOpen(false)}
          onFocus={() => {
            setOpen(true);
            if (selected) {
              inputRef.current?.select(); // select all if selected when focus
            }
          }}
        />
        <div className="relative">
          {(!selected || open) && (
            <CommandList className="bg-background absolute left-0 top-0 w-full rounded shadow-md">
              <CommandEmpty className="text-muted-foreground px-4 py-2">
                No Hit
              </CommandEmpty>
              {searchResults?.map((v) => (
                <CommandItem
                  className="flex items-center gap-2"
                  onSelect={() => {
                    setSelected(v);
                    setInputText(v);
                    finish(v);
                    inputRef.current?.blur();
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

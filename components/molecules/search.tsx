"use client";
import { Search as JSSearch } from "js-search";
import {
  FC,
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
import { Location } from "@/type/location";

export const Search: FC = () => {
  const inputRef = useRef<HTMLInputElement>(null); //focus related control
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string>();
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [inputText, setInputText] = useState("");
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

  const search = useMemo(() => {
    const s = new JSSearch("locs");
    s.addIndex("name");
    s.addDocuments(account?.locs || []);
    return s;
  }, [account]);

  useEffect(() => {
    //setSearchResults(search.search(inputText).map((v) => (v as Location).name));
    //console.log(inputText);
    //console.log(search.search(inputText).map((v) => (v as Location).name));
    //setSearchResults(["a", "b", "c"]);
    if (!account) {
      return;
    }
    const result = inputText === "" ? account?.locs : search.search(inputText);
    setSearchResults(result.map((v) => (v as Location).name));
  }, [inputText, account, search]);
  return (
    <Command
      shouldFilter={false}
      onKeyDown={handleKeyDown}
      value={selected}
      className="w-full h-12 overflow-visible  pointer-events-auto"
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
        {!selected && open && (
          <CommandList className="absolute left-0 top-0 w-full rounded bg-background shadow-md">
            <CommandEmpty className="text-muted-foreground px-4 py-2">
              No Hit
            </CommandEmpty>
            {searchResults?.map((v) => (
              <CommandItem
                className="flex items-center gap-2"
                onSelect={() => {
                  setSelected(v);
                  setInputText(v);
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
  );
};

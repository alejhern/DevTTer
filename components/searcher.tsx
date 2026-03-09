"use client";
import type { User } from "@/types";

import { Avatar, Input, Kbd } from "@heroui/react";
import NextLink from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { SearchIcon } from "@/components/icons";
import { searchUsers } from "@/firebase/user";

const searchInput = (ref: React.RefObject<HTMLInputElement>) => (
  <Input
    ref={ref}
    aria-label="Search"
    classNames={{
      inputWrapper: "bg-default-100",
      input: "text-sm",
    }}
    endContent={
      <Kbd className="hidden lg:inline-block" keys={["ctrl"]}>
        K
      </Kbd>
    }
    labelPlacement="outside"
    placeholder="Search..."
    startContent={
      <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
    }
    type="search"
  />
);

export default function Searcher() {
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [results, setResults] = useState<User[] | undefined>(undefined);

  const performSearch = useCallback(async (query: string) => {
    if (query.trim() === "") return setResults(undefined);

    try {
      const results = await searchUsers(query);

      console.log("Search results:", results);
      setResults(results);
    } catch (error) {
      console.error("Search error:", error);
    }
  }, []);

  useEffect(() => {
    const input = inputRef.current;

    if (!input) return;

    const handleInput = () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        performSearch(input.value);
      }, 300);
    };

    input.addEventListener("input", handleInput);

    return () => {
      input.removeEventListener("input", handleInput);
    };
  }, [performSearch]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const onRedirect = useCallback(() => {
    setResults(undefined);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  return (
    <>
      {searchInput(inputRef)}
      {results && (
        <div className="absolute top-full mt-2 w-full max-w-xs bg-white dark:bg-gray-900 rounded-lg shadow-xl z-20 overflow-hidden border border-gray-200 dark:border-gray-700">
          {results.length > 0 ? (
            results.map((user) => (
              <NextLink
                key={user.id}
                className="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                href={`/users/${user.id}`}
                onClick={onRedirect}
              >
                <Avatar
                  isBordered
                  className="mr-3"
                  color="secondary"
                  name={user.userName}
                  size="sm"
                  src={user.avatar}
                />
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  @{user.userName}
                </span>
              </NextLink>
            ))
          ) : (
            <p className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
              No results found
            </p>
          )}
        </div>
      )}
    </>
  );
}

"use client";

import { Search } from "lucide-react";
import { useState } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  onSearch,
  placeholder = "Search...",
  className,
}: SearchInputProps) {
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSearch?.(query);
  }

  return (
    <form onSubmit={handleSubmit}>
      <InputGroup className={cn("rounded-full", className)}>
        <InputGroupInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
        />

        <InputGroupAddon align="inline-end">
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="rounded-full"
          >
            <Search className="h-5 w-5" />
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}

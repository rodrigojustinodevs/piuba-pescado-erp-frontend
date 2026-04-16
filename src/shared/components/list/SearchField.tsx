'use client';

import { Input } from '../ui/Input';
import { Search } from 'lucide-react';

export function SearchField({
  search,
  setSearch,
  setCurrentPage,
  placeholder,
}: {
  search: string;
  setSearch: (next: string) => void;
  setCurrentPage: (next: number) => void;
  placeholder: string;
}) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="pl-9"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
      />
    </div>
  );
}

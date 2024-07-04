import { Input } from "../ui/input";

export default function SearchBar2({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (query: string) => void;
}) {
  return (
    <div className="justify-between items-center hidden sm:flex mr-2.5">
      <Input
        placeholder="search title"
        className="focus-visible:ring-2 focus-visible:ring-blue-1 focus-visible:ring-offset-2"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}

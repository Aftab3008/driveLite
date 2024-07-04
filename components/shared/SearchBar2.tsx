// import Image from "next/image";
// import { Input } from "../ui/input";
// import { useEffect, useState } from "react";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/lib/useDebounce";
// import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

// export default function SearchBar2() {
//   const [search, setSearch] = useState("");
//   const searchParams = useSearchParams();
//   const navigate = useRouter().push;

//   useEffect(() => {
//     const delayDebounceFn = setTimeout(() => {
//       let newUrl = "";
//       if (search) {
//         newUrl = formUrlQuery({
//           params: searchParams.toString(),
//           key: "search",
//           value: search,
//         });
//       } else {
//         newUrl = removeKeysFromQuery({
//           params: searchParams.toString(),
//           keysToRemove: ["search"],
//         });
//       }
//       navigate(newUrl, { scroll: false });
//     }, 300);
//     return () => clearTimeout(delayDebounceFn);
//   }, [search, searchParams, navigate]);

//   return (
//     <div className="relative mt-8 block">
//       <Input
//         className="input-class py-6 pl-12 focus-visible:ring-offset-orange-1"
//         placeholder="Search for podcasts"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         onLoad={() => setSearch("")}
//       />
//     </div>
//   );
// }

import { Input } from "@/components/ui/input";

export default function SearchBar2({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (query: string) => void;
}) {
  return (
    <div className="flex gap-2 items-center">
      <Input
        placeholder="search title"
        className="focus-visible:ring-2 focus-visible:ring-blue-1 focus-visible:ring-offset-2"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}

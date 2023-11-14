"use client";

import { useMemo, useState } from "react";

// Types
import { Cities } from "@/type";

interface Props {
  cities: Cities;
}

const List = ({ cities }: Props) => {
  const [query, setQuery] = useState("");

  const filteredList = useMemo(() => {
    return cities.filter(({ name }) =>
      query === "" ? true : name.toLowerCase().includes(query)
    );
  }, [query, cities]);

  return (
    <div className="max-w-3xl mx-auto my-12">
      <form className="bg-neutral-900 text-white px-6 py-4 rounded-3xl grid gap-2 shadow-neutral-900/20 shadow-xl">
        <label className="text-2xl font-semibold" htmlFor="search">
          Search
        </label>
        <input
          className="rounded-xl px-4 py-2 bg-neutral-700 text-white"
          onKeyDown={(e) =>
            setQuery((e.target as HTMLInputElement).value.toLowerCase())
          }
        />
      </form>
      <ol className="grid gap-2 my-4">
        {filteredList.map(({ name, population }) => (
          <li
            key={name}
            className="grid gap-2 px-6 py-4 rounded-3xl bg-neutral-100"
          >
            <p className="text-lg font-semibold">{name}</p>
            <p className="text-sm opacity-75 font-mono uppercase">
              population: {population}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default List;

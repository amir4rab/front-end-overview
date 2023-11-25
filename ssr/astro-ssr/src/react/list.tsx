import { useMemo, useState } from "react";

// Types
import type { Cities } from "../types";

interface Props {
  cities: Cities;
}

interface Props {
  cities: Cities;
}

const List = ({ cities }: Props) => {
  const [query, setQuery] = useState("");
  const [hiddenItems, setHiddenItem] = useState<Record<string, boolean>>({});

  const filteredList = useMemo(() => {
    return cities.filter(({ name, population }) => {
      if (hiddenItems[name + population]) return false;
      return query === "" ? true : name.toLowerCase().includes(query);
    });
  }, [hiddenItems, query]);

  return (
    <div className="max-w-3xl mx-auto my-12">
      <form className="bg-neutral-900 text-white px-6 py-4 rounded-3xl grid gap-2 shadow-neutral-900/20 shadow-xl">
        <div className="flex justify-between">
          <label className="text-2xl font-semibold" htmlFor="search">
            Search
          </label>
          {Object.values(hiddenItems).length !== 0 && (
            <button
              onClick={() => setHiddenItem({})}
              className="text-sm underline hover:text-green-200 transition-colors duration-200"
            >
              Clear {Object.values(hiddenItems).length} hidden items
            </button>
          )}
        </div>
        <input
          className="rounded-xl px-4 py-2 bg-neutral-700 text-white"
          onKeyUp={(e) =>
            setQuery((e.target as HTMLInputElement).value.toLowerCase())
          }
        />
      </form>
      <ol className="grid gap-2 my-4">
        {filteredList.map(({ name, population }) => (
          <li
            key={name + population}
            data-hidden={hiddenItems?.[name + population]}
            className={[
              "grid",
              "gap-2",
              "px-6",
              "py-4",
              "rounded-3xl",
              "bg-neutral-100",
              "data-[hidden=true]:hidden",
              "shadow-xl",
              "shadow-transparent",
              "hover:shadow-neutral-900/10",
              "hover:scale-[101%]",
              "transition-[box-shadow,transform]",
              "duration-150",
            ].join(" ")}
          >
            <div className="flex justify-between">
              <p className="text-lg font-semibold">{name}</p>
              <button
                className="px-4 py-1 rounded-3xl bg-neutral-200 text-sm capitalize hover:bg-neutral-300 transition-color duration-150"
                onClick={() => {
                  setHiddenItem((curr) => ({
                    ...curr,
                    [name + population]: true,
                  }));
                }}
              >
                hide
              </button>
            </div>
            <p className="text-sm opacity-75 font-mono uppercase">
              population: {population.toLocaleString("en-US")}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default List;

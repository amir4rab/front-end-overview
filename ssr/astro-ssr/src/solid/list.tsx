/** @jsxImportSource solid */

import { For, createMemo, createSignal } from "solid-js";

// Types
import { Cities } from "../type";

interface Props {
  cities: Cities;
}

const List = ({ cities }: Props) => {
  const [query, setQuery] = createSignal("");
  const [hiddenItems, setHiddenItem] = createSignal<Record<string, boolean>>(
    {}
  );

  const filteredList = createMemo(() => {
    return cities.filter(({ name, population }) => {
      if (hiddenItems()[name + population]) return false;
      return query() === "" ? true : name.toLowerCase().includes(query());
    });
  });

  return (
    <div class="max-w-3xl mx-auto my-12">
      <form class="bg-neutral-900 text-white px-6 py-4 rounded-3xl grid gap-2 shadow-neutral-900/20 shadow-xl">
        <div class="flex justify-between">
          <label class="text-2xl font-semibold" for="search">
            Search
          </label>
          {Object.values(hiddenItems()).length !== 0 && (
            <button
              onClick={() => setHiddenItem({})}
              class="text-sm underline hover:text-green-200 transition-colors duration-200"
            >
              Clear {Object.values(hiddenItems()).length} hidden items
            </button>
          )}
        </div>
        <input
          class="rounded-xl px-4 py-2 bg-neutral-700 text-white"
          onKeyUp={(e) =>
            setQuery((e.target as HTMLInputElement).value.toLowerCase())
          }
        />
      </form>
      <ol class="grid gap-2 my-4">
        <For
          each={filteredList()}
          fallback={
            <p class="text-sm text-center font-mono my-4">
              Sorry, Couldn't found any results
            </p>
          }
        >
          {({ name, population }) => (
            <li
              data-hidden={hiddenItems()?.[name + population]}
              class={[
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
              <div class="flex justify-between">
                <p class="text-lg font-semibold">{name}</p>
                <button
                  class="px-4 py-1 rounded-3xl bg-neutral-200 text-sm capitalize hover:bg-neutral-300 transition-color duration-150"
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
              <p class="text-sm opacity-75 font-mono uppercase">
                population: {population.toLocaleString("en-US")}
              </p>
            </li>
          )}
        </For>
      </ol>
    </div>
  );
};

export default List;

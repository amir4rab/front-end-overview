/** @jsxImportSource solid */

import { For, createMemo, createSignal } from "solid-js";

// Types
import { Cities } from "../type";

interface Props {
  cities: Cities;
}

const List = ({ cities }: Props) => {
  const [query, setQuery] = createSignal("");

  const filteredList = createMemo(() => {
    return cities.filter(({ name }) =>
      query() === "" ? true : name.toLowerCase().includes(query())
    );
  });

  return (
    <div class="max-w-3xl mx-auto my-12">
      <form class="bg-neutral-900 text-white px-6 py-4 rounded-3xl grid gap-2 shadow-neutral-900/20 shadow-xl">
        <label class="text-2xl font-semibold" for="search">
          Search
        </label>
        <input
          class="rounded-xl px-4 py-2 bg-neutral-700 text-white"
          onKeyDown={(e) =>
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
            <li class="grid gap-2 px-6 py-4 rounded-3xl bg-neutral-100">
              <p class="text-lg font-semibold">{name}</p>
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

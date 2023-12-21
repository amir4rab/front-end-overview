import { createResource } from "solid-js";
import { createAsync } from "@solidjs/router";

// Types
import { Cities } from "~/type";

// Components
import List from "~/components/list";

const dataFetcher = async () => {
  const date = new Date();
  const renderTime = `${date.getUTCHours().toString().padStart(2, "0")}:${date
    .getUTCMinutes()
    .toString()
    .padStart(2, "0")}:${date
    .getUTCSeconds()
    .toString()
    .padStart(2, "0")}:${date
    .getUTCMilliseconds()
    .toString()
    .padStart(2, "0")}`;

  const res = await fetch("http://localhost:3090");
  const data = (await res.json()) as {
    cities: Cities;
    license: string;
    credit: string;
  };

  return { data, renderTime };
};

export default function Home() {
  const res = createAsync(dataFetcher);

  return (
    <main>
      {res() && (
        <>
          <p class="bg-black text-white font-mono text-center py-2 text-sm">
            Rendered at {res()!.renderTime} by{" "}
            <span class="font-bold">Solid</span>
          </p>
          <p class="max-w-3xl rounded-3xl mt-6 px-8 py-6 bg-neutral-100 font-mono mx-auto">
            {res()!.data?.license}
          </p>
          {res()!.data && <List cities={res()!.data!.cities} />}
          <p class="max-w-3xl rounded-3xl my-6 px-8 py-6 bg-yellow-200/50 shadow-yellow-200/10 shadow-xl text-xs border border-yellow-200 font-mono mx-auto">
            All the ciredit for the provided data goes to {res()!.data?.credit}
          </p>
        </>
      )}
    </main>
  );
}

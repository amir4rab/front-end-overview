import { createResource } from "solid-js";
import { useRouteData } from "solid-start";

// Types
import { Cities } from "~/type";

// Components
import List from "~/components/list";

export function routeData() {
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

  const [data] = createResource<{
    cities: Cities;
    license: string;
    credit: string;
  }>(async () => await fetch("http://localhost:3090").then((d) => d.json()));

  return { data, renderTime };
}

export default function Home() {
  const { data, renderTime } = useRouteData<typeof routeData>();

  return (
    <main>
      <p class="bg-black text-white font-mono text-center py-2 text-sm">
        Rendered at {renderTime} by <span class="font-bold">Solid</span>
      </p>
      <p class="max-w-3xl rounded-3xl mt-6 px-8 py-6 bg-neutral-100 font-mono mx-auto">
        {data()?.license}
      </p>
      {data() && <List cities={data()!.cities} />}
      <p class="max-w-3xl rounded-3xl my-6 px-8 py-6 bg-yellow-200/50 shadow-yellow-200/10 shadow-xl text-xs border border-yellow-200 font-mono mx-auto">
        All the ciredit for the provided data goes to {data()?.credit}
      </p>
    </main>
  );
}

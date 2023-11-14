// Types
import { Cities } from "@/type";

// Components
import List from "@/components/list";

// Forcing the page to be fully dynamic
export const dynamic = "force-dynamic";

// Data Fetching
async function getData() {
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

  const { cities, credit, license } = (await fetch("http://localhost:3090", {
    cache: "no-store",
  }).then((data) => data.json())) as {
    cities: Cities;
    license: string;
    credit: string;
  };

  return { renderTime, cities, credit, license };
}

export default async function Home() {
  const { renderTime, cities, credit, license } = await getData();

  return (
    <main>
      <p className="bg-black text-white font-mono text-center py-2 text-sm">
        Rendered at {renderTime}
      </p>
      <p className="max-w-3xl rounded-3xl mt-6 px-8 py-6 bg-neutral-100 font-mono mx-auto">
        {license}
      </p>
      <List cities={cities} />
      <p className="max-w-3xl rounded-3xl mt-6 px-8 py-6 bg-yellow-200/50 shadow-yellow-200/10 shadow-xl text-xs border border-yellow-200 font-mono mx-auto">
        All the ciredit for the provided data goes to {credit}
      </p>
    </main>
  );
}

// Types
import { type Setter } from "solid-js";
import type { Cities } from "./types";

// Solid
import { createSignal, Show, onMount, createEffect } from "solid-js";

// Components
import List from "./components/list";

type FetchedData = {
  cities: Cities;
  license: string;
  credit: string;
};

const getCities = async (setter: Setter<FetchedData | null>) => {
  if (typeof window === "undefined") return;

  // @ts-ignore
  if (typeof embeddedCitiesData !== "undefined") {
    // @ts-ignore
    setter(embeddedCitiesData);
    return;
  }

  try {
    fetch("http://localhost:3090")
      .then((res) => res.json() as Promise<FetchedData>)
      .then((data) => setter(data));
  } catch (err) {
    console.error("Failed to fetch from API: ", err);
  }
};

const getRenderTime = async (setter: Setter<{ renderTime: string } | null>) => {
  if (typeof window === "undefined") return;

  // @ts-ignore
  if (typeof embeddedRenderedTime !== "undefined") {
    // @ts-ignore
    setter(embeddedRenderedTime);
    return;
  }

  setter({ renderTime: "N/A" });
};

function App() {
  const [csrStart, setCSRStart] = createSignal<null | number>(null);
  const [data, setData] = createSignal<FetchedData | null>(null);
  const [analytics, setAnalytics] = createSignal<{ renderTime: string } | null>(
    null
  );

  onMount(() => {
    setCSRStart(performance.now());
    getCities(setData);
    getRenderTime(setAnalytics);
  });

  createEffect(() => {
    if (data() !== null && analytics() !== null) {
      const csrEnd = performance.now();
      if (csrStart() === null) throw new Error("'csrStart' is undefined");

      console.log(`CSR took ${(csrEnd - csrStart()!).toFixed(2)}ms`);
    }
  });

  return (
    <main>
      <p class="bg-black text-white font-mono text-center py-2 text-sm">
        Rendered at {analytics()?.renderTime} by Golang + Solid ( CSR )
      </p>
      <Show
        when={data() !== null && analytics() !== null}
        fallback={
          <div class="min-h-screen flex justify-center items-center">
            <div class="bg-neutral-100 rounded-3xl shadow-neutral-900/05 shadow-xl px-12 py-4 border border-neutral-200">
              {data() === null && analytics() === null && (
                <p class="text-center">Loading...</p>
              )}
              {data() === null && analytics() !== null && (
                <p class="text-center">Fetching contents...</p>
              )}
            </div>
          </div>
        }
      >
        <p class="max-w-3xl rounded-3xl mt-6 px-8 py-6 bg-neutral-100 font-mono mx-auto">
          {data()!.license}
        </p>
        <List cities={data()!.cities} />
        <p class="max-w-3xl rounded-3xl mt-6 px-8 py-6 bg-yellow-200/50 shadow-yellow-200/10 shadow-xl text-xs border border-yellow-200 font-mono mx-auto">
          All the ciredit for the provided data goes to {data()!.credit}
        </p>
      </Show>
    </main>
  );
}

export default App;

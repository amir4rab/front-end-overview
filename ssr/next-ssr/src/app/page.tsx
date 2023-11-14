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

  return { renderTime };
}

export default async function Home() {
  const { renderTime } = await getData();

  return (
    <main>
      <p className="bg-black text-white font-mono text-center py-2 text-sm">
        Rendered at {renderTime}
      </p>
      <h1>Hello world</h1>
    </main>
  );
}

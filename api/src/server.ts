import data from "./cities.json";

const strigifiedData = JSON.stringify(data);

const server = Bun.serve({
  port: 3090,
  fetch() {
    return new Response(strigifiedData, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 200,
    });
  },
});

console.log(`Listening on localhost: ${server.port}`);

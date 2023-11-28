# Benchmarking Guide

> [!CAUTION]
> The Following Application is designed solely to test the rendering performance of some rendering frameworks. In many cases, the applications are IO-bound and not bounded by rendering performance!  

## Prerequisites

For running the benchmarks you need to have the following Applications / Environments:
  - A Linux Environment ( preferably using a VDS for the most consistent results )
  - Node JS version 21
  - PNPM version 8
  - Go version 1.21

## Package Installation and Building

For building each of the applications your commands are as listed below, keep in mind for each one you have to move to their root directory, for example in case you want to build the `solid-ssr` you have to run the following command from the root of this project, `cd ssr/solid-ssr`.

### [API](./api)

Building the Application
```bash
go build ./server.go
```

### [SSR](./ssr/)
For the SSR applications you need to run the following code for each of them

Installing The Packages
```bash
pnpm i
```

Building The Application
```bash
pnpm run build
```
The SSR applications are as follows: 

- [Angular SSR](./ssr/angular-ssr)
- [Astro SSR](./ssr/astro-ssr)
- [Next SSR](./ssr/next-ssr)
- [Solid SSR](./ssr/solid-ssr)

### [PSSR](./pssr)

#### Building the client end [Solid Application](./pssr/client/)

Installing The Packages
```bash
cd client
pnpm i
```

Building The Application
```bash
pnpm run build && pnpm run post-build
```

#### Building The [Go Server](./pssr/go-server/)

Building the Application
```bash
go build go-server/server.go
```

## Running The Benchmarks

For Benchmarking the Applications I've used [`autocannon`](https://github.com/mcollina/autocannon) which is a "fast HTTP/1.1 benchmarking tool written in Node.js", as described by its authors.

First of all, you need to start the main API, by running the API application available at `api/server`. Then you need to start each of the services and run the following command

```bash
npx autocannon -c 50 -d 120 -p 10 <applciation-local-address>
```

Then after 120s, the results will be displayed.

> [!NOTE]
> In my testing Next JS couldn't handle 50 connections so I had to throttle down the connection count to 10, which means you have to run autocannon with the following command.
> ```
> npx autocannon -c 10 -d 120 -p 10 <applciation-local-address>
> ```

> [!TIP]
> Since the V8 engine performs better after a certain amount of warmups, try to run the benchmarks at least twice and ignore the first run results.

To run each application you need to go to its root directory and run the following commands:

- For [`next-ssr`](./ssr/next-ssr), [`solid-ssr`](./ssr/solid-ssr/) run the following command
  ```bash
  pnpm run start
  ```
- For [`astro-ssr`](./ssr/astro-ssr) run the following command
  ```bash
  pnpm run preview
  ```
- For [`angular-ssr`](./ssr/angular-ssr) run the following command
  ```bash
  pnpm run serve:ssr:angular-ssr
  ```
- For [`pssr`](./pssr) run the following command
  ```bash
  ./server/go-server
  ```
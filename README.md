# Front-End Overview

This is a simple and crude benchmark, comparing some of the popular front-end libraries.

You can find out how to run the benchmark [`here`](./benchmarking-guide.md) or read the paper about it `here` ( coming soon ).

In short, here are the benchmark results running on a VDS with a 2core ( and 4 threads ) CPU and 16g of RAM:

| Name                               | Min  | Median | 97.5%  |
| ---------------------------------- | ---- | ------ | ------ |
| [PSSR - Solid + GO](./pssr/)       | 2127 | 2446   | 2581   |
| [Solid Start](./ssr/solid-ssr/)    | 65   | 177    | 225    |
| [Angular](./ssr/angular-ssr/)      | 38   | 132    | 167    |
| [Astro + Solid](./ssr/astro-ssr/)  | 41   | 106    | 118    |
| [Astro + React](./ssr/astro-ssr/)  | 52   | 79     | 107    |
| [Astro + Preact](./ssr/astro-ssr/) | 24   | 71     | 80     |
| [Next JS](./ssr/next-ssr/)*        | 1    | 28     | 105    |

The benchmarks are the result of stress testing each server with [`autocannon`](https://github.com/mcollina/autocannon) and the following parameters:

```bash
npx autocannon -c 50 -d 120 -p 10 <applciation-local-address> 
```

> [!NOTE]
> In my testing Next JS couldn't handle 50 connections so I had to throttle down the connection count to 10, which means you have to run autocannon with the following command.
> ```
> npx autocannon -c 10 -d 120 -p 10 <applciation-local-address>
> ```

## License
The source code of applications is licensed under [Mozilla Public License Version 2.0](./LICENSE) License.
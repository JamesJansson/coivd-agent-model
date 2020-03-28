import * as Comlink from "https://unpkg.com/comlink/dist/esm/comlink.mjs";

function callback(message) {
    console.log(message);
}

async function init() {
  const worker = new Worker("./worker.js");
  // WebWorkers use `postMessage` and therefore work with Comlink.
  const obj = Comlink.wrap(worker);
  console.log(`Counter: ${await obj.counter}`);

  obj.sendResult(Comlink.proxy(callback));

  await obj.inc();
  console.log(`Counter: ${await obj.counter}`);
}
init();
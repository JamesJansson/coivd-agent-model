import * as Comlink from "https://unpkg.com/comlink/dist/esm/comlink.mjs";

function callback(message) {
  console.log(message);
}

function addToTable(data, tableId) {
  const tableRef = document.getElementById(tableId);

  function addData(row, item) {
    const newCell = row.insertCell();
    const newText = document.createTextNode(item);
    newCell.appendChild(newText);
  }

  data.forEach(element => {
    const newRow = tableRef.insertRow();

    console.log(element.day);

    addData(newRow, element.day);
    addData(newRow, element.susceptible);
    addData(newRow, element.infected);
    addData(newRow, element.recovered);
    addData(newRow, element.newlyInfected);
    addData(newRow, element.newlyRecovered);
  });
}

async function init() {
  const worker = new Worker("./worker.js");
  // WebWorkers use `postMessage` and therefore work with Comlink.
  const obj = Comlink.wrap(worker);
  console.log(`Counter: ${await obj.counter}`);

  obj.sendResult(Comlink.proxy(callback));

  await obj.inc();
  console.log(`Counter: ${await obj.counter}`);

  obj.runSimpleModelWrapper().then(results => {
    addToTable(results, "simple-agent-model-table");
  });
}
init();

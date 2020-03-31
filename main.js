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
    addData(newRow, element.day);
    addData(newRow, element.susceptible);
    addData(newRow, element.infected);
    addData(newRow, element.recovered);
    addData(newRow, element.newlyInfected);
    addData(newRow, element.newlyRecovered);
  });
}

function sendDataToChart() {}

let workerObj;
function init() {
  const worker = new Worker("./worker.js");
  // WebWorkers use `postMessage` and therefore work with Comlink.
  workerObj = Comlink.wrap(worker);
}
init();

async function runModel() {
  await workerObj.runSimpleModelWrapper().then(results => {
    addToTable(results, "simple-agent-model-table");
    sendDataToChart(results);
  });
}

runModel();

// Set up the start button
const buttonRef = document.getElementById("start-button");

buttonRef.addEventListener(
  "click",
  function () {
    // Collect form data here

    runModel();
  },
  false
);

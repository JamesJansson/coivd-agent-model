importScripts("https://unpkg.com/comlink/dist/umd/comlink.js");
importScripts("simple-agent-model.js");
importScripts("simple-compartment-model.js");

const obj = {
  runSimpleAgentModelWrapper(settings) {
    return runSimpleAgentModel(settings);
  },
  runSimpleCompartmentModelWrapper(settings) {
    console.log("cccc");
    return runSimpleCompartmentModel(settings);
  }
};

Comlink.expose(obj);

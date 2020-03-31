importScripts("https://unpkg.com/comlink/dist/umd/comlink.js");
importScripts("simple-agent-model.js");
importScripts("simple-compartment-model.js");

const obj = {
  runSimpleModelWrapper() {
    return runSimpleAgentModel();
  },
  runSimpleCompartmentModelWrapper() {
    return runSimpleCompartmentModel();
  }
};

Comlink.expose(obj);

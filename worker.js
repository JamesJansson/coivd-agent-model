importScripts("https://unpkg.com/comlink/dist/umd/comlink.js");
importScripts("simple-agent-model.js");

const obj = {
  runSimpleModelWrapper(props) {
    return runSimpleAgentModel(props);
  }
};

Comlink.expose(obj);

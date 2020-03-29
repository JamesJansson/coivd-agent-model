importScripts("https://unpkg.com/comlink/dist/umd/comlink.js");
importScripts("simple-model.js");

const obj = {
  counter: 0,
  inc() {
    this.counter++;
    console.log("Hello from inc()");
  },
  async sendResult(cb) {
    cb("callback message 1");
    let a;
    // Do some modelling
    for (let i = 0; i < 1000; i++) {
      a++;
    }
    console.log("console.log message");
    cb("callback message 2");
  },
  runSimpleModelWrapper() {
    runSimpleModel();
  }
};

Comlink.expose(obj);

const Benchmark = require("benchmark");

const suite = new Benchmark.Suite("arr vs obj");

suite
  .add("array", function() {
    const api = arrayRuntime();
    test(api);
  })
  .add("object", function() {
    const api = objRuntime();
    test(api);
  })
  .add("object2", function() {
    const api = objRuntime();
    test(api);
  })
  .on("cycle", function(event) {
    console.log(String(event.target));
  })
  .run();

function test(api) {
  api.push(val => val + 1);
  api.push(val => val + 1);
  api.push(val => val + 1);
  api.push(val => val - 1);
  api.push(val => val - 1);
  api.push(val => val - 1);
  api.push(val => val + 1);
  api.push(val => val + 1);
  api.push(val => val + 1);
  api.push(val => val - 1);
  api.push(val => val - 1);
  api.push(val => val - 1);
  api.push(val => val + 1);
  api.push(val => val + 1);
  api.push(val => val + 1);
  api.push(val => val - 1);
  api.push(val => val - 1);
  api.push(val => val - 1);
  const res = api.run(3);
  if (res !== 3) {
    console.error(`res ${res} != 3`);
  }
}

function arrayRuntime() {
  const noop = () => {};
  let current = [noop, []];

  const push = cb => {
    current = [cb, current];
  };
  const run = src => {
    let ctx = src;
    do {
      ctx = current[0](ctx);
      current = current[1];
    } while (current[1].length === 2);
    return ctx;
  };
  return { push, run };
}

function objRuntime() {
  let current = undefined;
  const push = cb => {
    current = { cb, next: current };
  };
  const run = src => {
    let ctx = src;
    while (current) {
      ctx = current.cb(ctx);
      current = current.next;
    }
    return ctx;
  };
  return { push, run };
}

function objRuntime2() {
  class Node {
    constructor(cb, next) {
      this.cb = cb;
      this.next = next;
    }
  }

  let current = undefined;
  const push = cb => {
    current = new Node(cb, current);
  };
  const run = src => {
    let ctx = src;
    while (current) {
      ctx = current.cb(ctx);
      current = current.next;
    }
    return ctx;
  };
  return { push, run };
}

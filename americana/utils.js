export const zip = function*(...its) {
  its = its.map((x) => x[Symbol.iterator]());
  while (true) {
    let next = its.map((it) => it.next());
    if (next.some((n) => n.done)) {
      return;
    } else {
      yield next.map((n) => n.value);
    }
  }
};


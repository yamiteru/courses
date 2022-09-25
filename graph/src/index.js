import { nanoid } from "nanoid";

const v = {};
const vid = {}

const e = {};
const eid = {};

function addV(type, props) {
    const id = nanoid();

    v[type] ??= {};

    v[type][id] = {
      id,
      type,
      ins: [],
      outs: [],
      ...props
    };

    vid[id] = v[type][id];

    return id;
}

function addE(type, props) {
    const id = nanoid();
    const _e = {
      id,
      type,
      ...props
    };

    e[type] ??= {};

    e[type][id] = _e;
    eid[id] = _e;

    V(props.from).outs.push(id);
    V(props.to).ins.push(id);

    return id;
}

function V(id) {
  return vid[id] || null;
}

function E(id) {
  return eid[id] || null;
}

function filterV(type, predicate = () => true) {
  return v[type]
    ? Object
      .entries(v[type])
      .filter(([_, obj]) => predicate(obj))
      .map(([id, obj]) => ({ id, ...obj }))
    : [];
}

const pe1 = addV("person", { data: { name: "John", age: 45 } });
const pe2 = addV("person", { data: { name: "Karel", age: 37 } });
const pe3 = addV("person", { data: { name: "Frank", age: 21 } });
const pe4 = addV("person", { data: { name: "Tom", age: 14 } });

const pr1 = addV("product", { name: "iPhone 14 Pro" });
const pr2 = addV("product", { name: "iPad 11 Pro" });

addE("friend_with", {
  from: pe1,
  to: pe2,
  data: { since: Date.now() }
});

addE("friend_with", {
  from: pe1,
  to: pe3,
  data: { since: Date.now() }
});

addE("friend_with", {
  from: pe3,
  to: pe4,
  data: { since: Date.now() }
});

addE("bought", {
  from: pe1,
  to: pr1,
  data: { date: Date.now(), price: 1000 }
});

addE("bought", {
  from: pe3,
  to: pr1,
  data: { date: Date.now(), price: 950 }
});

addE("bought", {
  from: pe3,
  to: pr2,
  data: { date: Date.now(), price: 1499 }
});

console.log(
  filterV("person", ({ data: { age } }) => age >= 18)
    .filter(
      ({ outs }) => outs
        .map((id) => E(id))
        .filter(({ type }) => type === "bought")
        .length > 0
    )
    .map(({ outs, data: { name } }) => [
      name,
      outs
        .map((id) => E(id))
        .filter(({ type }) => type === "friend_with")
        .length,
      outs
        .map((id) => E(id))
        .filter(({ type }) => type === "bought")
        .map(({ data: { price } }) => price)
        .reduce((acc, v) => acc + v, 0)
    ])
    .sort((a, b) => a[2] - b[2])
);

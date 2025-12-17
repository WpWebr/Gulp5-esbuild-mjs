export function expandWithDeps(initial, graph) {
  const expanded = new Set(initial);

  function add(name) {
    (graph.get(name) || []).forEach(dep => {
      if (!expanded.has(dep)) {
        expanded.add(dep);
        add(dep);
      }
    });
  }

  initial.forEach(add);
  return expanded;
}

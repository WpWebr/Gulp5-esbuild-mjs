export function topoSort(graph) {
  const visited = new Set();
  const visiting = new Set();
  const result = [];

  function visit(name) {
    if (visited.has(name)) return;

    if (visiting.has(name)) {
      throw new Error(`Cycle detected in component graph: ${name}`);
    }

    visiting.add(name);

    const node = graph.get(name);
    if (node?.deps) {
      node.deps.forEach(visit);
    }

    visiting.delete(name);
    visited.add(name);
    result.push(name);
  }

  for (const name of graph.keys()) {
    visit(name);
  }

  return result;
}

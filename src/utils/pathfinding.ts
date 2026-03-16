export function findShortestPath(startId: string, endId: string, nodes: any[], links: any[]) {
  const adjacency: Record<string, string[]> = {};
  
  // Build simple adjacency list
  links.forEach(link => {
    const sId = typeof link.source === 'object' ? link.source.id : link.source;
    const tId = typeof link.target === 'object' ? link.target.id : link.target;
    
    if (!adjacency[sId]) adjacency[sId] = [];
    if (!adjacency[tId]) adjacency[tId] = [];
    
    adjacency[sId].push(tId);
    adjacency[tId].push(sId);
  });

  const queue: [string, string[]][] = [[startId, [startId]]];
  const visited = new Set([startId]);

  while (queue.length > 0) {
    const [current, path] = queue.shift()!;
    
    if (current === endId) return path;

    const neighbors = adjacency[current] || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, [...path, neighbor]]);
      }
    }
  }

  return null;
}

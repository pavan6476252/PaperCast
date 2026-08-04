import { DocumentSchema, AnyNode } from "@papercast/core";

export function generateDataPaths(
  data: any,
  prefix = "",
  depth = 0,
  maxDepth = 5
): string[] {
  if (
    depth > maxDepth ||
    data === null ||
    data === undefined ||
    typeof data !== "object"
  ) {
    return [];
  }

  const paths: string[] = [];
  if (prefix !== "") paths.push(prefix);

  if (Array.isArray(data)) {
    // For arrays, sample the first item to get its schema structure
    if (data.length > 0) {
      paths.push(...generateDataPaths(data[0], prefix, depth + 1, maxDepth));
    }
  } else {
    for (const key of Object.keys(data)) {
      const newPrefix = prefix ? `${prefix}.${key}` : key;
      paths.push(newPrefix);
      paths.push(
        ...generateDataPaths(data[key], newPrefix, depth + 1, maxDepth)
      );
    }
  }

  return Array.from(new Set(paths)).filter((p) => p !== "");
}

interface AliasContext {
  alias: string;
  boundPath: string;
}

export function getNodeContextPaths(
  schema: DocumentSchema,
  targetNodeId: string
): string[] {
  if (!schema) return [];

  const activeAliases: AliasContext[] = [];

  function walk(node: AnyNode, currentAliases: AliasContext[]): boolean {
    if (!node) return false;

    const nextAliases = [...currentAliases];

    // If it's a repeater, resolve its bound path and add the alias
    if (node.bind?.mode === "repeat" && node.bind.itemAlias && node.bind.path) {
      let resolvedPath = node.bind.path;
      // If the bound path itself uses an existing alias, expand it to global path
      for (const a of currentAliases) {
        if (
          resolvedPath === a.alias ||
          resolvedPath.startsWith(a.alias + ".")
        ) {
          resolvedPath = resolvedPath.replace(a.alias, a.boundPath);
          break;
        }
      }
      nextAliases.push({ alias: node.bind.itemAlias, boundPath: resolvedPath });
    }

    if (node.id === targetNodeId) {
      activeAliases.push(...nextAliases);
      return true;
    }

    if (node.children) {
      for (const child of node.children) {
        if (walk(child, nextAliases)) return true;
      }
    }
    return false;
  }

  // Walk the document body
  if (schema.document?.body) {
    walk(schema.document.body, []);
  }

  // If not found in body, check headers and footers
  if (activeAliases.length === 0 && schema.document?.headers) {
    for (const h of Object.values(schema.document.headers)) {
      if (h.root && walk(h.root, [])) break;
    }
  }
  if (activeAliases.length === 0 && schema.document?.footers) {
    for (const f of Object.values(schema.document.footers)) {
      if (f.root && walk(f.root, [])) break;
    }
  }

  const globalPaths = generateDataPaths(schema.data || {});
  const suggestions = new Set<string>();

  // Add global paths
  globalPaths.forEach((p) => suggestions.add(p));

  // Derive local alias paths by mapping them from the global paths
  for (const a of activeAliases) {
    suggestions.add(a.alias);
    const prefix = a.boundPath + ".";
    for (const gp of globalPaths) {
      if (gp.startsWith(prefix)) {
        const suffix = gp.slice(prefix.length);
        suggestions.add(`${a.alias}.${suffix}`);
      }
    }
  }

  // Sort: Local aliases first, then alphabetical
  return Array.from(suggestions).sort((a, b) => {
    const aIsLocal = activeAliases.some(
      (al) => a === al.alias || a.startsWith(al.alias + ".")
    );
    const bIsLocal = activeAliases.some(
      (al) => b === al.alias || b.startsWith(al.alias + ".")
    );

    if (aIsLocal && !bIsLocal) return -1;
    if (!aIsLocal && bIsLocal) return 1;
    return a.localeCompare(b);
  });
}

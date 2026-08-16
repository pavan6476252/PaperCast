---
name: schema-Icons
description: How to find and use icons for IconNode components
---

# IconNode Requirements

PaperCast uses `lucide-react` for rendering icons via the `Icon` node type.
Because `lucide-react` exports over 1,400 icons, it is difficult to guess the exact name required.

When adding or modifying an `Icon` node (e.g. `type: "icon"`), you **MUST** follow this workflow to ensure the icon renders correctly:

1. **Do not guess icon names**.
2. **Search first**: Use the `search_icons` MCP tool to find the correct `PascalCase` icon name.
   - Example: `search_icons({ query: "arrow right" })`
3. **Use the returned name**: Extract the exact PascalCase name (e.g. `ArrowRight`) returned by the search tool and use it in the `iconName` property.

## Example Node

```json
{
  "id": "my-icon",
  "type": "icon",
  "props": {
    "iconName": "ArrowRight",
    "sizePx": 24,
    "color": "#4F46E5"
  },
  "layout": {
    "marginTop": 8
  }
}
```

## Resiliency

The React renderer has some built-in fallback normalisation (e.g., if you accidentally pass `arrow-right`, it will attempt to normalise it to `ArrowRight`), but you should always strive to use the exact PascalCase export name from `search_icons` to guarantee it resolves perfectly.
